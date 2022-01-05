import nodemailer from 'nodemailer';

const sendMail = async (options) => {
  //create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  //define email options
  const mailOptions = {
    from: 'learn.softwaredev@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.text,
    //   html: '<p> basic html </p>'
  };

  //send email
  await transporter.sendMail(mailOptions);
};
export default sendMail;
