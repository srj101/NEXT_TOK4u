const { prisma } = require("../../../../prisma/prisma");
let nodemailer = require("nodemailer");
// let JWT = require("jsonwebtoken");

export default async function forgotPAssword(req, res) {
  const { email } = req.body;
  console.log(req.body);

  const transporter = nodemailer.createTransport({
    port: process.env.EMAIL_SERVER_PORT,
    host: process.env.EMAIL_SERVER_HOST,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    secure: false,
  });

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const token = JWT.sign({ user }, process.env.JWT_SECRET);

    const mailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Reset Password`,

      html: `
      Password Reset Link : <a href="${process.env.NEXTAUTH_URL}/auth/reset-password/${token}/${email}">Password Rest Link</a>
    
    `,
    };
    await transporter.sendMail(mailData);
    res.status(200).json({ token, failed: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
