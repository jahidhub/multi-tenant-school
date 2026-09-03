import { Head, Link, useForm, router } from '@inertiajs/react';
import { Ellipsis, Search, Plus, Trash2, Copy, ArchiveRestore, Users } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

interface TeacherData {
    id: number;
    name: string;
}

interface CourseData {
    id: number;
    name: string;
    code: string;
    credit_hours: number;
    academic_year: string;
    capacity: number;
    status: string;
    deleted_at: string | null;
    teacher_id: number | null;
    teacher?: TeacherData;
    enrollments_count: number;
}

export default function CourseIndex({ courses, teachers, academicYears, students, filters }: any) {
    const { data: coursesList, links } = courses;

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isRestoreOpen, setIsRestoreOpen] = useState(false);
    const [isForceDeleteOpen, setIsForceDeleteOpen] = useState(false);
    const [isDuplicateOpen, setIsDuplicateOpen] = useState(false);
    const [isEnrollOpen, setIsEnrollOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);

    const [search, setSearch] = useState(filters.search || '');
    const [academicYearFilter, setAcademicYearFilter] = useState(filters.academic_year || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        code: '',
        credit_hours: 3,
        academic_year: '',
        capacity: 30,
        status: 'active',
        teacher_id: '' as string | number,
    });

    const { data: dupData, setData: setDupData, post: postDup, processing: dupProcessing, reset: resetDup, errors: dupErrors } = useForm({
        academic_year: '',
    });

    const { data: enrollData, setData: setEnrollData, post: postEnroll, processing: enrollProcessing, reset: resetEnroll, errors: enrollErrors } = useForm({
        course_id: '',
        student_ids: [] as number[],
    });

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedCourse(null);
        reset();
        setIsCreateOpen(true);
    };

    const openEditModal = (course: CourseData) => {
        setModalMode('edit');
        setSelectedCourse(course);
        setData({
            name: course.name,
            code: course.code,
            credit_hours: course.credit_hours,
            academic_year: course.academic_year,
            capacity: course.capacity,
            status: course.status,
            teacher_id: course.teacher_id || '',
        });
        setIsCreateOpen(true);
    };

    const applyFilters = () => {
        router.get('/courses', { search, academic_year: academicYearFilter, status: statusFilter }, { preserveState: true });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Data prep for submission (teacher_id can be empty)
        const submitData = { ...data };
        if (submitData.teacher_id === 'none' || submitData.teacher_id === '') {
            submitData.teacher_id = '';
        }

        if (modalMode === 'create') {
            post('/courses', {
                onSuccess: () => {
                    setIsCreateOpen(false);
                    reset();
                }
            });
        } else {
            put(`/course/${selectedCourse?.id}`, {
                onSuccess: () => {
                    setIsCreateOpen(false);
                    reset();
                }
            });
        }
    };

    const handleDuplicateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postDup(`/course/${selectedCourse?.id}/duplicate`, {
            onSuccess: () => {
                setIsDuplicateOpen(false);
                resetDup();
            }
        });
    };

    const handleDelete = () => {
        router.delete(`/course/${selectedCourse?.id}`, {
            onSuccess: () => setIsDeleteOpen(false)
        });
    };

    const handleRestore = () => {
        router.post(`/course/${selectedCourse?.id}/restore`, {}, {
            onSuccess: () => setIsRestoreOpen(false)
        });
    };

    const handleForceDelete = () => {
        router.delete(`/course/${selectedCourse?.id}/force`, {
            onSuccess: () => setIsForceDeleteOpen(false)
        });
    };

    const confirmAction = (course: CourseData, action: 'delete' | 'restore' | 'force_delete' | 'duplicate' | 'enroll') => {
        setSelectedCourse(course);
        if (action === 'delete') setIsDeleteOpen(true);
        if (action === 'restore') setIsRestoreOpen(true);
        if (action === 'force_delete') setIsForceDeleteOpen(true);
        if (action === 'duplicate') {
            resetDup();
            setIsDuplicateOpen(true);
        }
        if (action === 'enroll') {
            setEnrollData('course_id', course.id.toString());
            setEnrollData('student_ids', []);
            setIsEnrollOpen(true);
        }
    };

    const handleEnrollSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postEnroll('/enrollment/store', {
            onSuccess: () => {
                setIsEnrollOpen(false);
                resetEnroll();
            }
        });
    };

    return (
        <>
            <Head title="Courses" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
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
                                    <BreadcrumbPage>Courses</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Button onClick={openCreateModal}>
                            <Plus className="mr-2 h-4 w-4" /> Add Course
                        </Button>
                    </div>
                </div>

                <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex gap-4 items-center flex-wrap w-full lg:w-auto">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by code or name..."
                                    className="pl-8 w-[250px]"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                />
                            </div>
                            
                            <Select value={academicYearFilter} onValueChange={(val) => setAcademicYearFilter(val === 'all' ? '' : val)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Academic Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Terms</SelectItem>
                                    {academicYears.map((year: string) => (
                                        <SelectItem key={year} value={year}>{year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val === 'all' ? '' : val)}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button variant="outline" onClick={applyFilters}>Filter</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Course Name</TableHead>
                                        <TableHead>Academic Year</TableHead>
                                        <TableHead>Primary Teacher</TableHead>
                                        <TableHead className="text-center">Credits</TableHead>
                                        <TableHead className="text-center">Enrolled / Cap</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="flex justify-end">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {coursesList.length > 0 ? (
                                        coursesList.map((course: CourseData) => {
                                            const isFull = course.enrollments_count >= course.capacity;
                                            return (
                                                <TableRow key={course.id} className={course.deleted_at ? 'opacity-60 bg-muted/50' : ''}>
                                                    <TableCell className="font-medium">{course.code}</TableCell>
                                                    <TableCell className="font-semibold">{course.name}</TableCell>
                                                    <TableCell>{course.academic_year}</TableCell>
                                                    <TableCell>{course.teacher?.name || <span className="text-muted-foreground italic">Unassigned</span>}</TableCell>
                                                    <TableCell className="text-center">{course.credit_hours}</TableCell>
                                                    <TableCell className="text-center">
                                                        <span className={`font-semibold ${isFull ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                                                            {course.enrollments_count}
                                                        </span>
                                                        <span className="text-muted-foreground"> / {course.capacity}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {course.deleted_at ? (
                                                            <Badge variant="destructive">Archived</Badge>
                                                        ) : (
                                                            <Badge variant="outline" className={course.status === 'active' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-800 border-orange-200'}>
                                                                {course.status.toUpperCase()}
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Open menu</span>
                                                                    <Ellipsis className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuGroup>
                                                                    <DropdownMenuItem onClick={() => openEditModal(course)}>
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                    
                                                                    {!course.deleted_at && (
                                                                        <>
                                                                            {!isFull && (
                                                                                <DropdownMenuItem onClick={() => confirmAction(course, 'enroll')}>
                                                                                    <Users className="mr-2 h-4 w-4" /> Enroll Students
                                                                                </DropdownMenuItem>
                                                                            )}
                                                                            <DropdownMenuItem onClick={() => confirmAction(course, 'duplicate')}>
                                                                                <Copy className="mr-2 h-4 w-4" /> Duplicate to New Term
                                                                            </DropdownMenuItem>
                                                                        </>
                                                                    )}

                                                                    {course.deleted_at ? (
                                                                        <>
                                                                            <DropdownMenuItem onClick={() => confirmAction(course, 'restore')}>
                                                                                <ArchiveRestore className="mr-2 h-4 w-4 text-green-600" /> Restore
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => confirmAction(course, 'force_delete')} className="text-red-600">
                                                                                <Trash2 className="mr-2 h-4 w-4" /> Permanent Delete
                                                                            </DropdownMenuItem>
                                                                        </>
                                                                    ) : (
                                                                        <DropdownMenuItem onClick={() => confirmAction(course, 'delete')} className="text-red-600">
                                                                            <Trash2 className="mr-2 h-4 w-4" /> Archive
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                </DropdownMenuGroup>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                                No courses found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <Pagination links={links} />
                    </CardContent>
                </Card>
            </div>

            {/* Create / Edit Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{modalMode === 'create' ? 'Create New Course' : 'Edit Course'}</DialogTitle>
                            <DialogDescription>
                                {modalMode === 'create' ? 'Add a new course to your curriculum.' : 'Update the course details.'}
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Course Name *</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required placeholder="e.g. Introduction to Physics" />
                                    {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="code">Course Code *</Label>
                                    <Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} required placeholder="e.g. PHY-101" />
                                    {errors.code && <span className="text-sm text-red-500">{errors.code}</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="academic_year">Academic Year / Term *</Label>
                                    <Input id="academic_year" value={data.academic_year} onChange={(e) => setData('academic_year', e.target.value)} required placeholder="e.g. 2026-2027 Fall" />
                                    {errors.academic_year && <span className="text-sm text-red-500">{errors.academic_year}</span>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="credit_hours">Credit Hours</Label>
                                    <Input id="credit_hours" type="number" min="0" value={data.credit_hours} onChange={(e) => setData('credit_hours', parseInt(e.target.value) || 0)} required />
                                    {errors.credit_hours && <span className="text-sm text-red-500">{errors.credit_hours}</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="capacity">Capacity (Max Students)</Label>
                                    <Input id="capacity" type="number" min="1" value={data.capacity} onChange={(e) => setData('capacity', parseInt(e.target.value) || 30)} required />
                                    {errors.capacity && <span className="text-sm text-red-500">{errors.capacity}</span>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <span className="text-sm text-red-500">{errors.status}</span>}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="teacher_id">Primary Teacher</Label>
                                <Select value={String(data.teacher_id)} onValueChange={(val) => setData('teacher_id', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select primary teacher" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">-- Unassigned --</SelectItem>
                                        {teachers.map((t: TeacherData) => (
                                            <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.teacher_id && <span className="text-sm text-red-500">{errors.teacher_id}</span>}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>{modalMode === 'create' ? 'Save Course' : 'Save Changes'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Duplicate Course Modal */}
            <Dialog open={isDuplicateOpen} onOpenChange={setIsDuplicateOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleDuplicateSubmit}>
                        <DialogHeader>
                            <DialogTitle>Duplicate Course to New Term</DialogTitle>
                            <DialogDescription>
                                This will clone <span className="font-bold">{selectedCourse?.code} - {selectedCourse?.name}</span> into a new academic year. Existing enrollments will NOT be copied over.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="new_academic_year">Target Academic Year / Term *</Label>
                                <Input id="new_academic_year" value={dupData.academic_year} onChange={(e) => setDupData('academic_year', e.target.value)} required placeholder="e.g. 2026-2027 Spring" />
                                {dupErrors.academic_year && <span className="text-sm text-red-500">{dupErrors.academic_year}</span>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDuplicateOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={dupProcessing}>Duplicate Course</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Enroll Students Modal */}
            <Dialog open={isEnrollOpen} onOpenChange={setIsEnrollOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleEnrollSubmit}>
                        <DialogHeader>
                            <DialogTitle>Enroll Students</DialogTitle>
                            <DialogDescription>
                                Select students to enroll in <strong>{selectedCourse?.name}</strong>.
                                <br />
                                Available Capacity: {selectedCourse ? selectedCourse.capacity - selectedCourse.enrollments_count : 0}
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4 max-h-[300px] overflow-y-auto">
                            {students?.length > 0 ? (
                                <div className="space-y-2">
                                    {students.map((student: any) => (
                                        <label key={student.id} className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md cursor-pointer border">
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-gray-300"
                                                checked={enrollData.student_ids.includes(student.id)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setEnrollData('student_ids', 
                                                        checked 
                                                            ? [...enrollData.student_ids, student.id]
                                                            : enrollData.student_ids.filter(id => id !== student.id)
                                                    );
                                                }}
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">{student.name} ({student.admission_no})</span>
                                                <span className="text-xs text-muted-foreground">{student.class}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No active students available.</p>
                            )}
                            
                            {enrollErrors.student_ids && <div className="text-red-500 text-sm">{enrollErrors.student_ids}</div>}
                            {enrollErrors.course_id && <div className="text-red-500 text-sm">{enrollErrors.course_id}</div>}
                        </div>
                        
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEnrollOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={enrollProcessing || enrollData.student_ids.length === 0}>
                                Enroll Selected ({enrollData.student_ids.length})
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Archive Confirmation Modal */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Archive Course</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to archive <strong>{selectedCourse?.name}</strong>? This hides the course from active views but keeps historical data intact.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button type="button" variant="destructive" onClick={handleDelete}>Archive</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Restore Confirmation Modal */}
            <Dialog open={isRestoreOpen} onOpenChange={setIsRestoreOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Restore Course</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to restore <strong>{selectedCourse?.name}</strong>? It will become active again.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsRestoreOpen(false)}>Cancel</Button>
                        <Button type="button" variant="default" onClick={handleRestore}>Restore</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Permanent Delete Confirmation Modal */}
            <Dialog open={isForceDeleteOpen} onOpenChange={setIsForceDeleteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Permanent Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to permanently delete <strong>{selectedCourse?.name}</strong>? This action cannot be undone and will cascade to all related enrollments and grades!
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsForceDeleteOpen(false)}>Cancel</Button>
                        <Button type="button" variant="destructive" onClick={handleForceDelete}>Delete Permanently</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
