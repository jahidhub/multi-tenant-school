import { Head, Link, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, LogOut } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useState } from 'react';

interface CourseData {
    id: number;
    name: string;
    capacity?: number;
}

interface EnrollmentData {
    id: number;
    course_id: number;
    status: string;
    course?: CourseData | null;
}

interface GradeData {
    id: number;
    exam_id: number;
    marks_obtained: number;
    remarks: string;
    exam?: {
        name: string;
        max_marks: number;
        course?: CourseData | null;
    } | null;
}

interface InvoiceData {
    id: number;
    amount_due: number | string;
    amount_paid: number | string;
    status: string;
    due_date: string;
    fee_structure?: {
        term: string;
    } | null;
}

interface PaymentData {
    id: number;
    amount: number | string;
    method: string;
    paid_at: string;
    reference_no: string | null;
    invoice?: InvoiceData | null;
}

interface StudentProps {
    student: {
        id: number;
        name: string;
        admission_no: string;
        roll_number: string | null;
        class: string;
        dob: string;
        gender: string;
        guardian_name: string;
        guardian_phone: string;
        address: string;
        status: string;
        profile_photo_path: string | null;
    };
    enrollments: EnrollmentData[];
    grades: GradeData[];
    invoices: InvoiceData[];
    payments: PaymentData[];
    courses: any[];
}

export default function StudentShow({ student, enrollments = [], grades = [], invoices = [], payments = [], courses = [] }: StudentProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'grades' | 'billing'>('profile');
    const [isEnrollOpen, setIsEnrollOpen] = useState(false);

    const { data: enrollData, setData: setEnrollData, post: postEnroll, processing: enrollProcessing, reset: resetEnroll, errors: enrollErrors } = useForm({
        course_id: '',
        student_ids: [student.id],
    });

    const handleEnrollSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postEnroll('/enrollment/store', {
            onSuccess: () => {
                setIsEnrollOpen(false);
                resetEnroll();
            }
        });
    };

    const withdraw = (enrollmentId: number) => {
        if(confirm('Are you sure you want to withdraw the student from this course?')) {
            router.post(`/enrollment/${enrollmentId}/withdraw`);
        }
    };

    const handleDownloadReceipt = (paymentId: number) => {
        window.open(`/payments/${paymentId}/receipt`, '_blank');
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'paid':
                return { backgroundColor: '#16a34a', color: '#ffffff' }; // green
            case 'partial':
                return { backgroundColor: '#ea580c', color: '#ffffff' }; // orange
            case 'overdue':
                return { backgroundColor: '#dc2626', color: '#ffffff' }; // red
            default:
                return { backgroundColor: '#4b5563', color: '#ffffff' }; // gray
        }
    };

    return (
        <>
            <Head title={`Student Profile - ${student.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="breadcrumb flex items-center justify-between">
                    <div>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard">
                                        Home
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/students">
                                        Students
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Profile</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div>
                        <Button variant="outline" asChild>
                            <Link href="/students">Back to Students</Link>
                        </Button>
                    </div>
                </div>

                {/* Profile Header */}
                <div className="flex flex-col md:flex-row gap-6 items-center p-6 bg-card border rounded-xl">
                    {student.profile_photo_path ? (
                        <img src={`/storage/${student.profile_photo_path}`} alt="Profile" className="h-20 w-20 rounded-full object-cover shadow-sm border-2 border-primary" />
                    ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-3xl font-bold dark:bg-blue-900/30 dark:text-blue-400">
                            {student.name.charAt(0)}
                        </div>
                    )}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <h1 className="text-3xl font-bold tracking-tight">{student.name}</h1>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {student.status?.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Class: <span className="font-semibold text-foreground">{student.class}</span> | Roll Number: <span className="font-semibold text-foreground">{student.roll_number || 'N/A'}</span> | Admission No: <span className="font-semibold text-foreground">{student.admission_no || 'N/A'}</span>
                        </p>
                    </div>
                </div>

                {/* Tab Switches */}
                <div className="flex border-b border-muted">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                            activeTab === 'profile'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Academic Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('grades')}
                        className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                            activeTab === 'grades'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Grade Book
                    </button>
                    <button
                        onClick={() => setActiveTab('billing')}
                        className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                            activeTab === 'billing'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Billing & Payments
                    </button>
                </div>

                {/* Tab Contents */}
                <div className="mt-4">
                    {activeTab === 'profile' && (
                        <div className="grid gap-6 md:grid-cols-3">
                            {/* Personal Info */}
                            <Card className="md:col-span-1">
                                <CardHeader>Personal Details</CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="text-xs text-muted-foreground">Guardian's Name</div>
                                        <div className="font-medium">{student.guardian_name || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Date of Birth</div>
                                        <div className="font-medium">{student.dob || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Gender</div>
                                        <div className="font-medium capitalize">{student.gender || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Guardian Phone</div>
                                        <div className="font-medium">{student.guardian_phone || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Address</div>
                                        <div className="font-medium">{student.address || 'N/A'}</div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Enrollments */}
                            <Card className="md:col-span-2">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <h3 className="font-semibold leading-none tracking-tight">Course Enrollments</h3>
                                    <Button variant="outline" size="sm" onClick={() => setIsEnrollOpen(true)}>
                                        <BookOpen className="h-4 w-4 mr-2" /> Enroll
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Course Name</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {enrollments.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                                                        Not enrolled in any courses.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                enrollments.map((enr) => (
                                                    <TableRow key={enr.id}>
                                                        <TableCell className="font-semibold">{enr.course?.name}</TableCell>
                                                        <TableCell>
                                                            <span
                                                                className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                                                                style={{ backgroundColor: enr.status === 'active' ? '#16a34a' : (enr.status === 'withdrawn' ? '#4b5563' : '#ea580c'), color: '#ffffff' }}
                                                            >
                                                                {enr.status.toUpperCase()}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {enr.status === 'active' && (
                                                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => withdraw(enr.id)}>
                                                                    <LogOut className="h-4 w-4 mr-1" /> Withdraw
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'grades' && (
                        <Card>
                            <CardHeader>Academic Exam Results</CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Subject / Course</TableHead>
                                            <TableHead>Assessment</TableHead>
                                            <TableHead>Score</TableHead>
                                            <TableHead>Feedback / Remarks</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {grades.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                    No grades recorded for this student yet.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            grades.map((grade) => (
                                                <TableRow key={grade.id}>
                                                    <TableCell className="font-semibold">{grade.exam?.course?.name}</TableCell>
                                                    <TableCell>{grade.exam?.name}</TableCell>
                                                    <TableCell className="font-bold text-green-600 dark:text-green-400">
                                                        {grade.marks_obtained} / {grade.exam?.max_marks}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">{grade.remarks || '-'}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'billing' && (
                        <div className="space-y-6">
                            {/* Invoices */}
                            <Card>
                                <CardHeader>Billing Ledgers</CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Billing Description</TableHead>
                                                <TableHead>Total Amount</TableHead>
                                                <TableHead>Amount Paid</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Due Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {invoices.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                                        No invoices issued for this student.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                invoices.map((inv) => (
                                                    <TableRow key={inv.id}>
                                                        <TableCell className="font-semibold">{inv.fee_structure?.term}</TableCell>
                                                        <TableCell className="font-bold">${parseFloat(inv.amount_due as string).toFixed(2)}</TableCell>
                                                        <TableCell className="font-bold text-green-600 dark:text-green-400">
                                                            ${parseFloat(inv.amount_paid as string).toFixed(2)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span
                                                                className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                                                                style={getStatusStyle(inv.status)}
                                                            >
                                                                {inv.status.toUpperCase()}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>{inv.due_date}</TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            {/* Payments History */}
                            <Card>
                                <CardHeader>Transaction Payment History</CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Invoice Target</TableHead>
                                                <TableHead>Amount Paid</TableHead>
                                                <TableHead>Date Paid</TableHead>
                                                <TableHead>Method</TableHead>
                                                <TableHead>Reference No</TableHead>
                                                <TableHead className="w-[120px] text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {payments.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                                        No payments registered for this student.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                payments.map((p) => (
                                                    <TableRow key={p.id}>
                                                        <TableCell className="font-semibold">{p.invoice?.fee_structure?.term}</TableCell>
                                                        <TableCell className="font-bold text-green-600 dark:text-green-400">
                                                            ${parseFloat(p.amount as string).toFixed(2)}
                                                        </TableCell>
                                                        <TableCell>{p.paid_at.substring(0, 10)}</TableCell>
                                                        <TableCell>{p.method}</TableCell>
                                                        <TableCell>{p.reference_no || '-'}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDownloadReceipt(p.id)}
                                                            >
                                                                Download Receipt
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            {/* Enroll Modal */}
            <Dialog open={isEnrollOpen} onOpenChange={setIsEnrollOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleEnrollSubmit}>
                        <DialogHeader>
                            <DialogTitle>Enroll in Course</DialogTitle>
                            <DialogDescription>
                                Select a course to enroll <strong>{student.name}</strong> into.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Select value={enrollData.course_id} onValueChange={(val) => setEnrollData('course_id', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courses?.length > 0 ? courses.map((course: any) => (
                                            <SelectItem key={course.id} value={course.id.toString()}>
                                                {course.name} ({course.code})
                                            </SelectItem>
                                        )) : (
                                            <SelectItem value="none" disabled>No active courses available.</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                {enrollErrors.course_id && <div className="text-red-500 text-sm mt-1">{enrollErrors.course_id}</div>}
                            </div>
                        </div>
                        
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEnrollOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={enrollProcessing || !enrollData.course_id}>
                                Enroll Student
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
