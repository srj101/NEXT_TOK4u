const { prisma } = require("../../../../../prisma/prisma");

import { Novu } from "@novu/node";

import h2p from "html2plaintext";

const novu = new Novu(process.env.NOVU_TOKEN);

export default async function updateTicket(req, res) {
  const { id } = req.query;

  let { note, detail, lastUpdateBy } = req.body;
  detail = h2p(detail);
  note[note.length - 1] = h2p(note[note.length - 1]);

  try {
    const data = await prisma.ticket.update({
      where: { id: Number(id) },
      data: {
        detail,
        note,
        lastUpdateBy,
      },
    });

    const y = data.note.map((note) => {
      return {
        answer: h2p(note),
      };
    });

    await novu.trigger("answering-tickets-by-team", {
      to: {
        subscriberId: data.email,
        email: data.email,
      },
      payload: {
        name: data.name,
        answers: y,
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
