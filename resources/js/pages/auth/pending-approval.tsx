import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function PendingApproval() {
    return (
        <>
            <Head title="Awaiting Approval" />
            <div className="flex min-h-screen items-center justify-center bg-background p-6">
                <div className="max-w-md text-center">
                    <CheckCircle2 className="mx-auto size-12 text-accent" />
                    <h1 className="mt-4 text-2xl font-bold">Registration submitted</h1>
                    <p className="mt-2 text-muted-foreground">
                        Your account is awaiting approval by an administrator. You will be able to log in once your registration is approved.
                    </p>
                    <div className="mt-6">
                        <Button asChild>
                            <Link href="/login">Back to login</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
