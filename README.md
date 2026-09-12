# Motrfolio

**Ek link mein poori gaadi.** — AI-powered car listings for India's used-car dealers.

Upload photos + a 30-second voice note; Motrfolio's AI produces a clean, shareable
listing page per vehicle in under 60 seconds. The UI follows an internal design system
(warm marketplace, clean white canvas, Rausch accent).

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (design tokens from the internal design system)
- **Supabase** — Postgres + Auth + Storage
- **Claude API** — listing copy, buyer-enquiry replies
- **OpenAI Whisper** — voice-note transcription
- **Interakt** — WhatsApp Business API
- Deployed on **Vercel**

## Getting started

```bash
cp .env.example .env.local   # then fill in your keys
npm install
npm run dev                  # http://localhost:3000
```

The waitlist form works without Supabase configured (it no-ops server-side and returns
success) so you can develop the UI immediately. To persist signups, set the Supabase env
vars and apply the migration.

## Database

Apply the waitlist schema in the Supabase SQL editor, or with the Supabase CLI:

```bash
supabase db push   # runs supabase/migrations/*.sql
```

`supabase/migrations/0001_waitlist.sql` creates the `waitlist` table with RLS that allows
anonymous INSERTs only (the public site uses the anon key; the list is not readable with it).

## Project structure

```
src/
  app/
    api/waitlist/route.ts   # POST endpoint that stores signups
    layout.tsx              # metadata, fonts
    page.tsx                # marketing landing page
    globals.css
  components/
    WaitlistForm.tsx        # client-side waitlist form
  lib/
    supabase.ts             # server-side Supabase client factory
supabase/
  migrations/               # SQL schema
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
