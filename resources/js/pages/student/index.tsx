import { Head, Link, useForm, router } from '@inertiajs/react';
import { Ellipsis, Search, Upload, TrendingUp } from 'lucide-react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';

interface StudentData {
    id: number;
    name: string;
    admission_no: string;
    class: string;
    dob: string | null;
    gender: string | null;
    guardian_name: string | null;
    guardian_phone: string | null;
    address: string | null;
    status: string;
    profile_photo_path: string | null;
    deleted_at: string | null;
}

export default function Student({ students = { data: [], links: [] }, filters = {} }: { students: any; filters: any }) {
    const studentsList = students?.data || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isForceDeleteOpen, setIsForceDeleteOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isPromoteOpen, setIsPromoteOpen] = useState(false);
    const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
    const [isBulkForceDeleteOpen, setIsBulkForceDeleteOpen] = useState(false);
    const [isBulkRestoreOpen, setIsBulkRestoreOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const [search, setSearch] = useState(filters.search || '');
    const [classFilter, setClassFilter] = useState(filters.class || '');

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        class: '',
        dob: '',
        gender: '',
        guardian_name: '',
        guardian_phone: '',
        address: '',
        status: 'active',
        profile_photo: null as File | null,
        _method: 'post',
    });

    const { data: importData, setData: setImportData, post: postImport, processing: importProcessing, reset: resetImport, errors: importErrors } = useForm({
        file: null as File | null,
    });

    const { data: promoteData, setData: setPromoteData, post: postPromote, processing: promoteProcessing, reset: resetPromote, errors: promoteErrors } = useForm({
        student_ids: [] as number[],
        to_class: '',
    });

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(studentsList.map((s: StudentData) => s.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds((prev) => [...prev, id]);
        } else {
            setSelectedIds((prev) => prev.filter((i) => i !== id));
        }
    };

    const openPromoteModal = () => {
        setPromoteData('student_ids', selectedIds);
        setIsPromoteOpen(true);
    };

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedStudent(null);
        reset();
        setData('_method', 'post');
        clearErrors();
        setPreviewUrl(null);
        setIsModalOpen(true);
    };

    const openEditModal = (student: StudentData) => {
        setModalMode('edit');
        setSelectedStudent(student);
        setData({
            name: student.name || '',
            class: student.class || '',
            dob: student.dob || '',
            gender: student.gender || '',
            guardian_name: student.guardian_name || '',
            guardian_phone: student.guardian_phone || '',
            address: student.address || '',
            status: student.status || 'active',
            profile_photo: null,
            _method: 'put',
        });
        setPreviewUrl(student.profile_photo_path ? `/storage/${student.profile_photo_path}` : null);
        clearErrors();
        setIsModalOpen(true);
    };

    const openDeleteModal = (student: StudentData) => {
        setSelectedStudent(student);
        setIsDeleteOpen(true);
    };

    const openForceDeleteModal = (student: StudentData) => {
        setSelectedStudent(student);
        setIsForceDeleteOpen(true);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('profile_photo', file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setData('profile_photo', null);
            setPreviewUrl(modalMode === 'edit' && selectedStudent?.profile_photo_path ? `/storage/${selectedStudent.profile_photo_path}` : null);
        }
    };

    const handleModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (modalMode === 'create') {
            post('/student/store', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(`/student/${selectedStudent?.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedStudent?.id) {
            router.delete(`/student/${selectedStudent.id}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setSelectedStudent(null);
                },
            });
        }
    };

    const handleForceDelete = () => {
        if (selectedStudent?.id) {
            router.delete(`/student/${selectedStudent.id}/force`, {
                onSuccess: () => {
                    setIsForceDeleteOpen(false);
                    setSelectedStudent(null);
                },
            });
        }
    };

    const handleImport = (e: React.FormEvent) => {
        e.preventDefault();
        postImport('/students/import', {
            onSuccess: () => {
                setIsImportOpen(false);
                resetImport();
            }
        });
    };

    const handlePromote = (e: React.FormEvent) => {
        e.preventDefault();
        postPromote('/students/promote', {
            onSuccess: () => {
                setIsPromoteOpen(false);
                resetPromote();
                setSelectedIds([]);
            }
        });
    };

    const handleBulkDelete = () => {
        router.delete('/students/bulk', {
            data: { student_ids: selectedIds },
            onSuccess: () => {
                setIsBulkDeleteOpen(false);
                setSelectedIds([]);
            }
        });
    };

    const handleBulkForceDelete = () => {
        router.delete('/students/bulk/force', {
            data: { student_ids: selectedIds },
            onSuccess: () => {
                setIsBulkForceDeleteOpen(false);
                setSelectedIds([]);
            }
        });
    };

    const handleBulkRestore = () => {
        router.post('/students/bulk/restore', {
            student_ids: selectedIds,
        }, {
            onSuccess: () => {
                setIsBulkRestoreOpen(false);
                setSelectedIds([]);
            }
        });
    };

    const applyFilters = () => {
        router.get('/students', { search, class: classFilter }, { preserveState: true });
    };

    return (
        <>
            <Head title="Students" />
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
                                    <BreadcrumbPage>Students</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" onClick={() => setIsImportOpen(true)}>
                            <Upload className="mr-2 h-4 w-4" /> Import CSV
                        </Button>
                        {selectedIds.length > 0 && (
                            <>
                                <Button variant="outline" onClick={openPromoteModal}>
                                    <TrendingUp className="mr-2 h-4 w-4" /> Promote ({selectedIds.length})
                                </Button>
                                <Button variant="outline" onClick={() => setIsBulkRestoreOpen(true)}>
                                    Restore ({selectedIds.length})
                                </Button>
                                <Button variant="destructive" onClick={() => setIsBulkDeleteOpen(true)}>
                                    Delete ({selectedIds.length})
                                </Button>
                                <Button variant="destructive" onClick={() => setIsBulkForceDeleteOpen(true)}>
                                    Permanent Delete ({selectedIds.length})
                                </Button>
                            </>
                        )}
                        <Button onClick={openCreateModal}>Add Student</Button>
                    </div>
                </div>

                <div className="filters flex gap-4 items-center bg-white p-4 rounded shadow-sm">
                    <div className="flex-1 relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or admission no..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <div className="w-1/3">
                        <Input
                            placeholder="Filter by class (e.g. Grade 1)..."
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.target.value)}
                        />
                    </div>
                    <Button variant="secondary" onClick={applyFilters}>Filter</Button>
                    <Button variant="outline" onClick={() => { setSearch(''); setClassFilter(''); router.get('/students'); }}>Reset</Button>
                </div>

                <div className="Student-table">
                    <Card>
                        <CardHeader>Students List</CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={studentsList.length > 0 && selectedIds.length === studentsList.length}
                                                onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                            />
                                        </TableHead>
                                        <TableHead>Photo</TableHead>
                                        <TableHead>Admission No</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Class</TableHead>
                                        <TableHead>Gender</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="flex justify-end">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {studentsList.length > 0 ? (
                                        studentsList.map((student: StudentData) => (
                                            <TableRow key={student.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedIds.includes(student.id)}
                                                        onCheckedChange={(checked) => handleSelectOne(student.id, checked as boolean)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {student.profile_photo_path ? (
                                                        <img src={`/storage/${student.profile_photo_path}`} alt="Profile" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium text-blue-600">
                                                    {student.admission_no}
                                                </TableCell>
                                                <TableCell>
                                                    {student.name}
                                                    {student.deleted_at && (
                                                        <Badge variant="secondary" className="ml-2 uppercase text-[10px]">Archived</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>{student.class}</TableCell>
                                                <TableCell className="capitalize">{student.gender || '-'}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {student.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="flex justify-end gap-4">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="outline"><Ellipsis /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent className="w-40" align="end">
                                                            <DropdownMenuGroup>
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/student/${student.id}`}>View Profile</Link>
                                                                </DropdownMenuItem>
                                                                {student.deleted_at ? (
                                                                    <>
                                                                        <DropdownMenuItem onClick={() => router.post(`/student/${student.id}/restore`)}>Restore</DropdownMenuItem>
                                                                        <DropdownMenuItem className="text-destructive" onClick={() => openForceDeleteModal(student)}>Permanent Delete</DropdownMenuItem>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <DropdownMenuItem onClick={() => openEditModal(student)}>Edit</DropdownMenuItem>
                                                                        <DropdownMenuItem className="text-destructive" onClick={() => openDeleteModal(student)}>Delete</DropdownMenuItem>
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
                                                No students found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <Pagination links={students.links} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[700px] overflow-y-auto max-h-[90vh]">
                    <form onSubmit={handleModalSubmit} encType="multipart/form-data">
                        <DialogHeader>
                            <DialogTitle>{modalMode === 'create' ? 'Add Student' : 'Edit Student'}</DialogTitle>
                            <DialogDescription>
                                {modalMode === 'create' ? 'Add a new student. The admission number will be auto-generated.' : 'Update the student details.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required placeholder="John Doe" />
                                {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="class">Class/Grade *</Label>
                                <Input id="class" value={data.class} onChange={(e) => setData('class', e.target.value)} required placeholder="Grade 10-A" />
                                {errors.class && <span className="text-sm text-red-500">{errors.class}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input id="dob" type="date" value={data.dob} onChange={(e) => setData('dob', e.target.value)} />
                                {errors.dob && <span className="text-sm text-red-500">{errors.dob}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select value={data.gender} onValueChange={(val) => setData('gender', val)}>
                                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.gender && <span className="text-sm text-red-500">{errors.gender}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="guardian_name">Guardian Name</Label>
                                <Input id="guardian_name" value={data.guardian_name} onChange={(e) => setData('guardian_name', e.target.value)} placeholder="Jane Doe" />
                                {errors.guardian_name && <span className="text-sm text-red-500">{errors.guardian_name}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="guardian_phone">Guardian Phone</Label>
                                <Input id="guardian_phone" value={data.guardian_phone} onChange={(e) => setData('guardian_phone', e.target.value)} placeholder="+1 234 567 8900" />
                                {errors.guardian_phone && <span className="text-sm text-red-500">{errors.guardian_phone}</span>}
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
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} placeholder="123 Main St, City" />
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
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>{modalMode === 'create' ? 'Save' : 'Update'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Import CSV Modal */}
            <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleImport}>
                        <DialogHeader>
                            <DialogTitle>Import Students via CSV</DialogTitle>
                            <DialogDescription>
                                Upload a CSV file with columns: name, class, dob, gender, guardian_name, guardian_phone.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Label htmlFor="file">CSV File</Label>
                            <Input id="file" type="file" accept=".csv" onChange={(e) => setImportData('file', e.target.files ? e.target.files[0] : null)} required />
                            {importErrors.file && <span className="text-sm text-red-500">{importErrors.file}</span>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsImportOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={importProcessing}>Import</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Promote Class Modal */}
            <Dialog open={isPromoteOpen} onOpenChange={setIsPromoteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handlePromote}>
                        <DialogHeader>
                            <DialogTitle>Promote Selected Students</DialogTitle>
                            <DialogDescription>
                                Move the {selectedIds.length} selected students to a new class.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="to_class">New Class / Grade</Label>
                                <Input id="to_class" value={promoteData.to_class} onChange={(e) => setPromoteData('to_class', e.target.value)} required placeholder="e.g. Grade 10" />
                                {promoteErrors.to_class && <span className="text-sm text-red-500">{promoteErrors.to_class}</span>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsPromoteOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={promoteProcessing}>Promote</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Bulk Delete Confirmation Modal */}
            <Dialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Archive Selected</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to archive {selectedIds.length} selected students? This is a soft-delete to preserve historical data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsBulkDeleteOpen(false)}>Cancel</Button>
                        <Button type="button" variant="destructive" onClick={handleBulkDelete}>Archive Selected</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Force Delete Confirmation Modal */}
            <Dialog open={isBulkForceDeleteOpen} onOpenChange={setIsBulkForceDeleteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Permanent Deletion (Bulk)</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to permanently delete {selectedIds.length} selected students? This action cannot be undone and will completely wipe all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsBulkForceDeleteOpen(false)}>Cancel</Button>
                        <Button type="button" variant="destructive" onClick={handleBulkForceDelete}>Delete Permanently</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Restore Confirmation Modal */}
            <Dialog open={isBulkRestoreOpen} onOpenChange={setIsBulkRestoreOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Restore Selected</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to restore {selectedIds.length} selected archived students?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsBulkRestoreOpen(false)}>Cancel</Button>
                        <Button type="button" variant="default" onClick={handleBulkRestore}>Restore Selected</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Archive Student</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to deactivate {selectedStudent?.name}? This is a soft-delete to preserve historical data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button type="button" variant="destructive" disabled={processing} onClick={handleDelete}>Archive</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Force Delete Confirmation Modal */}
            <Dialog open={isForceDeleteOpen} onOpenChange={setIsForceDeleteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Permanent Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to permanently delete {selectedStudent?.name}? This action cannot be undone and will completely wipe all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsForceDeleteOpen(false)}>Cancel</Button>
                        <Button type="button" variant="destructive" disabled={processing} onClick={handleForceDelete}>Delete Permanently</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Student.layout = {
    breadcrumbs: [
        {
            title: 'Students',
            href: '/students',
        },
    ],
};
