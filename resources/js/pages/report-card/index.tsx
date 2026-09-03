import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { Pagination } from '@/components/pagination';

interface StudentData {
    id: number;
    name: string;
    roll_number: string;
    class: string;
    guardian_phone: string;
    gpa: string;
    grade: string;
}

interface ReportProps {
    students: {
        data: StudentData[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function ReportCardList({ students }: ReportProps) {
    const studentsList = students?.data || [];

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

    const { delete: destroy, processing } = useForm();

    const handleDownloadReport = (studentId: number) => {
        window.open(`/students/${studentId}/report-card`, '_blank');
    };

    const openDeleteModal = (student: StudentData) => {
        setSelectedStudent(student);
        setIsDeleteOpen(true);
    };

    const handleDeleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedStudent) {
            destroy(`/students/${selectedStudent.id}/report-card`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setSelectedStudent(null);
                },
            });
        }
    };

    return (
        <>
            <Head title="Report Cards Generator" />
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
                                    <BreadcrumbPage>Report Cards</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>

                <div className="Student-table">
                    <Card>
                        <CardHeader>Report Cards - Active Students</CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">No.</TableHead>
                                        <TableHead>Roll Number</TableHead>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead>Class</TableHead>
                                        <TableHead>Guardian Phone</TableHead>
                                        <TableHead>Cumulative GPA</TableHead>
                                        <TableHead>Overall Grade</TableHead>
                                        <TableHead className="w-[180px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {studentsList.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                                No students found under your active school scope.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        studentsList.map((student: StudentData, index: number) => (
                                            <TableRow key={student.id}>
                                                <TableCell className="font-medium">
                                                    {(students.current_page - 1) * students.per_page + index + 1}
                                                </TableCell>
                                                <TableCell className="font-semibold">{student.roll_number}</TableCell>
                                                <TableCell className="font-semibold">{student.name}</TableCell>
                                                <TableCell>{student.class}</TableCell>
                                                <TableCell>{student.guardian_phone}</TableCell>
                                                <TableCell className="font-medium text-green-600 dark:text-green-400">
                                                    {student.gpa}
                                                </TableCell>
                                                <TableCell className="font-bold text-green-600 dark:text-green-400">
                                                    {student.grade}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDownloadReport(student.id)}
                                                        >
                                                            Download PDF
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => openDeleteModal(student)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            {studentsList.length > 0 && (
                                <div className="mt-4">
                                    <Pagination links={students.links} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                {/* Delete Confirmation Modal */}
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogContent className="max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle>Delete Report Card</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete the report card for <strong>{selectedStudent?.name}</strong>? This will clear all their exam grades. This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleDeleteSubmit}>
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="destructive" disabled={processing}>
                                    Delete Grades
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
