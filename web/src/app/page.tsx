process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

interface User {
    name: string;
    email: string;
}

export async function generateMetadata() {
    const match = await fetch('https://codice.dev:3000/matches/6772c91a790633512b4bdbee', {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzIwZWYwZTNhNzhlYmMxMDU2NGU5NzkiLCJ1c2VybmFtZSI6ImRpZWdvIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE3MzYxNzgxNTUsImV4cCI6MTczNjI2NDU1NX0.oyCZhydg-68MWV6zOY3FNkfkNwGPT7jDgd2aUIxU4hE'
        },
    }).then(res => res.json());

    const userNames = match.users.map((user: User) => user.name).join(',');

    const imageUrl = `https://4159-181-199-145-53.ngrok-free.app/api/image?users=${encodeURIComponent(userNames)}`;

    return {
        title: match.name,
        description: match.location.address,
        openGraph: {
            images: [
                {
                    url: imageUrl, // URL de la imagen
                    width: 1200,  // Ancho recomendado por Open Graph
                    height: 630,  // Alto recomendado por Open Graph
                    alt: `Canchas de fútbol para el match ${match.name}`,
                },
            ],
        },
    };
}


export default function Page() {
    return <p>Sports</p>
}


