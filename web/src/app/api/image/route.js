import sharp from 'sharp';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const users = searchParams.get('users')?.split(',') || [];

    // Ruta de la imagen base
    const fieldPath = join(process.cwd(), 'public', 'soccer-field.jpg');

    // Distribución vertical de los nombres
    const textOverlays = users.map((name, i) => ({
        text: name,
        top: 50 + i * 30, // Ajustar posición en base a `i`
        left: 100,        // Ajustar horizontalmente si es necesario
    }));

    // SVG con los nombres
    const svgText = `
        <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
          ${textOverlays.map(overlay => `
            <text x="${overlay.left}" y="${overlay.top}" font-size="24" fill="white">
              ${overlay.text}
            </text>
          `).join('')}
        </svg>
    `;

    const svgBuffer = Buffer.from(svgText);

    // Componer la imagen base con texto
    const buffer = await sharp(fieldPath)
        .composite([{ input: svgBuffer, top: 0, left: 0 }])
        .jpeg({ quality: 80 }) // Salida como JPG con calidad ajustable
        .toBuffer();

    return new NextResponse(buffer, {
        headers: { 'Content-Type': 'image/jpeg' }, // Actualiza el encabezado
    });
}
