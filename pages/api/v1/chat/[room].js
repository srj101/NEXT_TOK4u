import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function getRoom(req, res) {
  let { userEmail } = req.body;
  const personEmail = String(req.query.room);

  const rooom = userEmail.concat(personEmail);
  const Room = personEmail.concat(userEmail);

  let room;
  try {
    room = await prisma.room.findFirst({
      where: {
        OR: [
          {
            room: {
              equals: String(rooom),
            },
          },
          { room: { equals: String(Room) } },
        ],
      },
    });
    if (!room) {
      room = await prisma.room.create({
        data: {
          users: [userEmail, personEmail],
          room: rooom,
        },
      });
    }

    const messages = await prisma.message.findMany({
      orderBy: [
        {
          createdAt: "asc",
        },
      ],
      where: {
        OR: [
          {
            roomId: {
              equals: String(rooom),
            },
          },
          { roomId: { equals: String(Room) } },
        ],
      },
    });
    console.log(messages);
    if (messages) {
      res.json({ messages, failed: false });
    } else {
      res.json({ messages: [], failed: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
