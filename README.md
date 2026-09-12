This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
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

## Gallery backend

The gallery backend uses Prisma with the PostgreSQL service in `docker-compose.dev.yml`.

1. Copy `.env.example` to `.env` and set `AUTH_SECRET` and `PBCA_ADMIN_PASSWORD`.
2. Start PostgreSQL with `docker-compose -f docker-compose.dev.yml up -d db`.
3. Apply migrations with `npm run db:deploy`.
4. Seed the administrator and page galleries with `npm run db:seed`.
5. Open `/admin` to manage gallery image metadata.

Public routes are `GET /api/galleries`, `GET /api/galleries/:pageSlug`, and `GET /api/galleries/:pageSlug/images`. Admin routes use the authenticated session cookie and are under `/api/admin`.

Image files are intentionally stored outside PostgreSQL; the admin portal currently records a provider URL and storage key. Connect an object-storage upload provider before enabling direct uploads in production.
