import { Head, useForm } from '@inertiajs/react';
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

interface TeacherData {
    id: number;
    name: string;
}

interface CourseData {
    id: number;
    course_name: string;
    teacher_id: number | null;
    teacher?: TeacherData | null;
}

interface CourseProps {
    courses: {
        data: CourseData[];
        links: any[];
    };
    teachers: TeacherData[];
}

export default function Course({ courses, teachers = [] }: CourseProps) {
    const coursesList = courses?.data || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        course_name: '',
        teacher_id: '',
    });

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedCourse(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (course: CourseData) => {
        setModalMode('edit');
        setSelectedCourse(course);
        setData({
            course_name: course.course_name || '',
            teacher_id: course.teacher_id ? course.teacher_id.toString() : '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openDeleteModal = (course: CourseData) => {
        setSelectedCourse(course);
        setIsDeleteOpen(true);
    };

    const handleModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'create') {
            post('/course/store', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            put(`/course/${selectedCourse?.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedCourse?.id) {
            destroy(`/course/${selectedCourse.id}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setSelectedCourse(null);
                },
            });
        }
    };

    return (
        <>
            <Head title="Course" />
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
                                    <BreadcrumbPage>Course</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div>
                        <Button onClick={openCreateModal}>
                            Add Course
                        </Button>
                    </div>
                </div>

                <div className="course-table">
                    <Card>
                        <CardHeader>Course</CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Course Name</TableHead>
                                        <TableHead>Teacher</TableHead>
                                        <TableHead className="flex justify-end">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {coursesList && coursesList.length > 0 ? (
                                        coursesList.map((course: CourseData, index: number) => (
                                            <TableRow key={course.id}>
                                                <TableCell>
                                                    {(index + 1).toString().padStart(2, '0')}
                                                </TableCell>
                                                <TableCell>
                                                    <span className='capitalize'>  {course.course_name}</span>
                                                </TableCell>
                                                <TableCell>
                                                    {course.teacher ? course.teacher.name : <span className="text-muted-foreground italic">No Teacher</span>}
                                                </TableCell>
                                                <TableCell className="flex justify-end gap-4">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="outline">
                                                                <Ellipsis />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent className="w-40" align="end">
                                                            <DropdownMenuGroup>
                                                                <DropdownMenuItem onClick={() => openEditModal(course)}>
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => openDeleteModal(course)}>
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuGroup>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="text-center text-muted-foreground py-8"
                                            >
                                                No courses found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <Pagination links={courses.links} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleModalSubmit}>
                        <DialogHeader>
                            <DialogTitle>{modalMode === 'create' ? 'Add Course' : 'Edit Course'}</DialogTitle>
                            <DialogDescription>
                                {modalMode === 'create' ? 'Create a new course and optionally assign a teacher.' : 'Update the course details.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="course_name">Course Name</Label>
                                <Input
                                    id="course_name"
                                    value={data.course_name}
                                    onChange={(e) => setData('course_name', e.target.value)}
                                    placeholder="Enter course name"
                                />
                                {errors.course_name && <span className="text-sm text-red-500">{errors.course_name}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="teacher_id">Teacher</Label>
                                <Select
                                    value={data.teacher_id || 'none'}
                                    onValueChange={(val) => setData('teacher_id', val === 'none' ? '' : val)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Teacher" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full">
                                        <SelectItem value="none">No Teacher</SelectItem>
                                        {teachers.map((teacher) => (
                                            <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                                {teacher.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.teacher_id && <span className="text-sm text-red-500">{errors.teacher_id}</span>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>
                                {modalMode === 'create' ? 'Save' : 'Update'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedCourse?.course_name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button type="button" variant="destructive" disabled={processing} onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Course.layout = {
    breadcrumbs: [
        {
            title: 'Course',
            href: '/courses',
        },
    ],
};
