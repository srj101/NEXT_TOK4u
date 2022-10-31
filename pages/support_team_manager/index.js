import React from "react";
import { useSession } from "next-auth/react";

const Role4 = () => {
  const { data: session, status } = useSession({ required: true });

  return (
    <div>
      <h1>{session?.user.name}</h1>
      <h1>
        {" "}
        Support Team Manager Page is protected and can be accessed only by admin
        and people having Role4!
      </h1>
    </div>
  );
};

export default Role4;
