import { Head, useForm, Link } from '@inertiajs/react';
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
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface ExamData {
    id: number;
    course_id: number;
    name: string;
    exam_date: string;
    max_marks: number;
    course?: {
        course_name: string;
    } | null;
}

interface StudentGradeData {
    id: number;
    name: string;
    roll_number: string;
    class: string;
    marks_obtained: number | '';
    remarks: string;
}

interface MarksProps {
    exam: ExamData;
    students: StudentGradeData[];
}

export default function Marks({ exam, students = [] }: MarksProps) {
    const { data, setData, post, processing, errors } = useForm({
        marks: students.map((student) => ({
            student_id: student.id,
            marks_obtained: student.marks_obtained,
            remarks: student.remarks,
        })),
    });

    const handleMarkChange = (index: number, value: string) => {
        const newMarks = [...data.marks];
        newMarks[index].marks_obtained = value === '' ? '' : parseInt(value) || 0;
        setData('marks', newMarks);
    };

    const handleRemarkChange = (index: number, value: string) => {
        const newMarks = [...data.marks];
        newMarks[index].remarks = value;
        setData('marks', newMarks);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/exams/${exam.id}/marks`);
    };

    return (
        <>
            <Head title={`Enter Marks - ${exam.name}`} />
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
                                    <BreadcrumbLink href="/exams">
                                        Exams
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Enter Marks</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div>
                        <Button variant="outline" asChild>
                            <Link href="/exams">Back to Exams</Link>
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col gap-1">
                                <div>Student Gradesheet - {exam.name}</div>
                                <div className="text-sm font-normal text-muted-foreground">
                                    Course: <span className="font-semibold text-foreground">{exam.course?.course_name || 'N/A'}</span> | Max Marks: <span className="font-semibold text-foreground">{exam.max_marks}</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">Roll No.</TableHead>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead>Class</TableHead>
                                            <TableHead className="w-[180px]">Marks Obtained</TableHead>
                                            <TableHead>Remarks / Feedback</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {students.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                                    No students enrolled in this course. Enroll students first!
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            students.map((student, index) => {
                                                const markErrorKey = `marks.${index}.marks_obtained`;
                                                const remarkErrorKey = `marks.${index}.remarks`;
                                                const markError = errors[markErrorKey];
                                                const remarkError = errors[remarkErrorKey];

                                                return (
                                                    <TableRow key={student.id}>
                                                        <TableCell className="font-medium">{student.roll_number}</TableCell>
                                                        <TableCell className="font-medium">{student.name}</TableCell>
                                                        <TableCell>{student.class}</TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-2">
                                                                    <Input
                                                                        type="number"
                                                                        min="0"
                                                                        max={exam.max_marks}
                                                                        value={data.marks[index].marks_obtained}
                                                                        onChange={(e) => handleMarkChange(index, e.target.value)}
                                                                        className="w-24"
                                                                        placeholder="Marks"
                                                                    />
                                                                    <span className="text-sm text-muted-foreground">/ {exam.max_marks}</span>
                                                                </div>
                                                                {markError && (
                                                                    <span className="text-xs text-destructive">{markError}</span>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col gap-1">
                                                                <Input
                                                                    type="text"
                                                                    value={data.marks[index].remarks}
                                                                    onChange={(e) => handleRemarkChange(index, e.target.value)}
                                                                    className="w-full max-w-md"
                                                                    placeholder="e.g. Excellent work, Needs improvement"
                                                                />
                                                                {remarkError && (
                                                                    <span className="text-xs text-destructive">{remarkError}</span>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {students.length > 0 && (
                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" asChild>
                                <Link href="/exams">Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Save Marks
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
}
