async function googleSignIn(data: any): Promise<any> {
    const res = await fetch('https://codice.dev:3000/auth/google', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({data}),
    })

    if (!res.ok) {        
        throw new Error(await res.json())
    }
    return await res.json()
}

export default googleSignIn