import { getCsrfToken } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
const ResetPassword = dynamic(
  () => import("../../../../components/ResetPassword"),
  {
    ssr: false,
  }
);

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);

  return {
    props: {
      csrfToken,
    },
  };
}
const ForgotPassword = ({ csrfToken }) => {
  const { query } = useRouter();

  const token = query.token;
  const email = query.email;

  return (
    <div>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="https://Toking4u.com/">
            <a>
              <img
                className="mx-auto h-36 w-auto"
                src="/Tok4U_Logo.png"
                alt="Toking4u logo"
              />
            </a>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <ResetPassword token={token} email={email} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
