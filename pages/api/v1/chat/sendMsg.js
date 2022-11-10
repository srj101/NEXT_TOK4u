import { PrismaClient } from "@prisma/client";
import { IncomingForm } from "formidable";
import fs from "fs";
import { createNecessaryDirectoriesSync } from "filesac";

export const config = {
  api: {
    bodyParser: false,
  },
};
const prisma = new PrismaClient();

export default async function snedMsg(req, res) {
  const form = new IncomingForm({
    uploadDir: `./storage`,
    keepExtensions: true,
  });
  let message;
  form.parse(req, async (err, fields, files) => {
    // console.log(files);
    try {
      let { msg, sender, user, person } = fields;
      msg = JSON.parse(msg);
      sender = JSON.parse(sender);
      user = JSON.parse(user);
      person = JSON.parse(person);

      console.log(Object.keys(files).length);
      const room = user.email.concat(person.email);
      const Room = person.email.concat(user.email);
      let { message: msgg } = await prisma.message.create({
        data: {
          roomId: room,
          message: msg.msg,
          sender: Number(sender),
        },
      });
      message = msgg;

      if (Object.keys(files).length > 0) {
        const r = room.split("").sort().join("");
        const uploadPath = `./storage/${r}`;

        const f = files.file;
        console.log(f);

        const u = `./storage/${r}/${f.originalFilename}`;

        createNecessaryDirectoriesSync(`${uploadPath}/x`);
        fs.rename(`./storage/${f.newFilename}`, u, async function (err) {
          if (err) throw err;
          console.log("Successfully sent file!");

          const { message: fileMsg } = await prisma.message.update({
            where: {
              roomId: msgg.roomId,
            },
            data: {
              fileName: msg.file.name,
              path: u,
            },
          });
          message = fileMsg;
        });
      }

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
  });
}
