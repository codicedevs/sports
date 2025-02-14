import "./globals.css";
import "../../lib/sso";
import { ToastContainer } from 'react-toastify';
import { Noto_Sans } from 'next/font/google'

const noto = Noto_Sans({
    subsets: ['latin'],
    variable: '--font-noto'
})

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={noto.className}>
                <div className="h-[100dvh] bg-[#FEFFFA]">
                    <div className="grid place-items-center px-4 pt-8">
                        <span className="text-6xl rotate-180 animate-bounce">⚽</span>
                    </div>
                    <div className="max-w-[480px] mx-auto">
                        {children}
                    </div>
                </div>
                <ToastContainer
                    position="bottom-center"
                    autoClose={2000}
                />
            </body>
        </html>
    );
}
