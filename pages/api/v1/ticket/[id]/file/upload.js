const { prisma } = require("../../../../../../prisma/prisma");

import { getSession } from "next-auth/react";
import { IncomingForm } from "formidable";
import fs from "fs";
import open from "open";
import { createNecessaryDirectoriesSync } from "filesac";
import { oAuth, ytconfig } from "./oauth2callback";
import youtube from "youtube-api";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function UploadFile(req, res) {
  //   const session = await getSession({ req });

  const { id } = req.query;
  console.log("from upload", id);
  const uploadPath = `./storage/tickets/${id}`;
  await createNecessaryDirectoriesSync(`${uploadPath}/x`);

  try {
    const form = await new IncomingForm({
      uploadDir: `./storage`,
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      // console.log(files.file);
      const f = files.file;

      const u = `${uploadPath}/${f.originalFilename}`;

      fs.rename(`./storage/${f.newFilename}`, u, async function (err) {
        if (err) throw err;
        console.log("Successfully renamed - AKA moved!");

        // console.log(files.file);

        const filename = f.originalFilename;
        let title = fields.title;
        let description =
          fields.details + " And the toktok ticket ID was: " + id;
        let ticketid = id;

        let mimetype = f.mimetype.split("/")[0];
        if (mimetype !== "image") {
          const data = await prisma.youtubesettings.findUnique({
            where: { id: 1 },
          });

          if (data.id) {
            /*
Developer worked on youtube API : Rakibul
web: https://github.com/Rakibul-Islam-GitHub
order: https://www.fiverr.com/rakibul_cse21
linkedin: https://www.linkedin.com/in/rakibul21
email: rakibulislam.cse21@gmail.com
*/

            const oAuth = await youtube.authenticate({
              type: "oauth",
              client_id: data.clientid
                ? data.clientid
                : "451352924057-ca2m6d0ioeku2i153qndkkqmlf3mu58i.apps.googleusercontent.com",
              client_secret: data.clientsecret,
              redirect_url: `${process.env.BASE_URL}/api/v1/ticket/1/file/oauth2callback`,
            });

            open(
              oAuth.generateAuthUrl({
                access_type: "offline",
                scope: "https://www.googleapis.com/auth/youtube.upload",
                state: JSON.stringify({
                  filename,
                  title,
                  description,
                  ticketid,
                }),
              })
            );
          }
        }

        try {
          await prisma.ticketFile
            .create({
              data: {
                filename: f.originalFilename,
                ticketId: Number(id),
                path: u,
              },
            })
            .then((err) => console.log(err));
          return res
            .status(200)
            .json({ message: "File Uploaded", success: true });
        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: error, success: false });
        }
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
export { oAuth };
