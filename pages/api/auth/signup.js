const { prisma } = require("../../../prisma/prisma");
/* import { getSession } from "next-auth/react";
 */ import bcrypt from "bcrypt";
import { Novu } from "@novu/node";

const novu = new Novu(process.env.NOVU_TOKEN);

export default async function createUser(req, res) {
  /*   const session = await getSession({ req });
   */ const { email, password, name, admin } = req.body;
  const e = email.toLowerCase();

  try {
    const hash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email: e,
        password: hash,
        isAdmin: false,
      },
    });

    await novu.trigger("create-new-user", {
      to: {
        subscriberId: email,
        email: email,
      },
      payload: {
        name: name,
        email: email,
      },
    });

    res.status(200).json({ message: "User saved successfully", failed: false });
  } catch (error) {
    console.log(error);
  }
}
