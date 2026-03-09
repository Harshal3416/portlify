// import { NextResponse } from "next/server";

// // TODO: Set a correct type
// export function middleware(request:any) {
//   const host = request.headers.get("host");

//   const subdomain = host.split(".")[0];

//   if (subdomain !== "www" && subdomain !== "yourapp") {
//     const url = request.nextUrl.clone();
//     url.pathname = `/store/${subdomain}${url.pathname}`;
//     return NextResponse.rewrite(url);
//   }

//   return NextResponse.next();
// }