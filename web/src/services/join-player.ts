async function joinPlayerToMatch(matchId: string, userId: string): Promise<any> {    
    const res = await fetch(`https://codice.dev:3000/matches/${matchId}/users/${userId}`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    })    

    if (!res.ok) {        
        throw new Error(await res.json())
    }
    return await res.json()
}

export default joinPlayerToMatch