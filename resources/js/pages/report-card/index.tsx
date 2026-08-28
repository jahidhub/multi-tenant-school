import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

    const handleDownloadReport = (studentId: number) => {
        window.open(`/students/${studentId}/report-card`, '_blank');
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
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDownloadReport(student.id)}
                                                    >
                                                        Download PDF
                                                    </Button>
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
            </div>
        </>
    );
}
