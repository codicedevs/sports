import { User } from "user/user.entity";


export const passworRecoveryTemplate = (user: User, resetKey: number) => (
    `
    <!DOCTYPE html>
    <html>

    <head>
      <title>Recuperá tu contraseña ${"APP_NAME"}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 1em;
          line-height: 1.5;
          color: #333;
        }

        h1 {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #444;
          margin-top: 0;
          margin-bottom: 10px;
        }

        p {
          margin-top: 0;
          margin-bottom: 1rem;
          text-align: justify;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
        }
      </style>
    </head>

    <body>
      <div class="container">
        <p>Estimado/a ${user.name},</p>
        <p>Le acercamos su clave temporal para que pueda ingresar nuevamente: ${resetKey}</p>
        <p>Gracias por su confianza en ${"APP_NAME"}. Esperamos que disfrute de nuestra plataforma.</p>
        <p>Atentamente,</p>
        <p>${"APP_NAME"}</p>
      </div>
    </body>

    </html>

    `
)