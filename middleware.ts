import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "./stack";

export async function middleware(request: NextRequest) {
    const user = await stackServerApp.getUser();
    console.log(request.nextUrl.pathname)
    

    if (request.nextUrl.pathname.startsWith('/handler')) {
      return NextResponse.redirect(new URL('/app/profile', request.url))
    }

    if (!user) {
        return NextResponse.redirect(new URL('/handler/sign-in', request.url));
    }

    return NextResponse.next();
}

export const config = { matcher: ['/app/:path*', '/handler/account-settings'] }