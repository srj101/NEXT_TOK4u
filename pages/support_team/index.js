import React from "react";
import { useSession } from "next-auth/react";

const Role3 = () => {
  const { data: session, status } = useSession({ required: true });

  return (
    <div>
      <h1>{session?.user.name}</h1>
      <h1>
        {" "}
        Support team Page is protected and can be accessed only by admin and
        people having Role3!
      </h1>
    </div>
  );
};

export default Role3;
