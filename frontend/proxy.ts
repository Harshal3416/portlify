import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    // await auth.protect();
        await auth.protect({
      unauthenticatedUrl: new URL('/admin/products', req.url).toString(),
    });
    // Optional: restrict by role
    // const { sessionClaims } = await auth();
    // if (sessionClaims?.metadata?.role !== 'admin') {
    //   return NextResponse.redirect(new URL('/', req.url));
    // }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};