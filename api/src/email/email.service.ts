import { Injectable } from "@nestjs/common";
import { SentMessageInfo } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import setupTransporter from "./utils/email.transporter";
import { smtpSettings } from "settings";
import { User } from "user/user.entity";
import { registrationTemplate } from "./templates/email.welcome.template";
import { passworRecoveryTemplate } from "./templates/email.recover.password.template";


@Injectable()
export class EmailService {
    constructor() {
    }
    private readonly defaultSender = smtpSettings.AUTH_USER;
    private transporter = setupTransporter();

    async send(mailOptions: Mail.Options): Promise<SentMessageInfo> {
        return this.transporter.sendMail(mailOptions);
    }
    /**
     * Envía correo de aviso de alta de usuario en el sistema.
     * @param user Usuario creado
     */
    async sendUserRegistration(user: User): Promise<SentMessageInfo> {
        return this.send({
            to: user.email,
            from: this.defaultSender,
            subject: "Bienvenido a " + "APP_NAME",
            html: registrationTemplate(user)
        })
    }
    /**
     *  Envia correo con el reset key al usuario que lo solicita
     * @param user 
     * @param resetKey 
     * @returns 
     */
    async sendPasswordRecovery(user: User, resetKey: number): Promise<SentMessageInfo> {
        return this.send({
            to: user.email,
            from: this.defaultSender,
            subject: "Recupere su contraseña en " + "APP_NAMW",
            html: passworRecoveryTemplate(user, resetKey)
        })
    }
}

