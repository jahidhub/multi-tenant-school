import { Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { tenant } = usePage<any>().props;
    const resolvedTitle = tenant?.institute_name
        ? (title?.toLowerCase().includes('log in') ? `Log in to ${tenant.institute_name}` : title)
        : title;
    const resolvedDescription = tenant?.tagline ?? description;

    useEffect(() => {
        if (tenant?.institute_name) {
            document.title = `Log in - ${tenant.institute_name}`;
        }
    }, [tenant?.institute_name]);

    const benefits = [
        'Manage students, teachers, and courses',
        'Track attendance, exams, and report cards',
        'Handle fees, invoices, and payments',
        'Multi-tenant data isolation per school',
    ];

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0B1F3A] p-10 text-white lg:flex">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#0B1F3A] to-[#050F1F]" />
                <div className="absolute -top-24 -right-24 size-96 rounded-full bg-accent/20 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-secondary/10 blur-3xl" />

                <Link href="/" className="relative z-10 flex items-center">
                    <div className="flex items-center justify-center rounded-lg bg-white p-2">
                        <AppLogoIcon className="h-8 w-auto sm:h-12" />
                    </div>
                    {tenant && (
                        <span className="ml-3 text-lg font-semibold">{tenant.institute_name}</span>
                    )}
                </Link>

                <div className="relative z-10 space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight xl:text-4xl">
                        {tenant ? tenant.institute_name : 'One Platform. Every School'}
                    </h2>
                    <p className="max-w-md text-zinc-300">
                        {tenant?.tagline ?? 'A complete platform for administrators, teachers, and staff to keep school operations running smoothly.'}
                    </p>
                    <ul className="space-y-3">
                        {benefits.map((benefit) => (
                            <li key={benefit} className="flex items-center gap-3 text-sm text-zinc-200">
                                <CheckCircle2 className="size-4 shrink-0 text-accent" />
                                {benefit}
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative z-10 text-xs text-zinc-500">
                    © {new Date().getFullYear()} Sehrix Technologies. All rights reserved.
                </p>
            </div>

            <div className="flex items-center justify-center bg-background p-6 md:p-10">
                <div className="w-full max-w-md space-y-6">
                    <div className="flex flex-col items-center gap-3 lg:hidden">
                        <Link href="/" className="flex items-center">
                            <div className="flex items-center justify-center rounded-lg bg-white p-2">
                                <AppLogoIcon className="h-8 w-auto sm:h-12" />
                            </div>
                        </Link>
                    </div>

                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-bold tracking-tight">{resolvedTitle}</h1>
                        {resolvedDescription && (
                            <p className="text-sm text-muted-foreground">{resolvedDescription}</p>
                        )}
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
