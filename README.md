# DevInfra Frontend

Next.js + TypeScript + Tailwind dashboard for the DevInfra deployment platform.

## Setup

```bash
npm install
cp .env.local.example .env.local
# edit .env.local to point API_URL at your backend
npm run dev
```

Open http://localhost:3000

## Design system

- Dark theme (default): "Modern DevOps" — void black background, electric blue accent
- Light theme: "Clean Slate" — white background, ocean teal accent
- Toggle in the navbar, persisted to localStorage
- Fonts: Inter (UI text), JetBrains Mono (repo URLs, ports, timestamps, status)

## Pages

- `/` — project list + create dialog
- `/projects/[id]` — project detail, deploy button, live deployment stepper, deployment history

## Production environment

Set these variables in Vercel:

```env
API_URL=http://your-ec2-address:8080
NEXT_PUBLIC_DEPLOYMENT_HOST=your-ec2-address
```

Browser requests use the same-origin `/api` path. Next.js proxies them to the
backend so the HTTPS Vercel page does not fetch the HTTP EC2 endpoint directly.
