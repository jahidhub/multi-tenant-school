import { Head, useForm } from '@inertiajs/react';
import { Ellipsis } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
}

interface ExamData {
    id: number;
    name: string;
    max_marks: number;
    course?: {
        name: string;
    } | null;
}

interface GradeData {
    id: number;
    student_id: number;
    exam_id: number;
    marks_obtained: number | '';
    remarks: string;
    student?: StudentData | null;
    exam?: ExamData | null;
}

interface GradeProps {
    grades: {
        data: GradeData[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function GradeList({ grades }: GradeProps) {
    const gradesList = grades?.data || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState<GradeData | null>(null);

    const { data, setData, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        marks_obtained: '' as number | '',
        remarks: '',
    });

    const openEditModal = (grade: GradeData) => {
        setSelectedGrade(grade);
        setData({
            marks_obtained: grade.marks_obtained,
            remarks: grade.remarks || '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openDeleteModal = (grade: GradeData) => {
        setSelectedGrade(grade);
        setIsDeleteOpen(true);
    };

    const handleModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedGrade) {
            put(`/grade/${selectedGrade.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDeleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedGrade) {
            destroy(`/grade/${selectedGrade.id}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setSelectedGrade(null);
                },
            });
        }
    };

    return (
        <>
            <Head title="Student Grades" />
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
                                    <BreadcrumbPage>Student Grades</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>

                <div className="Grade-table">
                    <Card>
                        <CardHeader>Student Grade Book</CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">No.</TableHead>
                                        <TableHead>Roll Number</TableHead>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Exam Name</TableHead>
                                        <TableHead>Marks Obtained</TableHead>
                                        <TableHead>Max Marks</TableHead>
                                        <TableHead>Remarks</TableHead>
                                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {gradesList.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                                                No grade records found. Add marks in exams first!
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        gradesList.map((grade: GradeData, index: number) => (
                                            <TableRow key={grade.id}>
                                                <TableCell className="font-medium">
                                                    {(grades.current_page - 1) * grades.per_page + index + 1}
                                                </TableCell>
                                                <TableCell className="font-semibold">
                                                    {grade.student?.roll_number || '-'}
                                                </TableCell>
                                                <TableCell className="font-semibold">
                                                    {grade.student?.name || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {grade.exam?.course?.name || '-'}
                                                </TableCell>
                                                <TableCell>{grade.exam?.name || '-'}</TableCell>
                                                <TableCell className="font-semibold text-green-600 dark:text-green-400">
                                                    {grade.marks_obtained !== null && grade.marks_obtained !== '' ? grade.marks_obtained : '-'}
                                                </TableCell>
                                                <TableCell>{grade.exam?.max_marks || '-'}</TableCell>
                                                <TableCell className="text-xs text-muted-foreground">{grade.remarks || '-'}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <Ellipsis className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-[160px]">
                                                            <DropdownMenuGroup>
                                                                <DropdownMenuItem onClick={() => openEditModal(grade)}>
                                                                    Edit Marks
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openDeleteModal(grade)} className="text-destructive focus:text-destructive">
                                                                    Delete Marks
                                                                </DropdownMenuItem>
                                                            </DropdownMenuGroup>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            {gradesList.length > 0 && (
                                <div className="mt-4">
                                    <Pagination links={grades.links} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Edit Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Grade Record</DialogTitle>
                            <DialogDescription>
                                Modify score and remarks for student: <strong>{selectedGrade?.student?.name}</strong>
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleModalSubmit} className="space-y-4 py-2">
                            <div className="grid gap-2">
                                <Label htmlFor="marks_obtained">Marks Obtained (Max: {selectedGrade?.exam?.max_marks})</Label>
                                <Input
                                    id="marks_obtained"
                                    type="number"
                                    min="0"
                                    max={selectedGrade?.exam?.max_marks}
                                    value={data.marks_obtained}
                                    onChange={(e) => setData('marks_obtained', e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                                />
                                {errors.marks_obtained && <p className="text-xs text-destructive">{errors.marks_obtained}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="remarks">Remarks / Feedback</Label>
                                <Input
                                    id="remarks"
                                    type="text"
                                    placeholder="Remarks"
                                    value={data.remarks}
                                    onChange={(e) => setData('remarks', e.target.value)}
                                />
                                {errors.remarks && <p className="text-xs text-destructive">{errors.remarks}</p>}
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogContent className="max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle>Delete Grade Record</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this grade record? The score will be cleared from the report book. This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleDeleteSubmit}>
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="destructive" disabled={processing}>
                                    Delete
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
