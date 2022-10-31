import { getCsrfToken } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { message } from "antd";

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);

  return {
    props: {
      csrfToken,
    },
  };
}
const ForgotPassword = ({ csrfToken }) => {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = useState();
  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/v1/users/forgotpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      message.success("Password Reset Email Was Sent!");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      // const { data } = error.response;
    }
  };

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
            Forgot Password
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <p>You are not alone. We've all been here at some point.</p>
            <form className="space-y-6" onSubmit={handleForgot}>
              <div>
                <input
                  name="csrfToken"
                  type="hidden"
                  defaultValue={csrfToken}
                />
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {!loading ? `Get Secure Link` : `Sending...`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
