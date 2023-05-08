const nodemailer = require("nodemailer");

async function sendEmail(to, subject, text) {
  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: '"Testing Mail" <test.email@mailtrap.com>',
    to: to,
    subject: subject,
    text: text,
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports = { sendEmail };
