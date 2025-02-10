const fs = require("fs");
const path = require("path");

// Ruta del directorio donde están los archivos que quieres modificar
const targetDirectory = path.join(__dirname, "src");

// Función para reemplazar `ObjectId` por `Types.ObjectId` y actualizar importaciones
function replaceObjectIdInFile(filePath) {
    let content = fs.readFileSync(filePath, "utf8");

    // Verifica si hay una importación de `ObjectId` desde `mongodb`
    if (content.includes(`ObjectId`)) {
        // Reemplaza `ObjectId` con `Types.ObjectId` en el código
        content = content.replace(/\bObjectId\b/g, "Types.ObjectId");

        // Actualiza las importaciones: elimina las de `mongodb` y agrega las de `mongoose`
        content = content.replace(
            /import\s*{[^}]*ObjectId[^}]*}\s*from\s*['"]mongodb['"];?/,
            "import { Types } from 'mongoose';"
        );

        // Escribe los cambios en el archivo
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`Modificado: ${filePath}`);
    }
}

// Función para procesar archivos en un directorio recursivamente
function processDirectory(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);

        if (fs.statSync(filePath).isDirectory()) {
            // Si es un directorio, procesa recursivamente
            processDirectory(filePath);
        } else if (filePath.endsWith(".ts") || filePath.endsWith(".js")) {
            // Si es un archivo `.ts` o `.js`, reemplaza `ObjectId`
            replaceObjectIdInFile(filePath);
        }
    }
}

// Ejecutar el script en el directorio objetivo
processDirectory(targetDirectory);

console.log("Reemplazo completado.");
