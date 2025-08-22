import nodemailer from 'nodemailer';
import 'dotenv/config';

export const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // 2. Define the email options
  const mailOptions = {
    from: `Shakil Ahmed Portfolio <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};