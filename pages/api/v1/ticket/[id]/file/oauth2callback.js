/*
Author worked on youtube API : Rakibul
web: https://github.com/Rakibul-Islam-GitHub
order: https://www.fiverr.com/rakibul_cse21
linkedin: https://www.linkedin.com/in/rakibul21
email: rakibulislam.cse21@gmail.com
*/

import youtube from "youtube-api";

import fs from "fs";
import open from "open";
import { prisma } from "../../../../../../prisma/prisma";
// import { oAuth } from "./upload";

export let ytconfig = {};

/*
Author worked on youtube API : Rakibul
web: https://github.com/Rakibul-Islam-GitHub
order: https://www.fiverr.com/rakibul_cse21
linkedin: https://www.linkedin.com/in/rakibul21
email: rakibulislam.cse21@gmail.com
*/

export default async function oauth2callback(req, res) {
  const { filename, title, description, ticketid, path } = JSON.parse(
    req.query.state
  );
  // let filename='test2.mp4'
  // let title='new educational video'
  // let description= 'test video'
  console.log("from oauth2callback", filename, title, description);

  const data = await prisma.youtubesettings.findUnique({
    where: { id: 1 },
  });

  if (data.id) {
    const oAuth = await youtube.authenticate({
      type: "oauth",
      client_id: data.clientid,
      client_secret: data.clientsecret,
      redirect_url: "http://localhost:3000/api/v1/ticket/1/file/oauth2callback",
    });

    await oAuth.getToken(req.query.code, async (err, tokens) => {
      if (err) {
        console.log(err);
        return;
      }

      oAuth.setCredentials(tokens);

      await youtube.videos.insert(
        {
          resource: {
            snippet: { title, description },
            status: { privacyStatus: "private" },
          },
          part: "snippet,status",
          media: {
            body: fs.createReadStream(
              `./storage/tickets/${ticketid}/${filename}`
            ),
          },
        },
        async (err, data) => {
          let videoUrl = `https://www.youtube.com/watch?v=${data.data.id}`;
          const result = await prisma.ticketFile.updateMany({
            where: { path: `./storage/tickets/${ticketid}/${filename}` },
            data: {
              youtubeUrl: videoUrl,
              thumbnail: data.data.snippet.thumbnails.high.url,
            },
          });
          return res.status(200).json("Video uploaded successfully");
          // process.exit();
        }
      );
    });
  }
}

/*
Author worked on youtube API : Rakibul
web: https://github.com/Rakibul-Islam-GitHub
order: https://www.fiverr.com/rakibul_cse21
linkedin: https://www.linkedin.com/in/rakibul21
email: rakibulislam.cse21@gmail.com
*/
