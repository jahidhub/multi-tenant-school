import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { tenant } = usePage<any>().props;

    if (tenant?.logo_path) {
        return (
            <img
                src={tenant.logo_path}
                alt={tenant.institute_name}
                className="h-11 w-auto object-contain"
            />
        );
    }

    return <AppLogoIcon className="h-11 w-auto" />;
}
