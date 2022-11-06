const { prisma } = require("../../../../prisma/prisma");

export default async function snedMsg(req, res) {
  const { msg, user, person, sender } = req.body;

  const room = user.email.concat(person.email);
  const Room = person.email.concat(user.email);

  try {
    const message = await prisma.message.create({
      data: {
        roomId: room,
        message: msg.msg,
        file: msg.file,
        sender,
      },
    });

    await prisma.room.updateMany({
      where: {
        OR: [
          {
            room: {
              equals: room,
            },
          },
          { room: { equals: Room } },
        ],
      },
      data: {
        lastMessage: msg.msg,
      },
    });

    res.json({ message, failed: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
