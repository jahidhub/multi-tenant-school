import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    const { flash } = usePage<{ flash?: FlashToast }>().props;

    useEffect(() => {
        if (flash?.type && flash?.message) {
            toast[flash.type](flash.message, {
                id: flash.message,
                duration: 1000,
            });
        }
    }, [flash]);
}
