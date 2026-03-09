import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-50 pt-6 sm:justify-center sm:pt-0">
            <div className="flex flex-col items-center justify-center mb-16 group cursor-pointer">
                    <img
                        src="/img/logo-korum.png"
                        alt="Korum Logo"
                        className="h-[120px] w-auto object-contain"
                    />
                </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
