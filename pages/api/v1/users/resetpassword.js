const { prisma } = require("../../../../prisma/prisma");

import bcrypt from "bcrypt";
const JWT = require("jsonwebtoken");

export default async function getAllClients(req, res) {
  const { password, token } = req.body;

  try {
    const { user } = JWT.verify(token, process.env.JWT_SECRET);
    const hashedPass = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: Number(user.id) },
      data: {
        password: hashedPass,
      },
    });
    res
      .status(201)
      .json({ message: "password updated success", failed: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
