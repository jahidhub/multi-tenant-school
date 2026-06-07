
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
import { BookOpen, User } from 'lucide-react'
import { Link } from '@inertiajs/react'


type Teacher = {
    id: number;
    first_name: string;
    last_name: string;
    subject: string;
}

type Props = {
    teacher: Teacher
}

export default function preview({ teacher }: Props) {

    return (
        <Dialog>

            <DialogTrigger asChild>
                <span className='w-100'>Preview</span>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogDescription className="text-xl">Teacher profile</DialogDescription>
                </DialogHeader>

                <div className="border-t border-border pt-4 flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-lg text-muted-foreground mb-0.5">Name</p>
                            <p className="text-xl font-medium">{teacher.first_name}  {teacher.last_name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-lg text-muted-foreground mb-0.5">Subject</p>
                            <p className="text-xl font-medium">{teacher.subject}</p>
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
    )
}
