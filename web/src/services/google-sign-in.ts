import { API_URL } from "@/config"

async function googleSignIn(data: any): Promise<any> {
    const res = await fetch(`${API_URL}/auth/google`, {
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