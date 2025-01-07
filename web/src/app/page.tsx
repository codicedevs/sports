process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import Image from "next/image";

export async function generateMetadata() {
    const match = await fetch('https://codice.dev:3000/matches/6772c91a790633512b4bdbee', {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzIwZWYwZTNhNzhlYmMxMDU2NGU5NzkiLCJ1c2VybmFtZSI6ImRpZWdvIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE3MzYxNzgxNTUsImV4cCI6MTczNjI2NDU1NX0.oyCZhydg-68MWV6zOY3FNkfkNwGPT7jDgd2aUIxU4hE'
        },
    }).then(res => res.json());

    console.log(match);
    

    const userNames = match.users.map((user: any) => user.name).join(',');

    <meta property="og:image" content="https://tricota.com.ar/img/og.jpg"></meta>

    return {
        title: match.name,
        description: match.location.address,
        openGraph: {
            images: [`/api/image?users=${encodeURIComponent(userNames)}`],
        },
    };
}


export default async function Page() {
    const res = await fetch('https://codice.dev:3000/matches/6772c91a790633512b4bdbee', {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzIwZWYwZTNhNzhlYmMxMDU2NGU5NzkiLCJ1c2VybmFtZSI6ImRpZWdvIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE3MzYxNzgxNTUsImV4cCI6MTczNjI2NDU1NX0.oyCZhydg-68MWV6zOY3FNkfkNwGPT7jDgd2aUIxU4hE'
        }
    });

    if (!res.ok) {
        return <div>Error</div>;
    }

    const match = await res.json();

    return (
        <div className="p-4">
            <nav className="w-full flex justify-center items-center mb-4">
                <Image
                    src="/logo-sports.png"
                    alt="Sports"
                    width={80}
                    height={80}
                />
            </nav>
            {match && (
                <>
                    {match.name}
                </>
            )}
        </div>
    );
}

