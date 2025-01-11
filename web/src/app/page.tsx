process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import getMatch from "@/services/get-match";
import Match from "@/components/match";
import JoinMatch from "@/components/join-match";

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzIwZWYwZTNhNzhlYmMxMDU2NGU5NzkiLCJ1c2VybmFtZSI6ImRpZWdvIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE3MzY2MDg5NzYsImV4cCI6MTczNjY5NTM3Nn0.duqcyIucnI741HYH-_oJuIZdJiNak82mrIpkNM4bv-s'

export async function generateMetadata() {
    try {
        const match = await getMatch(token);

        const userNames = match.users.map((user) => user.name).join(',');

        return {
            title: `${match.name} - ${match.location.address}`,
            description: `Jugadores del partido: ${userNames}`,
            url: 'codice.dev',
            openGraph: {
                images: [
                    {
                        url: 'https://dreamy-souffle-80d9a2.netlify.app//soccer-field.jpg',
                        width: 713,
                        height: 1000,
                        alt: `${match.name}`,
                    },
                ],
            },
        };
    } catch (e) {
        return {
            title: 'Partido no encontrado',
        }
    }
}


export default async function Page() {
    let match = null;

    try {
        const _match = await getMatch(token);
        match = _match;
        console.log(match);

    } catch (e) {
        console.error("Error al traer partido UI:", e);
    }

    if (!match) {
        return (
            <div className="grid place-items-center px-4 pt-4">
                <h1 className="text-2xl font-bold text-white">Partido no encontrado</h1>
                <p className="text-lg text-white">No se pudo encontrar el partido</p>
                <a
                    className="bg-[#0a2b1d] text-white p-2 mt-4 rounded uppercase text-sm"
                    href="/refresh-match"
                >
                    refrescar en cliente
                </a>
            </div>
        )
    }

    return (
        <>
            <Match match={match} />
            <JoinMatch match={match} token={token} />
        </>
    )
}
