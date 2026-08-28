import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    const { flash } = usePage<{ flash?: any }>().props;

    useEffect(() => {
        if (flash?.type && flash?.message) {
            toast[flash.type](flash.message, {
                id: flash.message,
                duration: 1000,
            });
        } else if (flash?.toast?.type && flash?.toast?.message) {
            const toastType = flash.toast.type as 'success' | 'info' | 'warning' | 'error';
            toast[toastType](flash.toast.message, {
                id: flash.toast.message,
                duration: 1000,
            });
        }
    }, [flash]);
}
