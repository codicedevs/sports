
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
        }
    }).then((res) => res.json())

    // const _parent = await parent
    
    return {
        title: match.name,
        description: match.location.address,
        authors: [{ name: match.name }, { name: 'Josh', url: 'https://codice.dev:3000' }],
        openGraph: {
            images: ['https://via.placeholder.com/600/92c952', '/sports.png'],
        },
    }
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
            {/* <main>
                {match ? (
                    <Fragment key={match._id}>
                        <h3 className="font-bold">Partido</h3>
                        <p>Nombre {match.name}</p>
                        <p>Fecha {match.date}</p>
                        <p>Hora {match.hour}</p>
                        <p>Lugar {match.location.name}</p>
                        <h3 className="font-bold">Jugadores</h3>
                        {match.users.map((player: User) => (
                            <div key={player._id}>
                                <p>{player.name}</p>
                            </div>
                        ))}
                    </Fragment>
                ) : (
                    <p>No users found.</p>
                )}
            </main> */}
        </div>
    );
}
