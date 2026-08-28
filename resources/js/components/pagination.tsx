import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

type LinkItem = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginationProps = {
    links: LinkItem[];
    className?: string;
};

export function Pagination({ links, className }: PaginationProps) {
    if (!links || links.length <= 3) return null;

    return (
        <nav
            role="navigation"
            aria-label="Pagination Navigation"
            className={cn("flex items-center justify-center gap-1 mt-6", className)}
        >
            {links.map((link, idx) => {
                const isPrevious = link.label.includes('Previous');
                const isNext = link.label.includes('Next');

                let label = link.label;
                if (isPrevious) {
                    label = '‹ Prev';
                } else if (isNext) {
                    label = 'Next ›';
                }

                if (!link.url) {
                    return (
                        <span
                            key={idx}
                            className={cn(
                                buttonVariants({ variant: "outline", size: "sm" }),
                                "pointer-events-none opacity-40 cursor-not-allowed"
                            )}
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                }

                return (
                    <Link
                        key={idx}
                        href={link.url}
                        className={cn(
                            buttonVariants({
                                variant: link.active ? "default" : "outline",
                                size: "sm",
                            }),
                            link.active ? "pointer-events-none" : ""
                        )}
                        dangerouslySetInnerHTML={{ __html: label }}
                    />
                );
            })}
        </nav>
    );
}
