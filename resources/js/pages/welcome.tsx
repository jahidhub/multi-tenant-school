import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLogoIcon from '@/components/app-logo-icon';
import SiteFooter from '@/components/site-footer';
import { useEffect, useState } from 'react';
import {
    ArrowRight,
    BarChart3,
    BookOpen,
    Building2,
    CalendarDays,
    Check,
    CheckCircle2,
    ClipboardCheck,
    Clock,
    CreditCard,
    FileSpreadsheet,
    FileText,
    Globe,
    GraduationCap,
    Menu,
    ShieldCheck,
    Star,
    Users,
    X,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

// TODO: replace with your real contact page or email
const CONTACT_HREF = 'mailto:hello@sehrix.com';

const BENGALI_FONT = "'Hind Siliguri', 'Noto Sans Bengali', sans-serif";

type Lang = 'en' | 'bn';

const featureIcons = [
    Users,
    GraduationCap,
    BookOpen,
    CalendarDays,
    ClipboardCheck,
    FileText,
    CreditCard,
    Building2,
];
const statIcons = [Users, Clock, FileSpreadsheet, ShieldCheck];
const multiIcons = [ShieldCheck, BarChart3, ClipboardCheck, CreditCard];

// Prices are numbers so the discount and per-month figures are always computed
const GROWTH_MONTHLY = 2500;
const GROWTH_YEARLY = 25000;
const GROWTH_YEARLY_ORIGINAL = GROWTH_MONTHLY * 12;
const YEARLY_SAVE_PERCENT = Math.round(
    (1 - GROWTH_YEARLY / GROWTH_YEARLY_ORIGINAL) * 100,
);
const GROWTH_YEARLY_PER_MONTH = Math.round(GROWTH_YEARLY / 12);

/* ------------------------------------------------------------------ */
/* Copy (English + Bengali)                                            */
/* ------------------------------------------------------------------ */

const en = {
    nav: {
        features: 'Features',
        how: 'How it works',
        multi: 'Multi-tenant',
        pricing: 'Pricing',
        faq: 'FAQ',
        login: 'Log in',
        dashboard: 'Dashboard',
        startFree: 'Start for free',
    },
    hero: {
        badge: 'One Platform. Every School',
        titleA: 'Run your school smarter,',
        titleB: 'all in one place',
        sub: 'Manage students, teachers, courses, attendance, exams, fees, and report cards across every school on a single secure platform.',
        goDashboard: 'Go to dashboard',
        loginSchool: 'Log in to your school',
        note: 'No credit card required · Free for up to 200 students',
        imgAlt: 'Sehrix School dashboard',
    },
    stats: [
        { value: '200 students', label: 'free to start' },
        { value: 'Under 5 min', label: 'setup time' },
        { value: '1 click', label: 'Excel import' },
        { value: 'Isolated', label: 'data per school' },
    ],
    features: {
        title: 'Everything your school needs',
        sub: 'A complete toolkit for administrators, teachers, and staff to keep operations running smoothly.',
        items: [
            {
                title: 'Student Management',
                desc: 'Enroll, track, and manage students with photos, classes, roll numbers, and full academic history.',
            },
            {
                title: 'Teacher Management',
                desc: 'Manage teacher profiles, assignments, and subject allocations across every school.',
            },
            {
                title: 'Courses & Enrollment',
                desc: 'Create courses, manage sections, and handle student enrollments with ease.',
            },
            {
                title: 'Timetable & Attendance',
                desc: 'Build class timetables and record daily attendance with detailed reports.',
            },
            {
                title: 'Exams & Grading',
                desc: 'Schedule exams, enter marks, and apply customizable grading scales automatically.',
            },
            {
                title: 'Report Cards',
                desc: 'Generate and download professional student report cards in one click.',
            },
            {
                title: 'Fees & Invoicing',
                desc: 'Define fee structures, generate invoices, record payments, and track overdue balances.',
            },
            {
                title: 'Multi-Tenant Schools',
                desc: 'Run many schools on one platform with isolated data and role-based access.',
            },
        ],
    },
    report: {
        badge: 'Most popular module',
        title: 'Report cards, done in one click',
        desc: 'Enter marks once. Sehrix applies your grading scale, calculates results, and gives you print-ready PDF report cards for every student.',
        bullets: [
            'Customizable grading scales',
            'Class and section-wise generation',
            'Download as PDF',
        ],
        imgAlt: 'Report card preview',
    },
    how: {
        title: 'How it works',
        sub: 'Get your school up and running in three simple steps.',
        steps: [
            {
                title: 'Sign up',
                desc: 'Create your school admin account in under a minute.',
            },
            {
                title: 'Add your school',
                desc: 'Set up your school profile, classes, and staff.',
            },
            {
                title: 'Start managing',
                desc: 'Enroll students, track attendance, exams, and fees.',
            },
        ],
    },
    multi: {
        title: 'Built for multi-tenant operations',
        sub: 'Each school operates in its own isolated tenant with dedicated data, while super admins manage the whole platform from one dashboard.',
        bullets: [
            'Isolated student, teacher, and course data per school',
            'Role-based access for super admins and school admins',
            'Centralized tenant onboarding and management',
            'Consistent experience across all schools',
        ],
        cards: [
            {
                label: 'Secure & isolated',
                desc: 'Each school has its own isolated tenant.',
            },
            {
                label: 'Insightful dashboards',
                desc: 'Track students, fees, and attendance.',
            },
            {
                label: 'Exam & grading',
                desc: 'Marks, grading scales, report cards.',
            },
            {
                label: 'Fee collection',
                desc: 'Invoices, payments, overdue tracking.',
            },
        ],
    },
    pricing: {
        title: 'Simple, transparent pricing',
        sub: 'Choose the plan that fits your school. Upgrade anytime.',
        monthly: 'Monthly',
        yearly: 'Yearly',
        save: 'Save',
        popular: 'Most popular',
        perMonth: '/mo',
        billedYearly: 'billed yearly',
        free: 'Free',
        custom: 'Custom',
        periodFree: 'to start',
        periodMonth: '/month',
        periodYear: '/year',
        periodCustom: 'tailored plan',
        plans: [
            {
                name: 'Starter',
                desc: 'For small schools getting started.',
                features: [
                    'Up to 200 students',
                    'Core modules: students, attendance',
                    'Email support',
                    'Basic reports',
                ],
                cta: 'Start for free',
            },
            {
                name: 'Growth',
                desc: 'For growing schools that need more.',
                features: [
                    'Everything in Starter, plus:',
                    'Unlimited students',
                    'All modules',
                    'Priority support',
                    'Custom branding',
                ],
                cta: 'Start 14-day free trial',
            },
            {
                name: 'Enterprise',
                desc: 'For school groups and districts.',
                features: [
                    'Everything in Growth, plus:',
                    'Multi-campus',
                    'Dedicated support',
                    'SLA & SSO',
                    'Advanced analytics',
                ],
                cta: 'Contact us',
            },
        ],
        payments:
            'We support bKash, Nagad, and bank transfer for local payments.',
        terms: 'Cancel anytime · No hidden fees · Free migration from Excel',
        compareSummary: 'Compare plans & modules',
        compareLines: [
            ['Core modules:', 'students, attendance, basic reports.'],
            [
                'All modules:',
                'courses, exams, fees, invoices, report cards, timetable.',
            ],
            ['Enterprise adds:', 'multi-campus, SSO, SLA, advanced analytics.'],
        ],
    },
    compare: {
        title: 'Excel vs Sehrix School',
        sub: 'See why schools move away from spreadsheets.',
        head: ['Feature', 'Excel', 'Sehrix'],
        rows: [
            ['Student records', 'Manual rows', 'Centralized profiles'],
            ['Attendance', 'Manual entry', 'One-click + reports'],
            ['Fees & invoices', 'Formulas & errors', 'Automated invoicing'],
            ['Report cards', 'Manual formatting', 'One-click PDF'],
            ['Multi-school', 'Separate files', 'One platform'],
        ],
    },
    faq: {
        title: 'Frequently asked questions',
        sub: 'Everything you need to know before getting started.',
        items: [
            {
                q: 'Is my school’s data secure?',
                a: 'Yes. Each school runs in its own isolated tenant with role-based access control and encrypted storage.',
            },
            {
                q: 'Can I migrate from Excel?',
                a: 'Yes. You can import students and other records from CSV/Excel files in a few clicks.',
            },
            {
                q: 'What kind of support is available?',
                a: 'Email support is included on all plans, with priority support on Growth and Enterprise.',
            },
            {
                q: 'Can I try it for free?',
                a: 'Yes. Starter is free for up to 200 students, with no credit card required.',
            },
            {
                q: 'Do you support Bengali?',
                a: 'Yes. The interface supports Bengali, with more languages planned.',
            },
            {
                q: 'What report card formats are available?',
                a: 'Downloadable PDF report cards with customizable grading scales.',
            },
        ],
    },
    cta: {
        title: 'Ready to transform your school?',
        sub: 'Get started today and bring students, teachers, and administration together on one platform.',
        open: 'Open dashboard',
        create: 'Create an account',
        login: 'Log in',
    },
};

const bn: typeof en = {
    nav: {
        features: 'ফিচার',
        how: 'কীভাবে কাজ করে',
        multi: 'মাল্টি-টেন্যান্ট',
        pricing: 'মূল্য',
        faq: 'প্রশ্নোত্তর',
        login: 'লগ ইন',
        dashboard: 'ড্যাশবোর্ড',
        startFree: 'বিনামূল্যে শুরু করুন',
    },
    hero: {
        badge: 'একটি প্ল্যাটফর্ম। প্রতিটি স্কুল',
        titleA: 'আপনার স্কুল চালান আরও স্মার্টভাবে,',
        titleB: 'সবকিছু এক জায়গায়',
        sub: 'একটি নিরাপদ প্ল্যাটফর্মে সব স্কুলের শিক্ষার্থী, শিক্ষক, কোর্স, উপস্থিতি, পরীক্ষা, ফি ও রিপোর্ট কার্ড পরিচালনা করুন।',
        goDashboard: 'ড্যাশবোর্ডে যান',
        loginSchool: 'আপনার স্কুলে লগ ইন করুন',
        note: 'ক্রেডিট কার্ড লাগবে না · ২০০ জন শিক্ষার্থী পর্যন্ত বিনামূল্যে',
        imgAlt: 'সেহরিক্স স্কুল ড্যাশবোর্ড',
    },
    stats: [
        { value: '২০০ জন শিক্ষার্থী', label: 'বিনামূল্যে শুরু' },
        { value: '৫ মিনিটের কম', label: 'সেটআপ সময়' },
        { value: '১ ক্লিকে', label: 'এক্সেল ইমপোর্ট' },
        { value: 'আলাদা', label: 'প্রতি স্কুলের ডেটা' },
    ],
    features: {
        title: 'আপনার স্কুলের যা যা দরকার',
        sub: 'প্রশাসক, শিক্ষক ও কর্মীদের জন্য সম্পূর্ণ টুলকিট, যাতে সব কাজ সহজে চলে।',
        items: [
            {
                title: 'শিক্ষার্থী ব্যবস্থাপনা',
                desc: 'ছবি, শ্রেণি, রোল নম্বর ও পূর্ণ একাডেমিক ইতিহাসসহ শিক্ষার্থী ভর্তি, ট্র্যাক ও পরিচালনা করুন।',
            },
            {
                title: 'শিক্ষক ব্যবস্থাপনা',
                desc: 'প্রতিটি স্কুলের শিক্ষকের প্রোফাইল, দায়িত্ব ও বিষয় বণ্টন পরিচালনা করুন।',
            },
            {
                title: 'কোর্স ও ভর্তি',
                desc: 'কোর্স তৈরি করুন, সেকশন পরিচালনা করুন এবং সহজে শিক্ষার্থী ভর্তি সম্পন্ন করুন।',
            },
            {
                title: 'রুটিন ও উপস্থিতি',
                desc: 'ক্লাস রুটিন তৈরি করুন এবং বিস্তারিত রিপোর্টসহ দৈনিক উপস্থিতি নিন।',
            },
            {
                title: 'পরীক্ষা ও গ্রেডিং',
                desc: 'পরীক্ষার সময়সূচি দিন, নম্বর তুলুন এবং কাস্টমাইজযোগ্য গ্রেডিং স্কেল স্বয়ংক্রিয়ভাবে প্রয়োগ করুন।',
            },
            {
                title: 'রিপোর্ট কার্ড',
                desc: 'এক ক্লিকে পেশাদার মানের রিপোর্ট কার্ড তৈরি ও ডাউনলোড করুন।',
            },
            {
                title: 'ফি ও ইনভয়েস',
                desc: 'ফি কাঠামো ঠিক করুন, ইনভয়েস তৈরি করুন, পেমেন্ট নিন এবং বকেয়া ট্র্যাক করুন।',
            },
            {
                title: 'মাল্টি-টেন্যান্ট স্কুল',
                desc: 'আলাদা ডেটা ও রোলভিত্তিক অ্যাক্সেসসহ একটি প্ল্যাটফর্মে অনেক স্কুল চালান।',
            },
        ],
    },
    report: {
        badge: 'সবচেয়ে জনপ্রিয় মডিউল',
        title: 'এক ক্লিকেই রিপোর্ট কার্ড তৈরি',
        desc: 'একবার নম্বর দিন। সেহরিক্স আপনার গ্রেডিং স্কেল প্রয়োগ করে ফলাফল গণনা করবে এবং প্রতিটি শিক্ষার্থীর জন্য প্রিন্ট-উপযোগী পিডিএফ রিপোর্ট কার্ড দেবে।',
        bullets: [
            'কাস্টমাইজযোগ্য গ্রেডিং স্কেল',
            'শ্রেণি ও সেকশন অনুযায়ী তৈরি',
            'পিডিএফ হিসেবে ডাউনলোড',
        ],
        imgAlt: 'রিপোর্ট কার্ডের প্রিভিউ',
    },
    how: {
        title: 'কীভাবে কাজ করে',
        sub: 'তিনটি সহজ ধাপে আপনার স্কুল চালু করুন।',
        steps: [
            {
                title: 'সাইন আপ করুন',
                desc: 'এক মিনিটের কমে আপনার স্কুল অ্যাডমিন অ্যাকাউন্ট খুলুন।',
            },
            {
                title: 'স্কুল যোগ করুন',
                desc: 'স্কুলের প্রোফাইল, শ্রেণি ও কর্মী সেট আপ করুন।',
            },
            {
                title: 'ব্যবস্থাপনা শুরু করুন',
                desc: 'শিক্ষার্থী ভর্তি করুন, উপস্থিতি, পরীক্ষা ও ফি ট্র্যাক করুন।',
            },
        ],
    },
    multi: {
        title: 'মাল্টি-টেন্যান্ট পরিচালনার জন্য তৈরি',
        sub: 'প্রতিটি স্কুল নিজস্ব আলাদা টেন্যান্টে নিজের ডেটা নিয়ে কাজ করে, আর সুপার অ্যাডমিন একটি ড্যাশবোর্ড থেকে পুরো প্ল্যাটফর্ম পরিচালনা করেন।',
        bullets: [
            'প্রতি স্কুলের শিক্ষার্থী, শিক্ষক ও কোর্সের ডেটা আলাদা',
            'সুপার অ্যাডমিন ও স্কুল অ্যাডমিনের জন্য রোলভিত্তিক অ্যাক্সেস',
            'কেন্দ্রীয়ভাবে টেন্যান্ট অনবোর্ডিং ও ব্যবস্থাপনা',
            'সব স্কুলে একই রকম অভিজ্ঞতা',
        ],
        cards: [
            {
                label: 'নিরাপদ ও আলাদা',
                desc: 'প্রতিটি স্কুলের নিজস্ব আলাদা টেন্যান্ট আছে।',
            },
            {
                label: 'তথ্যবহুল ড্যাশবোর্ড',
                desc: 'শিক্ষার্থী, ফি ও উপস্থিতি ট্র্যাক করুন।',
            },
            {
                label: 'পরীক্ষা ও গ্রেডিং',
                desc: 'নম্বর, গ্রেডিং স্কেল, রিপোর্ট কার্ড।',
            },
            { label: 'ফি সংগ্রহ', desc: 'ইনভয়েস, পেমেন্ট, বকেয়া ট্র্যাকিং।' },
        ],
    },
    pricing: {
        title: 'সহজ ও স্বচ্ছ মূল্য',
        sub: 'আপনার স্কুলের জন্য উপযুক্ত প্ল্যান বেছে নিন। যেকোনো সময় আপগ্রেড করুন।',
        monthly: 'মাসিক',
        yearly: 'বার্ষিক',
        save: 'সাশ্রয়',
        popular: 'সবচেয়ে জনপ্রিয়',
        perMonth: '/মাস',
        billedYearly: 'বছরে একবার পরিশোধ',
        free: 'বিনামূল্যে',
        custom: 'কাস্টম',
        periodFree: 'শুরু করতে',
        periodMonth: '/মাস',
        periodYear: '/বছর',
        periodCustom: 'আপনার জন্য সাজানো প্ল্যান',
        plans: [
            {
                name: 'স্টার্টার',
                desc: 'শুরু করা ছোট স্কুলের জন্য।',
                features: [
                    '২০০ জন শিক্ষার্থী পর্যন্ত',
                    'মূল মডিউল: শিক্ষার্থী, উপস্থিতি',
                    'ইমেইল সাপোর্ট',
                    'বেসিক রিপোর্ট',
                ],
                cta: 'বিনামূল্যে শুরু করুন',
            },
            {
                name: 'গ্রোথ',
                desc: 'বড় হতে থাকা স্কুলের জন্য, যাদের আরও কিছু দরকার।',
                features: [
                    'স্টার্টারের সবকিছু, সাথে:',
                    'সীমাহীন শিক্ষার্থী',
                    'সব মডিউল',
                    'অগ্রাধিকার সাপোর্ট',
                    'নিজস্ব ব্র্যান্ডিং',
                ],
                cta: '১৪ দিনের ফ্রি ট্রায়াল শুরু করুন',
            },
            {
                name: 'এন্টারপ্রাইজ',
                desc: 'স্কুল গ্রুপ ও জেলা-পর্যায়ের জন্য।',
                features: [
                    'গ্রোথের সবকিছু, সাথে:',
                    'একাধিক ক্যাম্পাস',
                    'ডেডিকেটেড সাপোর্ট',
                    'এসএলএ ও এসএসও',
                    'উন্নত অ্যানালিটিক্স',
                ],
                cta: 'যোগাযোগ করুন',
            },
        ],
        payments:
            'স্থানীয় পেমেন্টের জন্য আমরা বিকাশ, নগদ ও ব্যাংক ট্রান্সফার সমর্থন করি।',
        terms: 'যেকোনো সময় বাতিল · কোনো লুকানো চার্জ নেই · এক্সেল থেকে বিনামূল্যে মাইগ্রেশন',
        compareSummary: 'প্ল্যান ও মডিউল তুলনা করুন',
        compareLines: [
            ['মূল মডিউল:', 'শিক্ষার্থী, উপস্থিতি, বেসিক রিপোর্ট।'],
            ['সব মডিউল:', 'কোর্স, পরীক্ষা, ফি, ইনভয়েস, রিপোর্ট কার্ড, রুটিন।'],
            [
                'এন্টারপ্রাইজে অতিরিক্ত:',
                'একাধিক ক্যাম্পাস, এসএসও, এসএলএ, উন্নত অ্যানালিটিক্স।',
            ],
        ],
    },
    compare: {
        title: 'এক্সেল বনাম সেহরিক্স স্কুল',
        sub: 'দেখুন কেন স্কুলগুলো স্প্রেডশিট ছেড়ে সরে আসছে।',
        head: ['বিষয়', 'এক্সেল', 'সেহরিক্স'],
        rows: [
            ['শিক্ষার্থীর তথ্য', 'হাতে লেখা সারি', 'কেন্দ্রীয় প্রোফাইল'],
            ['উপস্থিতি', 'হাতে এন্ট্রি', 'এক ক্লিক + রিপোর্ট'],
            ['ফি ও ইনভয়েস', 'ফর্মুলা ও ভুল', 'স্বয়ংক্রিয় ইনভয়েস'],
            ['রিপোর্ট কার্ড', 'হাতে ফরম্যাটিং', 'এক ক্লিকে পিডিএফ'],
            ['একাধিক স্কুল', 'আলাদা ফাইল', 'একটি প্ল্যাটফর্ম'],
        ],
    },
    faq: {
        title: 'সচরাচর জিজ্ঞাসা',
        sub: 'শুরু করার আগে যা যা জানা দরকার।',
        items: [
            {
                q: 'আমার স্কুলের ডেটা কি নিরাপদ?',
                a: 'হ্যাঁ। প্রতিটি স্কুল নিজস্ব আলাদা টেন্যান্টে চলে, সাথে আছে রোলভিত্তিক অ্যাক্সেস নিয়ন্ত্রণ ও এনক্রিপ্টেড স্টোরেজ।',
            },
            {
                q: 'এক্সেল থেকে কি মাইগ্রেট করা যায়?',
                a: 'হ্যাঁ। কয়েক ক্লিকেই সিএসভি/এক্সেল ফাইল থেকে শিক্ষার্থী ও অন্যান্য তথ্য ইমপোর্ট করতে পারবেন।',
            },
            {
                q: 'কী ধরনের সাপোর্ট পাওয়া যায়?',
                a: 'সব প্ল্যানে ইমেইল সাপোর্ট আছে, গ্রোথ ও এন্টারপ্রাইজে আছে অগ্রাধিকার সাপোর্ট।',
            },
            {
                q: 'বিনামূল্যে ব্যবহার করে দেখা যাবে?',
                a: 'হ্যাঁ। স্টার্টার প্ল্যান ২০০ জন শিক্ষার্থী পর্যন্ত বিনামূল্যে, ক্রেডিট কার্ড লাগবে না।',
            },
            {
                q: 'আপনারা কি বাংলা সমর্থন করেন?',
                a: 'হ্যাঁ। ইন্টারফেস বাংলা সমর্থন করে, আরও ভাষা যুক্ত করার পরিকল্পনা আছে।',
            },
            {
                q: 'রিপোর্ট কার্ড কোন ফরম্যাটে পাওয়া যায়?',
                a: 'কাস্টমাইজযোগ্য গ্রেডিং স্কেলসহ ডাউনলোডযোগ্য পিডিএফ রিপোর্ট কার্ড।',
            },
        ],
    },
    cta: {
        title: 'আপনার স্কুলকে বদলে দিতে প্রস্তুত?',
        sub: 'আজই শুরু করুন এবং শিক্ষার্থী, শিক্ষক ও প্রশাসনকে এক প্ল্যাটফর্মে নিয়ে আসুন।',
        open: 'ড্যাশবোর্ড খুলুন',
        create: 'অ্যাকাউন্ট খুলুন',
        login: 'লগ ইন',
    },
};

const copy: Record<Lang, typeof en> = { en, bn };

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props as {
        auth: { user: { name?: string } | null };
    };

    const [mobileOpen, setMobileOpen] = useState(false);
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
    const [lang, setLang] = useState<Lang>('en');

    const t = copy[lang];
    const fmt = (n: number) =>
        n.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US');

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    const toggleLang = () => setLang((l) => (l === 'en' ? 'bn' : 'en'));

    const navLinks = [
        { label: t.nav.features, href: '#features' },
        { label: t.nav.how, href: '#how-it-works' },
        { label: t.nav.multi, href: '#multi-tenant' },
        { label: t.nav.pricing, href: '#pricing' },
        { label: t.nav.faq, href: '#faq' },
    ];

    const linkHover =
        'text-muted-foreground transition-colors hover:text-accent';

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div
                className={`min-h-screen bg-background text-foreground ${lang === 'bn' ? 'leading-relaxed' : ''}`}
                style={lang === 'bn' ? { fontFamily: BENGALI_FONT } : undefined}
            >
                {/* Navbar */}
                <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center">
                            <AppLogoIcon className="h-8 w-auto sm:h-12" />
                        </Link>

                        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className={linkHover}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>

                        <div className="hidden items-center gap-2 md:flex">
                            <button
                                type="button"
                                onClick={toggleLang}
                                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-accent"
                                aria-label="Toggle language"
                            >
                                <Globe className="size-4" />
                                {lang === 'en' ? 'বাং' : 'EN'}
                            </button>
                            {auth.user ? (
                                <Button asChild>
                                    <Link href={dashboard()}>
                                        {t.nav.dashboard}
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="ghost"
                                        asChild
                                        className="hover:bg-muted hover:text-foreground"
                                    >
                                        <Link href={login()}>
                                            {t.nav.login}
                                        </Link>
                                    </Button>
                                    {canRegister && (
                                        <Button
                                            asChild
                                            className="bg-accent text-accent-foreground hover:bg-accent/90"
                                        >
                                            <Link href={register()}>
                                                {t.nav.startFree}
                                                <ArrowRight className="size-4" />
                                            </Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>

                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
                            onClick={() => setMobileOpen((v) => !v)}
                            aria-label="Toggle menu"
                            aria-expanded={mobileOpen}
                        >
                            {mobileOpen ? (
                                <X className="size-5" />
                            ) : (
                                <Menu className="size-5" />
                            )}
                        </button>
                    </div>

                    {mobileOpen && (
                        <div className="border-t bg-background md:hidden">
                            <div className="space-y-1 px-4 py-3">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={toggleLang}
                                        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-accent"
                                    >
                                        <Globe className="size-4" />
                                        {lang === 'en' ? 'বাংলা' : 'English'}
                                    </button>
                                </div>
                                <div className="flex flex-col gap-2 pt-2">
                                    {auth.user ? (
                                        <Button asChild className="w-full">
                                            <Link href={dashboard()}>
                                                {t.nav.dashboard}
                                            </Link>
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                variant="outline"
                                                asChild
                                                className="w-full"
                                            >
                                                <Link href={login()}>
                                                    {t.nav.login}
                                                </Link>
                                            </Button>
                                            {canRegister && (
                                                <Button
                                                    asChild
                                                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                                                >
                                                    <Link href={register()}>
                                                        {t.nav.startFree}
                                                    </Link>
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                <main>
                    {/* Hero */}
                    <section className="relative overflow-hidden">
                        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent/10 via-background to-background" />
                        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_1.15fr] lg:gap-10 lg:px-8 lg:py-28">
                            {/* Text */}
                            <div className="text-center lg:text-left">
                                <Badge className="mb-6 gap-2 border-accent/30 bg-accent/15 px-4 py-1.5 text-sm font-semibold text-accent">
                                    <Star className="size-4 text-accent" />
                                    {t.hero.badge}
                                </Badge>
                                <h1 className="text-4xl leading-[1.15] font-bold tracking-tight text-balance sm:text-5xl xl:text-6xl">
                                    {t.hero.titleA}{' '}
                                    <span className="text-accent">
                                        {t.hero.titleB}
                                    </span>
                                </h1>
                                <p className="mt-6 text-lg text-body sm:text-xl">
                                    {t.hero.sub}
                                </p>
                                <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                                    {auth.user ? (
                                        <Button size="lg" asChild>
                                            <Link href={dashboard()}>
                                                {t.hero.goDashboard}
                                                <ArrowRight className="size-4" />
                                            </Link>
                                        </Button>
                                    ) : (
                                        <>
                                            {canRegister && (
                                                <Button
                                                    size="lg"
                                                    asChild
                                                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                                                >
                                                    <Link href={register()}>
                                                        {t.nav.startFree}
                                                        <ArrowRight className="size-4" />
                                                    </Link>
                                                </Button>
                                            )}
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                asChild
                                                className="border-accent text-accent hover:bg-accent/10"
                                            >
                                                <Link href={login()}>
                                                    {t.hero.loginSchool}
                                                </Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                                <p className="mt-6 text-sm text-muted-foreground">
                                    {t.hero.note}
                                </p>
                            </div>

                            {/* Product visual */}
                            <div className="relative">
                                <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent/15 blur-3xl" />
                                <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl lg:-mr-24 xl:-mr-32">
                                    <div className="flex items-center gap-1.5 border-b bg-muted/60 px-4 py-3">
                                        <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                                        <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                                        <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                                    </div>
                                    <img
                                        src="/assets/sehrix-hero-image.png"
                                        alt={t.hero.imgAlt}
                                        width={1600}
                                        height={900}
                                        fetchPriority="high"
                                        className="h-auto w-full"
                                    />
                                </div>

                                {/* Floating chips (reuse existing stats copy) */}
                                <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-lg sm:-left-6">
                                    <div className="flex size-9 items-center justify-center rounded-full bg-accent/15 text-accent">
                                        <FileSpreadsheet className="size-5" />
                                    </div>
                                    <div className="leading-tight">
                                        <div className="text-sm font-bold text-primary">
                                            {t.stats[2].value}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {t.stats[2].label}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -top-5 right-4 hidden items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-lg sm:flex lg:right-8">
                                    <div className="flex size-9 items-center justify-center rounded-full bg-accent/15 text-accent">
                                        <Users className="size-5" />
                                    </div>
                                    <div className="leading-tight">
                                        <div className="text-sm font-bold text-primary">
                                            {t.stats[0].value}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {t.stats[0].label}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats */}
                    <section
                        id="stats"
                        className="scroll-mt-20 border-y bg-muted/40"
                    >
                        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                                {t.stats.map((stat, i) => {
                                    const Icon = statIcons[i];
                                    return (
                                        <div
                                            key={stat.label}
                                            className="flex flex-col items-center gap-2 text-center"
                                        >
                                            <div className="flex size-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                                                <Icon className="size-5" />
                                            </div>
                                            <div className="text-xl font-bold tracking-tight text-primary sm:text-2xl">
                                                {stat.value}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {stat.label}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section
                        id="features"
                        className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8"
                    >
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                {t.features.title}
                            </h2>
                            <p className="mt-4 text-lg text-body">
                                {t.features.sub}
                            </p>
                        </div>
                        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {t.features.items.map((feature, i) => {
                                const Icon = featureIcons[i];
                                return (
                                    <Card
                                        key={feature.title}
                                        className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <CardHeader>
                                            <div className="flex size-12 items-center justify-center rounded-xl bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                                                <Icon className="size-6" />
                                            </div>
                                            <h3 className="mt-4 text-lg font-semibold">
                                                {feature.title}
                                            </h3>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-base text-body">
                                                {feature.desc}
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </section>

                    {/* Report card spotlight */}
                    <section className="bg-muted/40">
                        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
                            <div>
                                <Badge className="mb-4 gap-2 border-accent/30 bg-accent/15 text-accent">
                                    <CheckCircle2 className="size-4" />
                                    {t.report.badge}
                                </Badge>
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    {t.report.title}
                                </h2>
                                <p className="mt-4 text-lg text-body">
                                    {t.report.desc}
                                </p>
                                <ul className="mt-6 space-y-3">
                                    {t.report.bullets.map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-start gap-3"
                                        >
                                            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                                            <span className="text-body">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="overflow-hidden rounded-2xl">
                                {/* Replace with a real report card screenshot */}
                                <img
                                    src="/assets/sehrix-report-card.png"
                                    alt={t.report.imgAlt}
                                    loading="lazy"
                                    className="h-auto w-full"
                                />
                            </div>
                        </div>
                    </section>

                    {/* How it works */}
                    <section
                        id="how-it-works"
                        className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8"
                    >
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                {t.how.title}
                            </h2>
                            <p className="mt-4 text-lg text-body">
                                {t.how.sub}
                            </p>
                        </div>
                        <div className="relative mt-14 grid gap-6 md:grid-cols-3">
                            <div className="absolute top-8 right-[16.67%] left-[16.67%] hidden h-1 bg-accent/60 md:block" />
                            {t.how.steps.map((step, i) => (
                                <Card
                                    key={step.title}
                                    className="group relative transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <CardHeader>
                                        <div className="relative z-10 flex size-14 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-foreground shadow-md transition-transform group-hover:scale-110">
                                            {fmt(0)}
                                            {fmt(i + 1)}
                                        </div>
                                        <h3 className="mt-4 text-xl font-semibold">
                                            {step.title}
                                        </h3>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-base text-body">
                                            {step.desc}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Multi-tenant */}
                    <section
                        id="multi-tenant"
                        className="scroll-mt-20 bg-muted/40"
                    >
                        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                        {t.multi.title}
                                    </h2>
                                    <p className="mt-4 text-lg text-body">
                                        {t.multi.sub}
                                    </p>
                                    <ul className="mt-8 space-y-3">
                                        {t.multi.bullets.map((item) => (
                                            <li
                                                key={item}
                                                className="flex items-start gap-3"
                                            >
                                                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                                                <span className="text-body">
                                                    {item}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {t.multi.cards.map(({ label, desc }, i) => {
                                        const Icon = multiIcons[i];
                                        return (
                                            <Card
                                                key={label}
                                                className="flex flex-col items-center justify-center p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                            >
                                                <Icon className="size-8 text-accent" />
                                                <p className="mt-3 text-sm font-medium text-body">
                                                    {label}
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {desc}
                                                </p>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pricing */}
                    <section
                        id="pricing"
                        className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8"
                    >
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                {t.pricing.title}
                            </h2>
                            <p className="mt-4 text-lg text-body">
                                {t.pricing.sub}
                            </p>
                        </div>
                        <div className="mx-auto mt-8 flex w-fit items-center justify-center rounded-full border bg-muted p-1">
                            {(['monthly', 'yearly'] as const).map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setBilling(mode)}
                                    aria-pressed={billing === mode}
                                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                                        billing === mode
                                            ? 'bg-accent text-accent-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {mode === 'monthly'
                                        ? t.pricing.monthly
                                        : t.pricing.yearly}
                                    {mode === 'yearly' && (
                                        <span className="ml-1.5 rounded-full bg-accent/20 px-1.5 py-0.5 text-xs text-accent">
                                            {t.pricing.save}{' '}
                                            {fmt(YEARLY_SAVE_PERCENT)}%
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 grid gap-6 pt-4 md:grid-cols-3">
                            {t.pricing.plans.map((plan, i) => {
                                const highlight = i === 1;
                                const isFree = i === 0;
                                const isCustom = i === 2;
                                const price = isFree
                                    ? t.pricing.free
                                    : isCustom
                                      ? t.pricing.custom
                                      : fmt(
                                            billing === 'monthly'
                                                ? GROWTH_MONTHLY
                                                : GROWTH_YEARLY,
                                        );
                                const period = isFree
                                    ? t.pricing.periodFree
                                    : isCustom
                                      ? t.pricing.periodCustom
                                      : billing === 'monthly'
                                        ? t.pricing.periodMonth
                                        : t.pricing.periodYear;

                                return (
                                    <Card
                                        key={plan.name}
                                        className={`relative flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                                            highlight
                                                ? 'z-10 border-2 border-accent bg-accent/5 shadow-lg shadow-accent/20 lg:scale-105'
                                                : ''
                                        }`}
                                    >
                                        {highlight && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1.5 text-sm font-semibold whitespace-nowrap text-accent-foreground">
                                                {t.pricing.popular}
                                            </div>
                                        )}
                                        <CardHeader>
                                            <h3 className="text-xl font-semibold">
                                                {plan.name}
                                            </h3>
                                            <div className="mt-2 flex items-baseline gap-1">
                                                {highlight && (
                                                    <span className="mr-1 align-top text-2xl leading-none font-bold text-primary">
                                                        ৳
                                                    </span>
                                                )}
                                                <span className="text-4xl leading-none font-bold text-primary">
                                                    {price}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {period}
                                                </span>
                                            </div>
                                            {highlight &&
                                                billing === 'yearly' && (
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        <span className="line-through">
                                                            ৳
                                                            {fmt(
                                                                GROWTH_YEARLY_ORIGINAL,
                                                            )}
                                                        </span>{' '}
                                                        {t.pricing.billedYearly}{' '}
                                                        · ৳
                                                        {fmt(
                                                            GROWTH_YEARLY_PER_MONTH,
                                                        )}
                                                        {t.pricing.perMonth}
                                                    </p>
                                                )}
                                            <p className="mt-2 text-base text-body">
                                                {plan.desc}
                                            </p>
                                        </CardHeader>
                                        <CardContent className="flex flex-1 flex-col">
                                            <ul className="mb-4 space-y-2 text-base">
                                                {plan.features.map(
                                                    (feature) => (
                                                        <li
                                                            key={feature}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                                                                <Check className="size-3.5" />
                                                            </span>
                                                            <span className="text-body">
                                                                {feature}
                                                            </span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                            <Button
                                                size="lg"
                                                asChild
                                                variant={
                                                    highlight
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                className={`mt-auto w-full ${
                                                    highlight
                                                        ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                                                        : 'border-accent text-accent hover:bg-accent/10'
                                                }`}
                                            >
                                                {isCustom ? (
                                                    <a href={CONTACT_HREF}>
                                                        {plan.cta}
                                                    </a>
                                                ) : (
                                                    <Link href={register()}>
                                                        {plan.cta}
                                                    </Link>
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        <p className="mt-8 text-center text-sm text-muted-foreground">
                            {t.pricing.payments}
                        </p>
                        <p className="mt-4 text-center text-sm text-muted-foreground">
                            {t.pricing.terms}
                        </p>

                        <details className="mx-auto mt-6 max-w-2xl rounded-xl border bg-card p-4 text-sm">
                            <summary className="cursor-pointer font-medium text-foreground">
                                {t.pricing.compareSummary}
                            </summary>
                            <div className="mt-3 space-y-1 text-muted-foreground">
                                {t.pricing.compareLines.map(([label, text]) => (
                                    <p key={label}>
                                        <strong>{label}</strong> {text}
                                    </p>
                                ))}
                            </div>
                        </details>
                    </section>

                    {/* Comparison */}
                    <section className="bg-muted/40">
                        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    {t.compare.title}
                                </h2>
                                <p className="mt-4 text-lg text-body">
                                    {t.compare.sub}
                                </p>
                            </div>
                            <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border bg-card">
                                <div className="grid grid-cols-3 border-b bg-muted/50 text-sm font-semibold">
                                    <div className="px-4 py-3">
                                        {t.compare.head[0]}
                                    </div>
                                    <div className="px-4 py-3 text-center">
                                        {t.compare.head[1]}
                                    </div>
                                    <div className="px-4 py-3 text-center text-accent">
                                        {t.compare.head[2]}
                                    </div>
                                </div>
                                {t.compare.rows.map(
                                    ([feature, excel, sehrix]) => (
                                        <div
                                            key={feature}
                                            className="grid grid-cols-3 border-b text-sm last:border-0"
                                        >
                                            <div className="px-4 py-3 font-medium">
                                                {feature}
                                            </div>
                                            <div className="px-4 py-3 text-center text-muted-foreground">
                                                {excel}
                                            </div>
                                            <div className="px-4 py-3 text-center text-body">
                                                {sehrix}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section
                        id="faq"
                        className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8"
                    >
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                {t.faq.title}
                            </h2>
                            <p className="mt-4 text-lg text-body">
                                {t.faq.sub}
                            </p>
                        </div>
                        <div className="mx-auto mt-12 max-w-3xl space-y-3">
                            {t.faq.items.map((item, index) => (
                                <details
                                    key={item.q}
                                    {...(index === 0 ? { open: true } : {})}
                                    className="group rounded-xl border bg-card p-5 transition-colors open:border-accent/40"
                                >
                                    <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-foreground">
                                        {item.q}
                                        <span className="text-2xl text-accent transition-transform group-open:rotate-45">
                                            +
                                        </span>
                                    </summary>
                                    <p className="mt-3 text-base text-body">
                                        {item.a}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                        <div className="overflow-hidden rounded-2xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                {t.cta.title}
                            </h2>
                            <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
                                {t.cta.sub}
                            </p>
                            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                {auth.user ? (
                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        asChild
                                    >
                                        <Link href={dashboard()}>
                                            {t.cta.open}
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        {canRegister && (
                                            <Button
                                                size="lg"
                                                asChild
                                                className="bg-accent text-accent-foreground hover:bg-accent/90"
                                            >
                                                <Link href={register()}>
                                                    {t.cta.create}
                                                    <ArrowRight className="size-4" />
                                                </Link>
                                            </Button>
                                        )}
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            asChild
                                            className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                                        >
                                            <Link href={login()}>
                                                {t.cta.login}
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>
                </main>

                <SiteFooter />
            </div>
        </>
    );
}
