import { API_URL } from "@/config";
import { Match } from "@/types";

async function getMatch(id: string): Promise<Match> {
    const res = await fetch(`${API_URL}/matches/${id}/petitions`, {
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