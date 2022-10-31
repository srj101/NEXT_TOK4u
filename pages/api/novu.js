
import { Novu } from "@novu/node";

const novu = new Novu(process.env.NOVU_TOKEN);
/* console.log(novu)
 */
export default async function handler(req, res) {
  
  novu.trigger("testing", {
    to: {
      subscriberId: "elearnnow1@gmail.com",
      email: "elearnnow1@gmail.com",
    },
    payload: {
      name: "james the james",
      email: "elearnnow1@gmail.com",
    },
  });

  }


