import { Head } from '@inertiajs/react';
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
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { router } from '@inertiajs/react';

interface Course {
    id: number;
    name: string;
}

interface ReportData {
    student: {
        id: number;
        name: string;
        roll_number: string;
        class: string;
    };
    total_days: number;
    present: number;
    late: number;
    absent: number;
    excused: number;
    percentage: number;
}

interface AttendanceReportProps {
    courses: Course[];
    reportData: ReportData[];
    filters: {
        course_id: string;
        start_date: string;
        end_date: string;
    };
}

export default function AttendanceReport({ courses, reportData, filters }: AttendanceReportProps) {
    const handleFilterChange = (field: string, value: string) => {
        router.get('/attendance/report', {
            ...filters,
            [field]: value,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title="Attendance Report" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Attendance Report</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <Card>
                    <CardHeader>
                        <CardTitle>Attendance Report</CardTitle>
                        <CardDescription>View attendance aggregates for a specific class and date range.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
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
                            <div>
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input 
                                    id="start_date" 
                                    type="date" 
                                    value={filters.start_date} 
                                    onChange={(e) => handleFilterChange('start_date', e.target.value)} 
                                />
                            </div>
                            <div>
                                <Label htmlFor="end_date">End Date</Label>
                                <Input 
                                    id="end_date" 
                                    type="date" 
                                    value={filters.end_date} 
                                    onChange={(e) => handleFilterChange('end_date', e.target.value)} 
                                />
                            </div>
                        </div>

                        {!filters.course_id ? (
                            <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/20">
                                Please select a course to view the report.
                            </div>
                        ) : reportData.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/20">
                                No students enrolled or no attendance records found for this period.
                            </div>
                        ) : (
                            <div className="rounded-md border overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead>Roll No.</TableHead>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead className="text-center">Total Days</TableHead>
                                            <TableHead className="text-center text-green-600">Present</TableHead>
                                            <TableHead className="text-center text-yellow-600">Late</TableHead>
                                            <TableHead className="text-center text-red-600">Absent</TableHead>
                                            <TableHead className="text-center text-gray-500">Excused</TableHead>
                                            <TableHead className="text-right">Attendance %</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportData.map((data, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell className="font-medium">{data.student.roll_number}</TableCell>
                                                <TableCell>{data.student.name}</TableCell>
                                                <TableCell className="text-center font-semibold">{data.total_days}</TableCell>
                                                <TableCell className="text-center">{data.present}</TableCell>
                                                <TableCell className="text-center">{data.late}</TableCell>
                                                <TableCell className="text-center">{data.absent}</TableCell>
                                                <TableCell className="text-center">{data.excused}</TableCell>
                                                <TableCell className="text-right">
                                                    <span className={`inline-block px-2 py-1 rounded font-semibold text-sm ${data.percentage >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : data.percentage >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                        {data.percentage}%
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AttendanceReport.layout = {
    breadcrumbs: [
        {
            title: 'Attendance Report',
            href: '/attendance/report',
        },
    ],
};
