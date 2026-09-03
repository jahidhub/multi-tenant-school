import { Head, Link, useForm, router } from '@inertiajs/react';
import { Ellipsis, Search } from 'lucide-react';
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

interface TeacherData {
    id: number;
    name: string;
    email: string | null;
    phone: string;
    subject_specialty: string;
    address: string;
    joining_date: string | null;
    status: string;
    profile_photo_path: string | null;
    deleted_at: string | null;
    courses: CourseData[];
}

export default function Teacher({ teachers = { data: [], links: [] }, courses = [], filters = {} }: { teachers: any; courses: any[]; filters: any }) {
    const teachersList = teachers?.data || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isForceDeleteOpen, setIsForceDeleteOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedTeacher, setSelectedTeacher] = useState<TeacherData | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [search, setSearch] = useState(filters.search || '');
    const [subjectFilter, setSubjectFilter] = useState(filters.subject_specialty || '');

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        phone: '',
        subject_specialty: '',
        address: '',
        joining_date: '',
        status: 'active',
        courses: [] as number[],
        profile_photo: null as File | null,
        _method: 'post', // Used for overriding method for file uploads in updates
    });

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedTeacher(null);
        reset();
        setData('_method', 'post');
        clearErrors();
        setPreviewUrl(null);
        setIsModalOpen(true);
    };

    const openEditModal = (teacher: TeacherData) => {
        setModalMode('edit');
        setSelectedTeacher(teacher);
        setData({
            name: teacher.name || '',
            email: teacher.email || '',
            phone: teacher.phone || '',
            subject_specialty: teacher.subject_specialty || '',
            address: teacher.address || '',
            joining_date: teacher.joining_date || '',
            status: teacher.status || 'active',
            courses: teacher.courses?.map(c => c.id) || [],
            profile_photo: null,
            _method: 'put',
        });
        setPreviewUrl(teacher.profile_photo_path ? `/storage/${teacher.profile_photo_path}` : null);
        clearErrors();
        setIsModalOpen(true);
    };

    const openDeleteModal = (teacher: TeacherData) => {
        setSelectedTeacher(teacher);
        setIsDeleteOpen(true);
    };

    const openForceDeleteModal = (teacher: TeacherData) => {
        setSelectedTeacher(teacher);
        setIsForceDeleteOpen(true);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('profile_photo', file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setData('profile_photo', null);
            setPreviewUrl(modalMode === 'edit' && selectedTeacher?.profile_photo_path ? `/storage/${selectedTeacher.profile_photo_path}` : null);
        }
    };

    const openViewModal = (teacher: TeacherData) => {
        setSelectedTeacher(teacher);
        setIsViewOpen(true);
    };

    const handleModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // For file uploads in Inertia, we always use POST, and override with _method='put' if editing
        if (modalMode === 'create') {
            post('/teacher/store', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(`/teacher/${selectedTeacher?.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedTeacher?.id) {
            router.delete(`/teacher/${selectedTeacher.id}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setSelectedTeacher(null);
                },
            });
        }
    };

    const handleForceDelete = () => {
        if (selectedTeacher?.id) {
            router.delete(`/teacher/${selectedTeacher.id}/force`, {
                onSuccess: () => {
                    setIsForceDeleteOpen(false);
                    setSelectedTeacher(null);
                },
            });
        }
    };

    const applyFilters = () => {
        router.get('/teachers', { search, subject_specialty: subjectFilter }, { preserveState: true });
    };

    const handleCourseToggle = (courseId: number) => {
        const newCourses = data.courses.includes(courseId)
            ? data.courses.filter(id => id !== courseId)
            : [...data.courses, courseId];
        setData('courses', newCourses);
    };

    return (
        <>
            <Head title="Teachers" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="breadcrumb flex items-center justify-between">
                    <div>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Teachers</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div>
                        <Button onClick={openCreateModal}>Add Teacher</Button>
                    </div>
                </div>

                <div className="filters flex gap-4 items-center bg-white p-4 rounded shadow-sm">
                    <div className="flex-1 relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search teachers by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <div className="w-1/3">
                        <Input
                            placeholder="Filter by subject specialty..."
                            value={subjectFilter}
                            onChange={(e) => setSubjectFilter(e.target.value)}
                        />
                    </div>
                    <Button variant="secondary" onClick={applyFilters}>Filter</Button>
                    <Button variant="outline" onClick={() => { setSearch(''); setSubjectFilter(''); router.get('/teachers'); }}>Reset</Button>
                </div>

                <div className="teacher-table">
                    <Card>
                        <CardHeader>Teachers List</CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Photo</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Courses</TableHead>
                                        <TableHead className="flex justify-end">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {teachersList.length > 0 ? (
                                        teachersList.map((teacher: TeacherData) => (
                                            <TableRow key={teacher.id}>
                                                <TableCell>
                                                    {teacher.profile_photo_path ? (
                                                        <img src={`/storage/${teacher.profile_photo_path}`} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                                            {teacher.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {teacher.name}
                                                    {teacher.deleted_at && (
                                                        <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500 uppercase">
                                                            Archived
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>{teacher.subject_specialty}</TableCell>
                                                <TableCell>{teacher.email || 'N/A'}</TableCell>
                                                <TableCell>{teacher.phone}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${teacher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {teacher.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {teacher.courses?.map(c => c.name).join(', ') || 'None'}
                                                </TableCell>
                                                <TableCell className="flex justify-end gap-4">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="outline"><Ellipsis /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent className="w-40" align="end">
                                                            <DropdownMenuGroup>
                                                                <DropdownMenuItem onClick={() => openViewModal(teacher)}>View</DropdownMenuItem>
                                                                {teacher.deleted_at ? (
                                                                    <>
                                                                        <DropdownMenuItem onClick={() => router.post(`/teacher/${teacher.id}/restore`)}>
                                                                            Restore
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem className="text-destructive" onClick={() => openForceDeleteModal(teacher)}>
                                                                            Permanent Delete
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <DropdownMenuItem onClick={() => openEditModal(teacher)}>Edit</DropdownMenuItem>
                                                                        <DropdownMenuItem className="text-destructive" onClick={() => openDeleteModal(teacher)}>Delete</DropdownMenuItem>
                                                                    </>
                                                                )}
                                                            </DropdownMenuGroup>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                                No teachers found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <Pagination links={teachers.links} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[700px] overflow-y-auto max-h-[90vh]">
                    <form onSubmit={handleModalSubmit} encType="multipart/form-data">
                        <DialogHeader>
                            <DialogTitle>{modalMode === 'create' ? 'Add Teacher' : 'Edit Teacher'}</DialogTitle>
                            <DialogDescription>
                                {modalMode === 'create' ? 'Add a new teaching staff member.' : 'Update the teacher details.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone *</Label>
                                <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} required />
                                {errors.phone && <span className="text-sm text-red-500">{errors.phone}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="subject_specialty">Subject Specialty *</Label>
                                <Input id="subject_specialty" value={data.subject_specialty} onChange={(e) => setData('subject_specialty', e.target.value)} required />
                                {errors.subject_specialty && <span className="text-sm text-red-500">{errors.subject_specialty}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="joining_date">Joining Date</Label>
                                <Input id="joining_date" type="date" value={data.joining_date} onChange={(e) => setData('joining_date', e.target.value)} />
                                {errors.joining_date && <span className="text-sm text-red-500">{errors.joining_date}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <span className="text-sm text-red-500">{errors.status}</span>}
                            </div>

                            <div className="grid gap-2 col-span-2">
                                <Label htmlFor="address">Address *</Label>
                                <Input id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} required />
                                {errors.address && <span className="text-sm text-red-500">{errors.address}</span>}
                            </div>

                            <div className="grid gap-2 col-span-2">
                                <Label htmlFor="profile_photo">Profile Photo</Label>
                                <div className="flex items-center gap-4">
                                    {previewUrl && (
                                        <img src={previewUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover shadow-sm" />
                                    )}
                                    <Input id="profile_photo" type="file" accept="image/*" onChange={handlePhotoChange} />
                                </div>
                                {errors.profile_photo && <span className="text-sm text-red-500">{errors.profile_photo}</span>}
                            </div>

                            <div className="grid gap-2 col-span-2">
                                <Label>Assign Courses</Label>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    {courses.map(course => (
                                        <label key={course.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={data.courses.includes(course.id)}
                                                onChange={() => handleCourseToggle(course.id)}
                                                className="rounded border-gray-300"
                                            />
                                            <span>{course.name}</span>
                                        </label>
                                    ))}
                                    {courses.length === 0 && <span className="text-sm text-gray-500">No courses available.</span>}
                                </div>
                                {errors.courses && <span className="text-sm text-red-500">{errors.courses}</span>}
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
                            Are you sure you want to deactivate and remove {selectedTeacher?.name}? This is a soft-delete to preserve historical records.
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

            {/* Force Delete Confirmation Modal */}
            <Dialog open={isForceDeleteOpen} onOpenChange={setIsForceDeleteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Permanent Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to permanently delete {selectedTeacher?.name}? This action cannot be undone and will completely remove the teacher and all associated data from the database.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsForceDeleteOpen(false)}>Cancel</Button>
                        <Button type="button" variant="destructive" disabled={processing} onClick={handleForceDelete}>
                            Delete Permanently
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Modal */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Teacher Details</DialogTitle>
                        <DialogDescription>
                            Complete information for {selectedTeacher?.name}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedTeacher && (
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="col-span-2 flex justify-center mb-4">
                                {selectedTeacher.profile_photo_path ? (
                                    <img src={`/storage/${selectedTeacher.profile_photo_path}`} alt="Profile" className="w-32 h-32 rounded-full object-cover shadow-md" />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-4xl shadow-md">
                                        {selectedTeacher.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg">
                                <h4 className="text-sm font-medium text-muted-foreground">Full Name</h4>
                                <p className="font-semibold">{selectedTeacher.name}</p>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg">
                                <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                                <p className="font-semibold">{selectedTeacher.email || 'N/A'}</p>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg">
                                <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                                <p className="font-semibold">{selectedTeacher.phone}</p>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg">
                                <h4 className="text-sm font-medium text-muted-foreground">Subject Specialty</h4>
                                <p className="font-semibold">{selectedTeacher.subject_specialty}</p>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg">
                                <h4 className="text-sm font-medium text-muted-foreground">Joining Date</h4>
                                <p className="font-semibold">{selectedTeacher.joining_date || 'N/A'}</p>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedTeacher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {selectedTeacher.status}
                                    </span>
                                </div>
                            </div>
                            <div className="col-span-2 bg-muted/50 p-3 rounded-lg">
                                <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                                <p className="font-semibold">{selectedTeacher.address}</p>
                            </div>
                            <div className="col-span-2 bg-muted/50 p-3 rounded-lg">
                                <h4 className="text-sm font-medium text-muted-foreground">Assigned Courses</h4>
                                <p className="font-semibold">{selectedTeacher.courses?.map(c => c.name).join(', ') || 'None'}</p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="button" onClick={() => setIsViewOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </>
    );
}

Teacher.layout = {
    breadcrumbs: [
        {
            title: 'Teachers',
            href: '/teachers',
        },
    ],
};
