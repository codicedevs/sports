import sharp from 'sharp';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const users = searchParams.get('users') || 'Default Users'; // Asegúrate de que `users` esté definido correctamente

    try {
        // Cargar la imagen de fondo sin redimensionarla para mantener la calidad
        const backgroundBuffer = await sharp('./public/soccer-field.jpg').toBuffer();

        // Crear un SVG con el texto
        const svg = `
            <svg width="713" height="1000" xmlns="http://www.w3.org/2000/svg">
                <rect width="713" height="1000" fill="transparent"/>
                <text x="50%" y="50%" font-size="60" fill="white" text-anchor="middle" dominant-baseline="middle">
                    ${users}
                </text>
            </svg>
        `;

        // Convertir el SVG a buffer con sharp
        const svgBuffer = Buffer.from(svg);

        // Combinar la imagen de fondo con el SVG de texto
        const imageBuffer = await sharp(backgroundBuffer)
            .composite([
                {
                    input: svgBuffer,
                    gravity: 'center', // Coloca el texto en el centro
                },
            ])
            .jpeg({ quality: 100 }) // Mantener la calidad al máximo
            .toBuffer();

        // Devolver la imagen generada
        return new Response(imageBuffer, {
            headers: {
                'Content-Type': 'image/jpeg',
            },
        });

    } catch (error) {
        console.error('Error generando la imagen:', error);
        return new Response('Error generando la imagen', { status: 500 });
    }
}
