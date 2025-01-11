import { Match } from "@/types";

async function getMatch(token: string): Promise<Match> {
    const res = await fetch('https://codice.dev:3000/matches/6772c91a790633512b4bdbee', {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })

    if (!res.ok) {
        throw new Error(await res.json())
    }
    return await res.json()    
}

export default getMatch