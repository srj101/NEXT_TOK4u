const { prisma } = require("../../../../../prisma/prisma");

import { Novu } from "@novu/node";

import h2p from "html2plaintext";

const novu = new Novu(process.env.NOVU_TOKEN);

export default async function updateTicket(req, res) {
  const { id } = req.query;

  let { note, detail, lastUpdateBy } = req.body;
  detail = h2p(detail);
  note = h2p(note);

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
