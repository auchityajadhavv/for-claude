# REVORA owner console — setup (~10 min)

The site works without this. Do it when you want **demo requests to land in a private, owner-only dashboard**.

## What you get
- `/login` and `/signup` — auth pages (owner-only)
- `/dashboard` — private console showing every Book-a-demo request, with status + realtime
- Book-a-demo form on the site → saves straight into the dashboard

## 1. Create a Supabase project (free)
1. Go to **supabase.com** → New project. Pick a name + region (Mumbai/Singapore).
2. When it's ready: **Project Settings → API**. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## 2. Create the table
1. Open **SQL Editor** → New query.
2. Paste the contents of [`supabase/schema.sql`](../supabase/schema.sql).
3. Replace **both** `OWNER_EMAIL_HERE` with your email in lowercase (e.g. `you@revora.in`).
4. Run it.

## 3. Lock signups to just you
**Authentication → Providers → Email**: after you create your account (step 5), turn **off** “Allow new users to sign up”. (The app also blocks any email that isn’t the owner, and the database RLS only lets the owner read data — so this is belt-and-braces.)

Optional: **Authentication → Providers → Email** → turn **off** “Confirm email” so you can sign in immediately without the confirmation link.

## 4. Add the keys
**Local dev:** copy `.env.example` to `.env.local` and fill in the three values.

**Production (Vercel):** Project → **Settings → Environment Variables**, add all three:
| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | your Project URL |
| `VITE_SUPABASE_ANON_KEY` | your anon public key |
| `VITE_OWNER_EMAIL` | your email (lowercase) |

Then **redeploy** (Deployments → ⋯ → Redeploy) so the build picks them up.

## 5. Create your account
Go to **`/signup`** on your site once, use your owner email + a strong password. That's the only account. Then do step 3 to disable further signups.

## 6. Use it
- Visit **`/dashboard`** → sign in → see every request, filter by status, mark new → contacted → closed.
- New submissions appear live (realtime). Click an email to reply.

> Security notes: the anon key is safe to expose in the browser — Row-Level Security means only your owner email can read the requests. Anyone can *submit* a request (that's the point); only you can *see* them.
