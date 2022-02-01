import nodemailer from 'nodemailer';
import { convert } from 'html-to-text';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import pug from 'pug';

export default class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = `${process.env.APP_NAME} <${process.env.EMAIL}>`;
  }
  //create a transporter
  newTransporter() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASS,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }
  async send(template, subject) {
    try {
      const __dirname = dirname(fileURLToPath(import.meta.url));

      const html = pug.renderFile(
        resolve(__dirname, `../Views/${template}.pug`),
        {
          firstName: this.firstName,
          url: this.url,
          subject,
        }
      );
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: convert(html),
      };
      await this.newTransporter().sendMail(mailOptions);
    } catch (err) {
      console.log(err);
    }
  }
  async resetPassword() {
    await this.send('resetPassword', 'Reset your password');
  }
}
