const { prisma } = require("../../../../prisma/prisma");
let nodemailer = require("nodemailer");
let JWT = require("jsonwebtoken");
import Mailjet from "node-mailjet";

const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE,
});

export default async function forgotPAssword(req, res) {
  const { email } = req.body;
  console.log(req.body);

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const token = JWT.sign({ user }, process.env.JWT_SECRET);

    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "support@prowp.io",
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: `Reset Password - Tok4u`,
          TextPart: `Reset Password Link - Tok4U`,
          HTMLPart: `
          Password Reset Link : <a href="${process.env.NEXTAUTH_URL}/auth/reset-password/${token}/${email}">Password Rest Link</a>
        
        `,
          CustomID: "ResetPassword",
        },
      ],
    });
    res.status(200).json({ token, failed: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
