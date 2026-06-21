## Project Tracker

A personal tracker for assignments, research projects, patient/family centered care studies, and coding projects — deadlines, payments owed, and client WhatsApp contacts in one place.

### Setup

1. Install dependencies:

```bash
npm install
```

2. Set your database connection string in `.env` (copy `.env.example`):

```bash
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```

Use your Neon connection string here (the pooled one ending in `-pooler` works fine).

3. Apply the database schema:

```bash
npx prisma migrate deploy
```

4. Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Data model

Each work type is its own table since they're priced and paid differently:

- **Assignments** — single price, paid in full after delivery.
- **Research projects**, **Care studies**, **Coding projects** — total price split into a deposit (paid at start) and balance (paid on completion).

Every job stores the client's name, WhatsApp number (with a click-to-chat button), a topic/condition/project name, a deadline, and a status. The dashboard lists everything together, sorted by deadline, and flags overdue and unpaid items.

### Deploying to Vercel

Set `DATABASE_URL` in the Vercel project's environment variables (use the Neon pooled connection string). The build only runs `prisma generate` — it does not run migrations, since Vercel's build sandbox can't reliably reach the database. After pushing a schema change, apply it manually from your machine before (or right after) deploying:

```bash
npx prisma migrate deploy
```
