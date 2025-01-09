process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import Button from "@/components/button";
import { format } from "@formkit/tempo"
// import Image from "next/image"

export interface IUser {
    _id: string
    name: string
    email: string
    password: string
    friends: IUser[]
    roles: string[]
    matches: []
}

export async function generateMetadata() {
    const match = await fetch('https://codice.dev:3000/matches/6772c91a790633512b4bdbee', {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzIwZWYwZTNhNzhlYmMxMDU2NGU5NzkiLCJ1c2VybmFtZSI6ImRpZWdvIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE3MzY0MzE4NzgsImV4cCI6MTczNjUxODI3OH0.xZas74p0FwiMDpC26P1ukSltxMzF_qmC693TwRaCwAk'
        },
    }).then(res => res.json());

    const userNames = match.users.map((user: IUser) => user.name).join(',');

    return {
        title: `${match.name} - ${match.location.address}`,
        description: `Jugadores del partido: ${userNames}`,
        url: 'codice.dev',
        openGraph: {
            images: [
                {
                    url: 'https://3716-181-199-145-53.ngrok-free.app/soccer-field.jpg',
                    width: 713,  // Ancho recomendado por Open Graph
                    height: 1000,  // Alto recomendado por Open Graph
                    alt: `${match.name}`,
                },
            ],
        },
    };
}


export default async function Page() {
    const match = await fetch('https://codice.dev:3000/matches/6772c91a790633512b4bdbee', {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzIwZWYwZTNhNzhlYmMxMDU2NGU5NzkiLCJ1c2VybmFtZSI6ImRpZWdvIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE3MzY0MzE4NzgsImV4cCI6MTczNjUxODI3OH0.xZas74p0FwiMDpC26P1ukSltxMzF_qmC693TwRaCwAk'
        },
    }).then(res => res.json());

    return (
        <main>
            <div className="h-screen bg-[#115e2a]">
                {/* <div className="grid place-items-center px-4 pt-4">
                    <Image
                        src="/logo-sports.png"
                        alt="codice"
                        className="w-[100px]"
                        width={1000}
                        height={1000}
                    />
                </div> */}
                <div className="grid place-items-center px-4 pt-8">
                    <span className="text-6xl rotate-180 animate-bounce">⚽</span>
                </div>
                <div className="grid gap-4 p-4">
                    <div className="bg-[#0a2b1d] rounded-md p-2 w-full overflow-hidden flex flex-col gap-1">
                        <p title={match.name} className="text-sm text-white uppercase font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                            {match.name}
                        </p>
                        <p title={match.name} className="text-sm text-white whitespace-nowrap text-ellipsis overflow-hidden flex items-center gap-1">
                            <span className="text-xs">📍</span>
                            {match.location.address}
                            <span>
                                {format({
                                    date: new Date(match.date),
                                    format: "medium",
                                    locale: 'es'
                                })}
                            </span>
                        </p>
                        <hr className="my-1 border-[#D9D9D950]" />
                        <div>
                            <p className="text-sm text-white mb-1">Jugadores confirmados: {match.users.length} de {match.playersLimit}</p>
                            <ul className="list-disc list-inside">
                                {match.users.map((user: IUser) => (
                                    <li key={user._id} className="text-sm text-white pl-2 capitalize">{user.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <Button />
            </div>
        </main>
    )
}

