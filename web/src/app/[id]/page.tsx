process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import getMatch from "@/services/get-match";
import JoinMatch from "@/components/join-match";

export async function generateMetadata({ params }: { params: { id: string } }) {
    try {
        // if i don't put an await here, the console will throw a warning
        const p = await params;
        const match = await getMatch(p.id);

        return {
            title: match.name,
            description: match.location.address,
            url: 'codice.dev',
            openGraph: {
                images: [
                    {
                        url: 'https://dreamy-souffle-80d9a2.netlify.app//soccer-field.jpg',
                        width: 713,
                        height: 1000,
                        alt: match.name
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
    return <JoinMatch  />
}
