import { API_URL } from "@/config";

async function joinPlayerToMatch(matchId: string, userId: string): Promise<any> {    
    const res = await fetch(`${API_URL}/matches/${matchId}/users/${userId}/add`, {
        method: 'PATCH',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    })    

    if (!res.ok) {        
        const e = await res.json();
        throw new Error(e.message || JSON.stringify(e));
    }
    return await res.json()
}

export default joinPlayerToMatch