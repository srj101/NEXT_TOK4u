/*
Author worked on youtube API : Rakibul
web: https://github.com/Rakibul-Islam-GitHub
order: https://www.fiverr.com/rakibul_cse21
linkedin: https://www.linkedin.com/in/rakibul21
email: rakibulislam.cse21@gmail.com
*/

import { getSession } from "next-auth/react";
import { prisma } from "../../../../../../prisma/prisma";
// import bcrypt from "bcrypt";

export default async function youtubeApiSettings(req, res) {
  const session = await getSession({ req });
  let { clientid, clientsecret, privacy  } = req.body;
 privacy===''&& 'private'
  

  try {
    if (session.user.isAdmin) {
    //   const hash = await bcrypt.hash(password, 10);
const data=  await prisma.youtubesettings.findMany({})

if (data.length>0) {
    await prisma.youtubesettings.update({
        where: { id: 1 },
        data: {
         clientid,
         clientsecret,
         privacy
          
        },
      });
      res
        .status(200)
        .json({ message: "settings updated successfully", success: true });
}else{
    await prisma.youtubesettings.create({
        
        data: {
         clientid,
         clientsecret,
         privacy
          
        },
      });
      res
        .status(200)
        .json({ message: "settings saved successfully", success: true });
}
     
    } else {
      res.status(400).json({ message: "You are not an admin ", success: true });
    }
  } catch (error) {
    console.log(error);
  }
}


