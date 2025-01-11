import "./globals.css";
import "../../lib/sso";
import { ToastContainer } from 'react-toastify';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <div className="h-screen bg-[#115e2a]">
                    <div className="grid place-items-center px-4 pt-8">
                        <span className="text-6xl rotate-180 animate-bounce">⚽</span>
                    </div>
                    {children}
                </div>
                <ToastContainer 
                    position="bottom-center"
                    autoClose={2000}
                />
            </body>
        </html>
    );
}
