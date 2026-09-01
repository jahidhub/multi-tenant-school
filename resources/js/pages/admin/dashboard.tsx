import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Building2, Users, GraduationCap, BookOpen, UserCircle, Plus, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface StatsData {
    schools: number;
    students: number;
    schoolAdmins: number;
    activeSchools: number;
    suspendedSchools: number;
}

interface SchoolData {
    id: number;
    name: string;
    slug: string | null;
    plan: string;
    plan_cap: number | string;
    status: string;
    admin_email: string;
    student_count: number;
}

interface ChartData {
    name: string;
    total: number;
}

interface DashboardProps {
    stats: StatsData;
    schoolsData: SchoolData[];
    registrationsChart: ChartData[];
}

export default function AdminDashboard({ stats, schoolsData, registrationsChart }: DashboardProps) {
    return (
        <>
            <Head title="Super Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Super Admin Dashboard</h1>
                        <p className="text-muted-foreground">Overview of the entire multi-tenant system.</p>
                        
                        {/* Active/Suspended Indicator */}
                        <div className="mt-2 flex items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                <span className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400"></span>
                                {stats.activeSchools} Active Schools
                            </span>
                            {stats.suspendedSchools > 0 && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                    <span className="h-2 w-2 rounded-full bg-red-600 dark:bg-red-400"></span>
                                    {stats.suspendedSchools} Suspended
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <Button asChild className="shrink-0 gap-2">
                        <Link href="/admin/tenants/create">
                            <Plus className="h-4 w-4" />
                            Add School
                        </Link>
                    </Button>
                </div>
                
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <span className="text-sm font-medium text-muted-foreground">Total Schools</span>
                            <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.schools}</div>
                        </CardContent>
                    </Card>

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
                            <span className="text-sm font-medium text-muted-foreground">Total School-Admins</span>
                            <UserCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.schoolAdmins}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Chart Section */}
                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold tracking-tight">Growth: Schools Onboarded</h2>
                                    <p className="text-sm text-muted-foreground">Number of new schools joining the platform over time.</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {registrationsChart.length === 0 ? (
                                <div className="py-8 text-center text-muted-foreground">No historical data available.</div>
                            ) : (
                                <div className="h-[300px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={registrationsChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} allowDecimals={false} />
                                            <Tooltip 
                                                cursor={{ fill: 'currentColor', opacity: 0.05 }}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-blue-600 dark:fill-blue-500" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Platform Metadata Table */}
                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold tracking-tight">Platform Metadata</h2>
                                    <p className="text-sm text-muted-foreground">Detailed overview of all registered schools on the platform.</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">School Name</th>
                                            <th className="px-4 py-3 font-medium">Slug</th>
                                            <th className="px-4 py-3 font-medium">Admin Email</th>
                                            <th className="px-4 py-3 font-medium text-center">Students / Cap</th>
                                            <th className="px-4 py-3 font-medium">Plan</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {schoolsData.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                                    No schools found on the platform.
                                                </td>
                                            </tr>
                                        ) : (
                                            schoolsData.map((school) => {
                                                const isNearCap = typeof school.plan_cap === 'number' && school.student_count >= (school.plan_cap * 0.9);
                                                
                                                return (
                                                    <tr key={school.id} className="hover:bg-muted/50 transition-colors">
                                                        <td className="px-4 py-3 font-medium">{school.name}</td>
                                                        <td className="px-4 py-3 text-muted-foreground">{school.slug || '-'}</td>
                                                        <td className="px-4 py-3">
                                                            {school.admin_email !== 'N/A' ? (
                                                                <a href={`mailto:${school.admin_email}`} className="text-blue-600 hover:underline dark:text-blue-400">
                                                                    {school.admin_email}
                                                                </a>
                                                            ) : (
                                                                <span className="text-muted-foreground italic">N/A</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <div className={`inline-flex items-center justify-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                                                isNearCap 
                                                                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
                                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                            }`}>
                                                                {school.student_count} / {school.plan_cap}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="capitalize font-medium">{school.plan}</span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                                                                school.status === 'active' 
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                            }`}>
                                                                {school.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <Button asChild size="sm" variant="outline" className="h-8 gap-1.5 text-xs font-medium border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950/50">
                                                                <Link href={`/admin/tenants/${school.id}/impersonate`} method="post" as="button">
                                                                    <ShieldAlert className="h-3 w-3" />
                                                                    Login as School
                                                                </Link>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
    ],
};
