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

### Environment variables

`vercel.json` only configures *which git branches deploy*; it does not configure the app. Every
variable below must also be set in **Vercel → Project → Settings → Environment Variables** for
both **Production** and **Preview**, otherwise the preview/production deployment will fail at the
presign step (`500`) even though uploads work locally.

| Variable | Needed for |
| --- | --- |
| `DATABASE_URL`, `DIRECT_URL` | Prisma (`prisma/schema.prisma`) — required at build and runtime |
| `AUTH_SECRET` | Admin sessions; must be at least 32 characters (`src/lib/auth.ts`) |
| `PBCA_ADMIN_EMAIL`, `PBCA_ADMIN_PASSWORD` | `npm run db:seed` only, not read at runtime |
| `CLOUDFLARE_ACCOUNT_ID`, `R2_BUCKET_NAME`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` | R2 presigning, upload verification and `GET /api/r2/[...key]` (`src/lib/r2.ts`) |
| `EMAIL_USER`, `EMAIL_PASS` | Contact form and notification mail (`src/lib/mailer.ts`) |

`R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` are object-scoped S3 credentials, so they can presign
PUTs but **cannot** read or write bucket CORS. That is why the CORS policy lives in the Cloudflare
dashboard / Wrangler rather than in this repository's runtime config.

## Gallery backend

The gallery backend uses Prisma with the PostgreSQL service in `docker-compose.dev.yml`.

1. Copy `.env.example` to `.env` and set `AUTH_SECRET` and `PBCA_ADMIN_PASSWORD`.
2. Start PostgreSQL with `docker-compose -f docker-compose.dev.yml up -d db`.
3. Apply migrations with `npm run db:deploy`.
4. Seed the administrator and page galleries with `npm run db:seed`.
5. Open `/admin` to manage gallery image metadata.

Public routes are `GET /api/galleries`, `GET /api/galleries/:pageSlug`, and `GET /api/galleries/:pageSlug/images`. Admin routes use the authenticated session cookie and are under `/api/admin`.

Image files are stored in Cloudflare R2 (never in PostgreSQL) and are served back through `GET /api/r2/[...key]`.

## Image uploads (presigned direct-to-R2)

Admin images are **not** posted through a Next.js route: Vercel caps function request bodies
(and responses) at 4.5 MB, which made large uploads fail in production with
`413 FUNCTION_PAYLOAD_TOO_LARGE`. Instead:

1. the browser asks `POST /api/admin/uploads/presign` for a short-lived upload URL;
2. the route authenticates the admin, validates the declared type/size and derives the
   storage key **server-side** (`<pageSlug>/gallery/<uuid>.<ext>`,
   `home/partners-logos/<uuid>.<ext>`, `home/events-gallery/<uuid>.<ext>`,
   `<pageSlug>/landing-image`), then signs a single PUT with
   `@aws-sdk/s3-request-presigner`;
3. the browser PUTs the file straight to R2 (with upload progress);
4. the browser sends only the `storageKey` plus the text fields to the matching entity
   route, which re-reads the stored object with `HeadObject` and uses *R2's* `Content-Type`
   and `Content-Length` for validation and for the database columns.

Because R2 has no presigned POST policy (no `content-length-range`) and does not enforce the
signed `Content-Type`, step 4 is the enforcement point: the object's real headers must be an
allowed image type and at most 50 MB, otherwise the object is deleted and the request is
rejected.

### Bucket CORS policy

Uploads go from the browser straight to R2, so the bucket must allow the admin origins. With no
policy, R2 answers the preflight with `403` and
`<Message>CORS not configured for this bucket</Message>`, and the browser reports
`No 'Access-Control-Allow-Origin' header is present on the requested resource`.

The policy is versioned as `r2-cors.json`; apply it from the dashboard:

1. Open the [R2 object storage overview](https://dash.cloudflare.com/?to=/:account/r2/overview).
2. Select the uploads bucket (`R2_BUCKET_NAME`).
3. Open **Settings**, then under **CORS Policy** select **Add CORS policy**.
4. Paste the contents of `r2-cors.json` into the **JSON** tab and select **Save**
   (`cat r2-cors.json | pbcopy` copies it on macOS).

Or apply it from the CLI. Wrangler takes a *different* file shape, kept in
`r2-cors.wrangler.json`, and needs an API token with *Workers R2 Storage: Edit*:

```bash
CLOUDFLARE_API_TOKEN=... npx wrangler r2 bucket cors set "$R2_BUCKET_NAME" --file r2-cors.wrangler.json
CLOUDFLARE_API_TOKEN=... npx wrangler r2 bucket cors list "$R2_BUCKET_NAME"
```

R2 serves no CORS headers at all without the `Origin` request header, and rule propagation can
take up to ~30 seconds. The dashboard also caches the policy, so re-open **Settings** to confirm
it saved.

This is the only place CORS is configured: the application code sets a single cross-origin header
(`Content-Type`, in `src/lib/uploads-client.ts`) and R2 matches the policy by request `Origin`, so
adding or removing an origin never requires a code change or a redeploy. Verify from a terminal
without any credentials — a listed origin returns `204` plus
`Access-Control-Allow-Origin: <origin>`, an unlisted one returns `403` with no CORS headers:

```bash
curl -s -D - -o /dev/null -X OPTIONS \
  "https://pbca.$CLOUDFLARE_ACCOUNT_ID.r2.cloudflarestorage.com/about-us/landing-image" \
  -H 'Origin: http://localhost:3000' \
  -H 'Access-Control-Request-Method: PUT' \
  -H 'Access-Control-Request-Headers: content-type' | grep -i '^HTTP/\|^access-control-'
```

```json
[
  {
    "AllowedOrigins": [
      "https://pbca.vercel.app",
      "https://pbca.in",
      "http://localhost:3000"
    ],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["content-type"],
    "ExposeHeaders": ["etag"],
    "MaxAgeSeconds": 3600
  }
]
```

R2 matches origins exactly (no wildcard subdomains): a request from any other hostname matches no
rule and the browser blocks the upload. `http://localhost:3000` and `http://127.0.0.1:3000` are
different origins, and so is every `*.vercel.app` preview hostname, so add an origin (or a second
rule) before testing from somewhere else — for example `http://localhost:3111`.

The three origins above cover the Vercel deployment, the custom domain and local development.
`AllowedHeaders` must include `content-type` because the browser sends that header on the PUT;
`ExposeHeaders` is only needed by clients that read the `ETag`.

Verify the policy is live by asking R2 for a preflight response. A configured bucket answers
`204` with the `Access-Control-Allow-*` headers, an unconfigured one answers `403` with none:

```bash
curl -s -i -X OPTIONS \
  "https://pbca.$CLOUDFLARE_ACCOUNT_ID.r2.cloudflarestorage.com/about-us/landing-image" \
  -H 'Origin: http://localhost:3000' \
  -H 'Access-Control-Request-Method: PUT' \
  -H 'Access-Control-Request-Headers: content-type' | grep -i '^HTTP/\|^access-control'
```

## Frontend conventions

### HTTP requests use axios

Browser code never calls `fetch`. Every request goes through `axios`, and the `{ data }` / `{ error }`
envelope from `@/lib/api` is unwrapped with `readApiData` from `src/lib/http.ts`:

```tsx
import axios from "axios";
import { readApiData } from "@/lib/http";

readApiData<GalleryDto[]>(
  axios.get("/api/galleries", { signal: controller.signal }),
  "Unable to load galleries.",
)
  .then(setGalleries)
  .catch((error: unknown) => {
    if (!axios.isCancel(error)) console.error(error);
  });
```

`readApiData` matters because axios rejects on any non-2xx status, so without it the admin UI would
show axios' generic `Request failed with status code 400` instead of the route's own
`error.message`. It re-throws an `Error`, keeping call sites on
`cause instanceof Error ? cause.message : fallback`. Cancellation stays intact, which is why
`AbortController` + `axios.isCancel` is the standard pattern for load effects — pass
`{ signal: controller.signal }` and return `() => controller.abort()`.

Note that `axios` infers the request body type: JSON objects are serialized with
`Content-Type: application/json`, `FormData` gets a browser-generated multipart boundary, and
`File` uploads keep their type. Server-side route handlers still use the Web `Request` API.

### Images use `next/image` and are lazy loaded

Every image renders through `next/image` — site components and the admin portal alike — with
`loading="lazy" decoding="async"` plus a `width`/`height` (or `fill`) so the layout reserves the
right aspect ratio. The two deliberate exceptions are the home hero (`src/components/Hero.tsx`)
and the interior page hero (`src/components/InteriorPage.tsx`), which are the LCP element and
therefore render `loading="eager" fetchPriority="high"` with explicit `sizes="100vw"`.

- **Grid, gallery and thumbnail images** get a `sizes` hint where the rendered box is known
  (admin rows `sizes="96px"`, accordion media `sizes="320px"`, logo marquee `sizes` from the
  item) so the optimizer serves small files for small boxes.
- **R2 uploads** are served through the same-origin proxy `GET /api/r2/[...key]` and optimized
  by the built-in image optimizer; external hosts (`images.unsplash.com`, `i.ytimg.com`) are
  allowlisted via `remotePatterns` in `next.config.ts`.
- `eslint` flags any raw `<img>` via `@next/next/no-img-element`, keeping the migration honest.

