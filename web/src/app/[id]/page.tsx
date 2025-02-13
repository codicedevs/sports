process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import getMatch from "@/services/get-match";
import JoinMatch from "@/components/join-match";

type Params = Promise<{ id: string }>;

export async function generateMetadata(props: { params: Params }) {
    try {
        const { id } = await props.params;
        const match = await getMatch(id);

        return {
            title: match.name,
            description: match.location.address,
            url: 'codice.dev',
            openGraph: {
                images: [
                    {
                        url: 'https://dreamy-souffle-80d9a2.netlify.app/soccer-field.jpg',
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
    return <JoinMatch />
}
