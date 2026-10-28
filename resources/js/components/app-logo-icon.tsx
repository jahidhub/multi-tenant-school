import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/sehrix-logo.svg"
            alt="Logo"
            {...props}
        />
    );
}