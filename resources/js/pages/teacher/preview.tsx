
import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { BookOpen, Eye, Phone, User } from 'lucide-react'
import { Link } from '@inertiajs/react'


type Teacher = {
    id: number;
    name: string;
    phone: string;
    subject: string;
}

type Props = {
    teacher: Teacher
}

export default function preview({ teacher }: Props) {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button  size="icon" aria-label="Preview">
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogDescription className="text-xl">
                        Teacher profile
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-5 border-t border-border pt-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                            <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="mb-0.5 text-lg text-muted-foreground">
                                Name
                            </p>
                            <p className="text-xl font-medium">
                                {teacher.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                            <Phone className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="mb-0.5 text-lg text-muted-foreground">
                                Phone
                            </p>
                            <p className="text-xl font-medium">
                                {teacher.phone}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                            <BookOpen className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="mb-0.5 text-lg text-muted-foreground">
                                Subject
                            </p>
                            <p className="text-xl font-medium">
                                {teacher.subject}
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-2">
                    <Link
                        href={`/edit/teacher/${teacher.id}`}
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                    >
                        Edit profile
                    </Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
