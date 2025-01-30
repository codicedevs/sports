import { Match } from "@/types";

async function getMatch(id: string): Promise<Match> {
    const res = await fetch(`https://codice.dev:3000/matches/${id}`, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    })

    if (!res.ok) {
        const response = await res.json()
        throw new Error(JSON.stringify(response))
    }
    return await res.json()    
}

export default getMatch