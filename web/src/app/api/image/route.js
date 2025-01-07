import sharp from 'sharp';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const users = searchParams.get('users') || 'Default Users';

    // Aquí podrías generar la imagen, en este caso con texto
    const svg = `
        <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
            <rect width="1200" height="630" fill="green"/>
            <text x="50%" y="50%" font-size="60" fill="white" text-anchor="middle" dominant-baseline="middle">
                ${users}
            </text>
        </svg>
    `;

    const imageBuffer = await sharp(Buffer.from(svg))
        .jpeg({ quality: 80 })
        .toBuffer();

    return new Response(imageBuffer, {
        headers: {
            'Content-Type': 'image/jpeg',
        },
    });
}
