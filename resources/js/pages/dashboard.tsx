import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Users, GraduationCap, BookOpen, AlertTriangle } from 'lucide-react';
import { dashboard } from '@/routes';

interface StatsData {
    students: number;
    teachers: number;
    courses: number;
    overdueAmount: string;
}

interface OverdueInvoiceData {
    id: number;
    student_id: number;
    amount_due: number | string;
    amount_paid: number | string;
    due_date: string;
    student?: {
        name: string;
        roll_number: string;
        class: string;
    } | null;
}

interface DashboardProps {
    stats: StatsData;
    overdueInvoices: OverdueInvoiceData[];
}

export default function Dashboard({ stats, overdueInvoices = [] }: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <span className="text-sm font-medium text-muted-foreground">Total Students</span>
                            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.students}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <span className="text-sm font-medium text-muted-foreground">Total Teachers</span>
                            <GraduationCap className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.teachers}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <span className="text-sm font-medium text-muted-foreground">Total Courses</span>
                            <BookOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.courses}</div>
                        </CardContent>
                    </Card>

                    <Card className="border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <span className="text-sm font-medium text-red-700 dark:text-red-400">Overdue Invoices</span>
                            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-700 dark:text-red-400">${stats.overdueAmount}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Overdue Receivables Widgets Table */}
                <div className="grid gap-6 md:grid-cols-1">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="text-lg font-semibold tracking-tight text-red-600 dark:text-red-400">Overdue Receivables Ledger</div>
                                    <div className="text-xs text-muted-foreground">Invoices past their due dates that require payment collection.</div>
                                </div>
                                <Button size="sm" asChild variant="outline">
                                    <Link href="/invoices?status=overdue">Manage Bills</Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead>Class</TableHead>
                                            <TableHead>Roll No</TableHead>
                                            <TableHead>Due Date</TableHead>
                                            <TableHead>Outstanding Balance</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {overdueInvoices.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                                    No overdue invoice receivables at this time. All clear!
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            overdueInvoices.map((invoice) => {
                                                const outstanding = parseFloat(invoice.amount_due as string) - parseFloat(invoice.amount_paid as string);
                                                return (
                                                    <TableRow key={invoice.id}>
                                                        <TableCell className="font-semibold">
                                                            <Link href={`/students/${invoice.student_id}`} className="hover:underline text-blue-600 dark:text-blue-400">
                                                                {invoice.student?.name}
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell>{invoice.student?.class}</TableCell>
                                                        <TableCell>{invoice.student?.roll_number ?? '-'}</TableCell>
                                                        <TableCell className="text-red-600 dark:text-red-400 font-medium">{invoice.due_date}</TableCell>
                                                        <TableCell className="font-bold text-red-600 dark:text-red-400">${outstanding.toFixed(2)}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Button size="sm" asChild variant="outline">
                                                                <Link href={`/students/${invoice.student_id}`}>Collect Fee</Link>
                                                            </Button>
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
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
