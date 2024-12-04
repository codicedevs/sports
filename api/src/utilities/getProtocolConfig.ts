import * as fs from "fs";
/**
 * Obtiene la configuración del protocolo del servidor, http o https según si encuentra los certificados o no.
 * @returns Devuelve los parámetros para la configuración del protocolo
 */
export function getProtocolConfig() {
    let key: string | Buffer = "";
    let cert: string | Buffer = "";
    let protocol: "http" | "https" | undefined;
    if (process.env.SSL_PRIVATE_KEY && process.env.SSL_CERT)
        try {
            key = fs.readFileSync(process.env.SSL_PRIVATE_KEY);
            cert = fs.readFileSync(process.env.SSL_CERT);
            protocol = "https";
        } catch (error) {
            protocol = undefined;
            console.error(error);
        }
    if (!protocol) {
        key = "";
        cert = "";
        protocol = "http";
    }
    return { key, cert, protocol };
}