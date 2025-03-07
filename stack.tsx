import "server-only";

import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
    tokenStore: "nextjs-cookie",
    urls: { 
        signIn: "/sign-in",
        afterSignIn: "/app/jobs-manager",
        //NOT redirecting... I don't know why... workaround in middleware
        //accountSettings: '/sign-in',
        //Staying with stack auth as a workaround has been found :)
    },
});
