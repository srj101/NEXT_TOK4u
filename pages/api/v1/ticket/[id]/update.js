const { prisma } = require("../../../../../prisma/prisma");

import { Novu } from "@novu/node";

const novu = new Novu(process.env.NOVU_TOKEN);

export default async function updateTicket(req, res) {
  const { id } = req.query;

  const { note, detail, lastUpdateBy } = req.body;

  try {
    const data = await prisma.ticket.update({
      where: { id: Number(id) },
      data: {
        detail,
        note,
        lastUpdateBy,
      },
    });

    await novu.trigger("answering-tickets-by-team", {
      to: {
        subscriberId: data.email,
        email: data.email,
      },
      payload: {
        name: data.name,
        answer: data.note,
        title: data.title,
        detail: data.detail,
        answeredBy: data.lastUpdateBy,
      },
    });

    res.status(201).json({ success: true, message: "Ticket saved" });
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}
