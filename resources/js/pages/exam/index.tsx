import { Head, useForm, router } from '@inertiajs/react';
import { Ellipsis } from 'lucide-react';
import { useState } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Pagination } from '@/components/pagination';

interface CourseData {
    id: number;
    name: string;
}

interface ExamData {
    id: number;
    course_id: number;
    name: string;
    exam_date: string;
    max_marks: number;
    course?: CourseData | null;
    marks_obtained?: string;
}

interface ExamProps {
    exams: {
        data: ExamData[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    courses: CourseData[];
}

export default function Exam({ exams, courses = [] }: ExamProps) {
    const examsList = exams?.data || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        course_id: '',
        exam_date: '',
        max_marks: 100,
    });

    const openCreateModal = () => {
        setModalMode('create');
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (exam: ExamData) => {
        setModalMode('edit');
        setSelectedExam(exam);
        setData({
            name: exam.name || '',
            course_id: exam.course_id ? exam.course_id.toString() : '',
            exam_date: exam.exam_date || '',
            max_marks: exam.max_marks || 100,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openDeleteModal = (exam: ExamData) => {
        setSelectedExam(exam);
        setIsDeleteOpen(true);
    };

    const handleModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'create') {
            post('/exam/store', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            put(`/exam/${selectedExam?.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDeleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedExam) {
            destroy(`/exam/${selectedExam.id}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setSelectedExam(null);
                },
            });
        }
    };

    const handleEnterMarks = (examId: number) => {
        router.get(`/exams/${examId}/marks`);
    };

    return (
        <>
            <Head title="Exams Management" />
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
                                    <BreadcrumbPage>Exams</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div>
                        <Button onClick={openCreateModal}>
                            Create Exam
                        </Button>
                    </div>
                </div>

                <div className="Exam-table">
                    <Card>
                        <CardHeader>Exams</CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">No.</TableHead>
                                        <TableHead>Exam Name</TableHead>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Max Marks</TableHead>
                                        <TableHead>Exam Date</TableHead>
                                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {examsList.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                                No exams found. Add your first exam!
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        examsList.map((exam: ExamData, index: number) => (
                                            <TableRow key={exam.id}>
                                                <TableCell className="font-medium">
                                                    {(exams.current_page - 1) * exams.per_page + index + 1}
                                                </TableCell>
                                                <TableCell className="font-medium">{exam.name}</TableCell>
                                                <TableCell>
                                                    {exam.course ? exam.course.name : <span className="text-muted-foreground italic">No Course</span>}
                                                </TableCell>
                                                <TableCell>{exam.max_marks}</TableCell>
                                                <TableCell>{exam.exam_date}</TableCell>
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
                                                                <DropdownMenuItem onClick={() => handleEnterMarks(exam.id)}>
                                                                    Enter Marks
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openEditModal(exam)}>
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openDeleteModal(exam)} className="text-destructive focus:text-destructive">
                                                                    Delete
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

                            {examsList.length > 0 && (
                                <div className="mt-4">
                                    <Pagination links={exams.links} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Create / Edit Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{modalMode === 'create' ? 'Create Exam' : 'Edit Exam'}</DialogTitle>
                            <DialogDescription>
                                Fill in details to define the course assessment.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleModalSubmit} className="space-y-4 py-2">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Exam Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Midterm Exam, Quiz 1"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="course_id">Course</Label>
                                <Select
                                    value={data.course_id}
                                    onValueChange={(val) => setData('course_id', val)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courses.map((course) => (
                                            <SelectItem key={course.id} value={course.id.toString()}>
                                                {course.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.course_id && <p className="text-xs text-destructive">{errors.course_id}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="exam_date">Exam Date</Label>
                                <Input
                                    id="exam_date"
                                    type="date"
                                    value={data.exam_date}
                                    onChange={(e) => setData('exam_date', e.target.value)}
                                    required
                                />
                                {errors.exam_date && <p className="text-xs text-destructive">{errors.exam_date}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="max_marks">Maximum Marks</Label>
                                <Input
                                    id="max_marks"
                                    type="number"
                                    min="1"
                                    value={data.max_marks}
                                    onChange={(e) => setData('max_marks', parseInt(e.target.value) || 0)}
                                    required
                                />
                                {errors.max_marks && <p className="text-xs text-destructive">{errors.max_marks}</p>}
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {modalMode === 'create' ? 'Create' : 'Save Changes'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogContent className="max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle>Delete Exam</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete the exam "{selectedExam?.name}"? All student grades for this exam will be permanently removed. This action cannot be undone.
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
