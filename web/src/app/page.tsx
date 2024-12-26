process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import Image from "next/image";

export default async function Home() {
    // Fetch los datos directamente en el componente (SSR)
    const res = await fetch('https://codice.dev:3000/matches', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzIwZWYwZTNhNzhlYmMxMDU2NGU5NzkiLCJ1c2VybmFtZSI6ImRpZWdvIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE3MzUyMTc4NjksImV4cCI6MTczNTMwNDI2OX0.qIOcfwrb4Iulm1vKPdAQwCYOtX7vuyfVo5gSXYL9RSI'
        },
        cache: 'no-store', // Para garantizar datos frescos en cada solicitud
    });
    
    console.log(res);

    if (!res.ok) {
        // Manejo de error
        return (
            <div>
                <h1>Error loading matches</h1>
                <p>Please try again later.</p>
            </div>
        );
    }

    // Convertir la respuesta en JSON
    const match = await res.json();

    return (
        <>
            <nav className="w-full flex justify-center items-center">
                <Image
                    src="/logo-sports.png"
                    alt="Sports"
                    width={80}
                    height={80}
                />
            </nav>
            <main>
                <h1 className="text-2xl font-bold mb-4">Matches</h1>
                <ul>
                    {match?.users?.length > 0 ? (
                        match.users.map((user: any) => (
                            <li key={user._id} className="p-2 border-b">
                                {user.name}
                            </li>
                        ))
                    ) : (
                        <p>No matches found.</p>
                    )}
                </ul>
            </main>
        </>
    );
}
