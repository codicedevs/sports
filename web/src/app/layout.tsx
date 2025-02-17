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
                <div className="min-h-[100dvh] pb-14">
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
