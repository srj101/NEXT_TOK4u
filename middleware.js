import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req) {
  // Redirect if they don't have the appropriate role
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  // console.log("middleware---->", token, req.nextUrl);

  const { pathname, origin } = req.nextUrl;

  if (token) {
    if (
      (req.nextUrl.pathname === "/support_team" &&
        !token?.user.roles.includes("Role3") &&
        token?.user.isAdmin === false) ||
      (req.nextUrl.pathname === "/support_team_manager" &&
        !token?.user.roles.includes("Role4") &&
        token?.user.isAdmin === false) ||
      (req.nextUrl.pathname.includes("admin") && token?.user.isAdmin === false)
    ) {
      return NextResponse.redirect(`${origin}/`);
    }
  }

  //   return NextResponse.redirect("/");
}
//notes , chat, email provider notification , admin page guard
