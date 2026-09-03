import { Link, usePage } from '@inertiajs/react';
import {
    Award,
    Book,
    BookOpen,
    Clipboard,
    ClipboardList,
    Coins,
    FileText,
    FolderGit2,
    GraduationCap,
    LayoutGrid,
    Receipt,
    User,
    Calendar,
    CalendarCheck,
    LineChart,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Teachers',
        href: '/teachers',
        icon: GraduationCap,
    },
    {
        title: 'Students',
        href: '/students',
        icon: User,
    },
    {
        title: 'Courses',
        href: '/courses',
        icon: Book,
    },
    {
        title: 'Enrollments',
        href: '/enrollments',
        icon: BookOpen,
    },
    {
        title: 'Exams',
        href: '/exams',
        icon: ClipboardList,
    },
    {
        title: 'Grades',
        href: '/grades',
        icon: Clipboard,
    },
    {
        title: 'Grading Scales',
        href: '/grading-scales',
        icon: Award,
    },
    {
        title: 'Report Cards',
        href: '/report-cards',
        icon: FileText,
    },
    {
        title: 'Fee Structures',
        href: '/fee-structures',
        icon: Coins,
    },
    {
        title: 'Invoices',
        href: '/invoices',
        icon: Receipt,
    },
    {
        title: 'Timetable',
        href: '/timetable',
        icon: Calendar,
    },
    {
        title: 'Mark Attendance',
        href: '/attendance',
        icon: CalendarCheck,
    },
    {
        title: 'Attendance Report',
        href: '/attendance/report',
        icon: LineChart,
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: FolderGit2,
    // },
    
];

export function AppSidebar() {
    const { auth } = usePage<any>().props;
    const isSuperAdmin = auth.user.role === 'super-admin';
    
    const navItems = isSuperAdmin ? [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Schools',
            href: '/admin/tenants',
            icon: ClipboardList,
        },
    ] : mainNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
