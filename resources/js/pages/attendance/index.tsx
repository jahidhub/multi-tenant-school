import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { FormEventHandler, useEffect } from 'react';
import { router } from '@inertiajs/react';

interface Course {
    id: number;
    name: string;
}

interface StudentAttendance {
    id: number;
    name: string;
    roll_number: string;
    class: string;
    status: 'present' | 'absent' | 'late' | 'excused';
}

interface AttendanceProps {
    courses: Course[];
    students: StudentAttendance[];
    filters: {
        course_id: string;
        date: string;
    };
}

export default function Attendance({ courses, students, filters }: AttendanceProps) {
    const { data, setData, post, processing } = useForm({
        course_id: filters.course_id || '',
        date: filters.date || new Date().toISOString().split('T')[0],
        attendance: students.map(s => ({
            student_id: s.id.toString(),
            status: s.status,
        })),
    });

    // When the user changes course or date, we should reload the page data
    const handleFilterChange = (field: string, value: string) => {
        router.get('/attendance', {
            ...filters,
            [field]: value,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    // Update attendance array when students prop changes
    useEffect(() => {
        setData('attendance', students.map(s => ({
            student_id: s.id.toString(),
            status: s.status,
        })));
    }, [students]);

    const handleStatusChange = (studentId: string, status: string) => {
        const newAttendance = data.attendance.map(record => {
            if (record.student_id === studentId) {
                return { ...record, status };
            }
            return record;
        });
        setData('attendance', newAttendance);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/attendance');
    };

    return (
        <>
            <Head title="Mark Attendance" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Mark Attendance</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <Card>
                    <CardHeader>
                        <CardTitle>Mark Class Attendance</CardTitle>
                        <CardDescription>Select a course and date to record attendance for enrolled students.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="flex-1">
                                <Label htmlFor="course">Course</Label>
                                <Select 
                                    value={filters.course_id || ''} 
                                    onValueChange={(val) => handleFilterChange('course_id', val)}
                                >
                                    <SelectTrigger id="course">
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
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="date">Date</Label>
                                <Input 
                                    id="date" 
                                    type="date" 
                                    value={filters.date} 
                                    onChange={(e) => handleFilterChange('date', e.target.value)} 
                                />
                            </div>
                        </div>

                        {filters.course_id && (
                            <form onSubmit={handleSubmit}>
                                {students.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/20">
                                        No active students found in this course.
                                    </div>
                                ) : (
                                    <>
                                        <div className="rounded-md border mb-4 overflow-x-auto">
                                            <Table>
                                                <TableHeader className="bg-muted/50">
                                                    <TableRow>
                                                        <TableHead>Roll No.</TableHead>
                                                        <TableHead>Student Name</TableHead>
                                                        <TableHead>Class</TableHead>
                                                        <TableHead className="text-right min-w-[300px]">Attendance</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {students.map((student, idx) => {
                                                        const currentStatus = data.attendance.find(a => a.student_id === student.id.toString())?.status || 'present';
                                                        
                                                        return (
                                                            <TableRow key={student.id}>
                                                                <TableCell className="font-medium">{student.roll_number}</TableCell>
                                                                <TableCell>{student.name}</TableCell>
                                                                <TableCell>{student.class}</TableCell>
                                                                <TableCell className="text-right">
                                                                    <RadioGroup 
                                                                        value={currentStatus} 
                                                                        onValueChange={(val) => handleStatusChange(student.id.toString(), val)}
                                                                        className="flex justify-end gap-6"
                                                                    >
                                                                        <div className="flex items-center space-x-2">
                                                                            <RadioGroupItem value="present" id={`present-${student.id}`} />
                                                                            <Label htmlFor={`present-${student.id}`} className="text-green-600 font-medium">Present</Label>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2">
                                                                            <RadioGroupItem value="late" id={`late-${student.id}`} />
                                                                            <Label htmlFor={`late-${student.id}`} className="text-yellow-600 font-medium">Late</Label>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2">
                                                                            <RadioGroupItem value="absent" id={`absent-${student.id}`} />
                                                                            <Label htmlFor={`absent-${student.id}`} className="text-red-600 font-medium">Absent</Label>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2">
                                                                            <RadioGroupItem value="excused" id={`excused-${student.id}`} />
                                                                            <Label htmlFor={`excused-${student.id}`} className="text-gray-500 font-medium">Excused</Label>
                                                                        </div>
                                                                    </RadioGroup>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button type="submit" disabled={processing || data.attendance.length === 0}>
                                                {processing ? 'Saving...' : 'Save Attendance'}
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Attendance.layout = {
    breadcrumbs: [
        {
            title: 'Attendance',
            href: '/attendance',
        },
    ],
};
