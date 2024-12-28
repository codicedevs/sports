
import Image from "next/image";

export async function generateMetadata() {
    const user = await fetch('https://jsonplaceholder.typicode.com/users/1').then((res) => res.json())

    // const _parent = await parent

    return {
        title: user.title,
        description: user.address.street,
        authors: [{ name: user.username }, { name: 'Josh', url: 'https://nextjs.org' }],
        openGraph: {
            images: ['https://via.placeholder.com/600/92c952', '/sports.png'],
        },
    }
}

export default async function Page() {
    const res = await fetch('https://jsonplaceholder.typicode.com/users/1', {
        method: 'GET',
        cache: 'no-cache',
    });


    if (!res.ok) {
        return <div>Error</div>;
    }

    const user = await res.json();

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
            {user && (
                <>
                    {user.name}
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
