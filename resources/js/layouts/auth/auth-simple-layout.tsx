import { Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const benefits = [
        'Manage students, teachers, and courses',
        'Track attendance, exams, and report cards',
        'Handle fees, invoices, and payments',
        'Multi-tenant data isolation per school',
    ];

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            {/* Brand panel */}
            <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#0B1F3A] to-[#050F1F]" />
                <div className="absolute -top-24 -right-24 size-96 rounded-full bg-accent/20 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-secondary/10 blur-3xl" />

                <Link href="/" className="relative z-10 flex items-center">
                    <AppLogoIcon className="h-8 w-auto sm:h-12" />
                </Link>

                <div className="relative z-10 space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight xl:text-4xl">
                        One Platform. Every School
                    </h2>
                    <p className="max-w-md text-zinc-300">
                        A complete platform for administrators, teachers, and staff to
                        keep school operations running smoothly.
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

            {/* Form panel */}
            <div className="flex items-center justify-center bg-background p-6 md:p-10">
                <div className="w-full max-w-md space-y-6">
                    <div className="flex flex-col items-center gap-3 lg:hidden">
                        <Link href="/" className="flex items-center">
                            <AppLogoIcon className="h-8 w-auto sm:h-12" />
                        </Link>
                    </div>

                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                        {description && (
                            <p className="text-sm text-muted-foreground">{description}</p>
                        )}
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}