async function joinPlayerToMatch(matchId: string, userId: string, token: string): Promise<any> {    
    const res = await fetch(`https://codice.dev:3000/matches/${matchId}/users/6720ef2e3a78ebc10564e983`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })    

    if (!res.ok) {        
        throw new Error(await res.json())
    }
    return await res.json()
}

export default joinPlayerToMatch