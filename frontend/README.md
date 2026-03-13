This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev # or npx next dev -p 4000
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Connection to PGAdmin4
If it asks for password and even after entering the right password you are not able to connect to the server.
- Make sure PostgreSQL is running.
- On Windows: open Services (services.msc) and check if postgresql-x64-XX is started.
- Enable the Service
- In the Properties window, change Startup type from Disabled to Automatic (or Manual if you prefer to start it yourself).
- Click Apply.
- Start the Service
- Back in the same window, click Start.
- Alternatively, in the Services list, right-click postgresql-x64-18 → Start.
- Verify It’s Running
- Once started, the status should show as Running.
- You can also check with: netstat -ano | findstr 5432
- If PostgreSQL is running, you’ll see it listening on port 5432.

