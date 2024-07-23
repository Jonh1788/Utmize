
import { UtmizeFullLogo } from '@/Components/Svg/UtmizeFullLogo';
import { ThemeProvider } from '@/Components/ThemeContextProvider';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <ThemeProvider defaultTheme='dark'>
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-background">
            <div>
                <Link href="/">
                    <UtmizeFullLogo className={"size-64 -mb-14"}/>
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-card border border-border shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
        </ThemeProvider>
    );
}
