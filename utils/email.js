const nodemailer = require("nodemailer");

async function sendEmail(options) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  console.log(transporter);
  
  const mailOptions = {
    from: "Едальня",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  console.log(mailOptions);

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
