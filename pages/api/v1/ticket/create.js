const { prisma } = require("../../../../prisma/prisma");
import { Novu } from "@novu/node";

const novu = new Novu(process.env.NOVU_TOKEN);
export default async function create(req, res) {
  const { name, company, detail, title, priority, email, engineer, issue } =
    JSON.parse(req.body);

  try {
    if (!name || !company || !title || !priority) {
      return res
        .status(422)
        .json({ error: "Please add all the fields", failed: true });
    }

    const data = await prisma.ticket.create({
      data: {
        name,
        title,
        detail,
        priority,
        issue,
        email,
        client: {
          connect: { id: Number(company.id) },
        },
        assignedTo: {
          connect: { id: Number(engineer.id) },
        },
        isComplete: Boolean(false),
      },
    });

    const webhook = await prisma.webhooks.findMany({
      where: {
        type: "ticket_created",
      },
    });

    for (let i = 0; i < webhook.length; i++) {
      if (webhook[i].active === true) {
        console.log(webhook[i].url);
        await fetch(`${webhook[i].url}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: `Ticket ${data.id} created by ${data.name} -> ${data.email}. Priority -> ${data.priority}`,
          }),
          redirect: "follow",
        });
      }
    }

    await novu.trigger("creating-a-new-ticket", {
      to: {
        subscriberId: data.email,
        email: data.email,
      },
      payload: {
        name: data.name,
        email: data.email,
      },
    });

    res.status(200).json({ message: "Ticket created correctly" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
