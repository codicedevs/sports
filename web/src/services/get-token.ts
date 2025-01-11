import type { UserLogged } from "@/types";

async function getToken(): Promise<UserLogged> {
    const res = await fetch('https://codice.dev:3000/auth/signin', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            email: 'orefici.diego@gmail.com',
            password: '12345678'
        }),
    })

    if (!res.ok) {
        throw new Error(await res.json())
    }
    return await res.json()
}

export default getToken