import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Edit, Trash, Calendar as CalendarIcon } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface Course {
    id: number;
    name: string;
}

interface Teacher {
    id: number;
    name: string;
}

interface TimetableSlot {
    id: number;
    course_id: number;
    teacher_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    room: string | null;
    course?: Course;
    teacher?: Teacher;
}

interface TimetableProps {
    slots: TimetableSlot[];
    courses: Course[];
    teachers: Teacher[];
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Timetable({ slots, courses, teachers }: TimetableProps) {
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;
    const isTeacher = auth.user.role === 'teacher';

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedSlot, setSelectedSlot] = useState<TimetableSlot | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        course_id: '',
        teacher_id: '',
        day_of_week: 'Monday',
        start_time: '08:00',
        end_time: '09:00',
        room: '',
    });

    // Helper to format time for display
    const formatTime = (time: string) => {
        return time.substring(0, 5); // "08:00:00" -> "08:00"
    };

    const openCreateModal = () => {
        setModalMode('create');
        clearErrors();
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (slot: TimetableSlot) => {
        setModalMode('edit');
        setSelectedSlot(slot);
        clearErrors();
        setData({
            course_id: slot.course_id.toString(),
            teacher_id: slot.teacher_id.toString(),
            day_of_week: slot.day_of_week,
            start_time: formatTime(slot.start_time),
            end_time: formatTime(slot.end_time),
            room: slot.room || '',
        });
        setIsModalOpen(true);
    };

    const openDeleteModal = (slot: TimetableSlot) => {
        setSelectedSlot(slot);
        setIsDeleteOpen(true);
    };

    const handleModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'create') {
            post('/timetable', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else if (modalMode === 'edit' && selectedSlot) {
            put(`/timetable/${selectedSlot.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedSlot) {
            destroy(`/timetable/${selectedSlot.id}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                },
            });
        }
    };

    // Group slots by day
    const groupedSlots = useMemo(() => {
        const grouped: Record<string, TimetableSlot[]> = {};
        DAYS_OF_WEEK.forEach(day => {
            grouped[day] = slots
                .filter(slot => slot.day_of_week === day)
                .sort((a, b) => a.start_time.localeCompare(b.start_time));
        });
        return grouped;
    }, [slots]);

    return (
        <>
            <Head title="Class Timetable" />
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
                                    <BreadcrumbPage>Timetable</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    {!isTeacher && (
                        <div>
                            <Button onClick={openCreateModal}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Schedule Slot
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                    {/* Only show Monday-Friday by default for clean view, or let it overflow */}
                    {DAYS_OF_WEEK.slice(0, 5).map(day => (
                        <Card key={day} className="flex flex-col h-full shadow-sm border-t-4 border-t-primary/20">
                            <CardHeader className="py-3 px-4 border-b bg-muted/20">
                                <h3 className="font-semibold text-center flex items-center justify-center gap-2">
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                    {day}
                                </h3>
                            </CardHeader>
                            <CardContent className="p-4 flex-1 flex flex-col gap-3 overflow-y-auto">
                                {groupedSlots[day]?.length === 0 ? (
                                    <div className="text-sm text-center text-muted-foreground italic mt-4 py-8 border-2 border-dashed rounded-lg border-muted">
                                        No classes scheduled
                                    </div>
                                ) : (
                                    groupedSlots[day]?.map(slot => (
                                        <div key={slot.id} className="group relative bg-card border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-primary">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="text-sm font-semibold text-primary">
                                                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                                </div>
                                                {!isTeacher && (
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-6 w-6 p-0">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => openEditModal(slot)}>
                                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openDeleteModal(slot)} className="text-destructive focus:text-destructive">
                                                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="font-medium truncate mb-1">
                                                {slot.course?.name || 'Unknown Course'}
                                            </div>
                                            <div className="text-xs text-muted-foreground flex flex-col gap-1">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold">Teacher:</span> {slot.teacher?.name || 'Unassigned'}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold">Room:</span> {slot.room || 'TBD'}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleModalSubmit}>
                        <DialogHeader>
                            <DialogTitle>{modalMode === 'create' ? 'Add Schedule Slot' : 'Edit Schedule Slot'}</DialogTitle>
                            <DialogDescription>
                                Set the timing and location for a class.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="course_id">Course</Label>
                                <Select value={data.course_id} onValueChange={(val) => setData('course_id', val)}>
                                    <SelectTrigger>
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
                                {errors.course_id && <span className="text-sm text-red-500">{errors.course_id}</span>}
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="teacher_id">Teacher</Label>
                                <Select value={data.teacher_id} onValueChange={(val) => setData('teacher_id', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Teacher" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teachers.map((teacher) => (
                                            <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                                {teacher.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.teacher_id && <span className="text-sm text-red-500">{errors.teacher_id}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="day_of_week">Day of Week</Label>
                                <Select value={data.day_of_week} onValueChange={(val) => setData('day_of_week', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Day" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DAYS_OF_WEEK.map((day) => (
                                            <SelectItem key={day} value={day}>
                                                {day}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.day_of_week && <span className="text-sm text-red-500">{errors.day_of_week}</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="start_time">Start Time</Label>
                                    <Input 
                                        id="start_time" 
                                        type="time" 
                                        value={data.start_time} 
                                        onChange={(e) => setData('start_time', e.target.value)} 
                                        required 
                                    />
                                    {errors.start_time && <span className="text-sm text-red-500">{errors.start_time}</span>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="end_time">End Time</Label>
                                    <Input 
                                        id="end_time" 
                                        type="time" 
                                        value={data.end_time} 
                                        onChange={(e) => setData('end_time', e.target.value)} 
                                        required 
                                    />
                                    {errors.end_time && <span className="text-sm text-red-500">{errors.end_time}</span>}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="room">Room (Optional)</Label>
                                <Input 
                                    id="room" 
                                    value={data.room} 
                                    onChange={(e) => setData('room', e.target.value)} 
                                    placeholder="e.g. Room 101" 
                                />
                                {errors.room && <span className="text-sm text-red-500">{errors.room}</span>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>{modalMode === 'create' ? 'Save' : 'Update'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Schedule Slot</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this class slot?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button type="button" variant="destructive" disabled={processing} onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Timetable.layout = {
    breadcrumbs: [
        {
            title: 'Timetable',
            href: '/timetable',
        },
    ],
};
