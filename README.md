# DADA Community

A production-oriented educational community starter built with Next.js App Router, Tailwind CSS, Lucide React and Supabase.

## Architecture

- Next.js 16 App Router + TypeScript
- Supabase Auth with SSR cookies
- PostgreSQL + RLS
- Private Supabase Storage bucket
- Server-side validation with Zod
- VI ID generated in PostgreSQL
- Moderator role stored in `profiles.role`
- Moderation queue and audit log
- DB-backed lightweight rate limiter
- `proxy.ts` route protection
- No service-role key in browser code

## 1. Local prerequisites

Use Node.js 20.9+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Create a Supabase project, copy its URL and publishable key into `.env.local`, then run `supabase/migrations/001_init.sql` in the Supabase SQL Editor.

## 2. Supabase Auth

In Supabase Dashboard → Authentication → Providers, enable Email.

For local development, you can disable email confirmation. For production, keep email confirmation enabled and configure the email provider.

## 3. Moderator

Set:

```bash
MODERATOR_EMAIL=moderator@example.com
MODERATOR_PASSWORD=your-long-password
MODERATOR_DISPLAY_NAME=DADA Moderator
```

Then:

```bash
node scripts/seed-moderator.mjs
```

The requested sample password `yug999` is intentionally NOT hardcoded. If you use it for a local demo, supply it only as an environment variable and change it before production.

## 4. GitHub

```bash
git init
git add .
git commit -m "Initial DADA Community build"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dada-community.git
git push -u origin main
```

Never commit `.env.local` or service-role credentials.

## 5. Vercel

1. Import the GitHub repository into Vercel.
2. Framework preset: Next.js.
3. Add every variable from `.env.example` under Project Settings → Environment Variables.
4. Deploy.
5. Add the production URL to Supabase Authentication → URL Configuration.
6. Run the SQL migration once in Supabase.
7. Run the moderator seed from a trusted local machine or CI environment that can safely hold the service-role key.

## 6. Render

Use a Node web service:

Build command:
```bash
npm ci && npm run build
```

Start command:
```bash
npm run start
```

Set the same environment variables in Render. Next.js 16 requires Node 20.9+.

## Security notes

- `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be prefixed with `NEXT_PUBLIC_`.
- RLS is the actual authorization boundary; UI hiding is not security.
- Content is inserted as `pending`; public feed only exposes `approved` content.
- Moderator endpoints re-check the user's role server-side.
- Uploads use an authenticated route and a private bucket.
- Input is schema-validated and text is stripped of HTML-like tags before persistence.
- The sample DB rate limiter is suitable for a starter/small deployment. For high-scale traffic, use an atomic Redis/Upstash limiter at the edge.
- For real reels, add a video transcoding pipeline and object-size quotas before large-scale launch.
