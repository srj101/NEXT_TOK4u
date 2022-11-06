const { prisma } = require("../../../../../../prisma/prisma");

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
  console.log(req.body);
  try {
    const { id } = req.query;
    console.log("from upload", id);
    const uploadPath = `./storage/tickets/${id}`;
    createNecessaryDirectoriesSync(`${uploadPath}/x`);
    console.log(uploadPath);
    const form = new IncomingForm({
      uploadDir: `./storage`,
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        throw String(JSON.stringify(err, null, 2));
      }
      console.log(files.file);
      const f = files.file;

      const u = `${uploadPath}/${f.originalFilename}`;

      fs.rename(`./storage/${f.newFilename}`, u, async function (err) {
        if (err) throw err;
        console.log("Successfully renamed - AKA moved!");

        console.log(files.file);

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
              client_id: data.clientid,
              client_secret: data.clientsecret,
              redirect_url:
                "http://localhost:3000/api/v1/ticket/1/file/oauth2callback",
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

        await prisma.ticketFile.create({
          data: {
            filename: f.originalFilename,
            ticketId: Number(id),
            path: u,
          },
        });

        return res
          .status(200)
          .json({ message: "File Uploaded", success: true });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error, success: false });
  }
}
// export { oAuth };
