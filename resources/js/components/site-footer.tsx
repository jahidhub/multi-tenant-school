import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { useState } from 'react';
import {
    ArrowUp,
    Github,
    Globe,
    Linkedin,
    Mail,
    Twitter,
} from 'lucide-react';

const socialLinks = [
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Github, label: 'GitHub', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
    { icon: Mail, label: 'Email', href: 'mailto:hello@sehrix.com' },
];

const columns = [
    {
        title: 'Product',
        links: [
            { label: 'Features', href: '#features' },
            { label: 'Modules', href: '#modules' },
            { label: 'Why Sehrix', href: '#stats' },
            { label: 'Get started', href: '/register' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About', href: '#' },
            { label: 'Careers', href: '#' },
            { label: 'Blog', href: '#' },
            { label: 'Contact', href: 'mailto:hello@sehrix.com' },
        ],
    },
    {
        title: 'Support',
        links: [
            { label: 'Help center', href: '#' },
            { label: 'Documentation', href: '#' },
            { label: 'Privacy policy', href: '#' },
            { label: 'Terms of service', href: '#' },
        ],
    },
];

export default function SiteFooter() {
    const [lang, setLang] = useState<'en' | 'bn'>('en');

    return (
        <footer className="border-t bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="inline-flex items-center">
                            <AppLogoIcon className="h-10 w-auto" />
                        </Link>
                        <p className="text-sm text-body">
                            One Platform. Every School. Manage students, teachers, courses,
                            attendance, exams, fees, and report cards in one place.
                        </p>
                        <div className="flex items-center gap-2">
                            {socialLinks.map(({ icon: Icon, label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="flex size-11 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                                >
                                    <Icon className="size-5" />
                                </a>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Dhaka, Bangladesh · hello@sehrix.com
                        </p>
                    </div>

                    {/* Link columns */}
                    {columns.map((column) => (
                        <div key={column.title}>
                            <h3 className="text-sm font-semibold text-foreground">
                                {column.title}
                            </h3>
                            <ul className="mt-4 space-y-2 text-sm">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground sm:flex-row">
                    <p>© {new Date().getFullYear()} Sehrix Technologies. All rights reserved.</p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/login" className="transition-colors hover:text-foreground">
                            Log in
                        </Link>
                        <Link href="/register" className="transition-colors hover:text-foreground">
                            Sign up
                        </Link>
                    
                        <button
                            type="button"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                        >
                            Back to top
                            <ArrowUp className="size-4" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}