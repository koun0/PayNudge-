# PayNudge

PayNudge is a professional SaaS-style payment tracking MVP for freelancers. It helps users organize clients, unpaid payments, overdue invoices, due dates, and client-ready payment reminder messages from one clean dashboard.

This project is designed as a portfolio-ready frontend SaaS MVP with realistic product flows, polished UI, mock data, and a structure that can later connect to Supabase, authentication, and Stripe.

## Problem

Freelancers often manage payments across emails, notes, spreadsheets, and invoices. That makes it easy to forget who has not paid, which payment is overdue, and how to follow up professionally.

PayNudge solves this by giving freelancers a focused workspace for tracking payment status and generating polite reminder messages quickly.

## Target Users

- Freelance designers
- Developers
- Video editors
- Tutors
- Copywriters
- Social media managers
- Consultants
- Independent service providers

## Features

- Landing page with premium SaaS-style hero and pricing sections
- Mock authentication screens for login, signup, and password reset
- Dashboard with payment summary cards and collection health overview
- Client management with search, detail pages, status badges, and totals
- Payment management with filtering, editing, delete actions, and paid/unpaid updates
- Automatic overdue status based on due dates
- Due soon display state for upcoming unpaid payments
- Reminder generator with multiple tones and copy-to-clipboard support
- Pricing page with Free, Starter, and Pro plans
- Settings page for profile, currency, notification, and account preferences
- Responsive UI built for desktop and mobile

## Tech Stack

- React
- Vite
- Tailwind CSS
- Lucide React icons
- ESLint
- Mock local state for demo data

## Screenshots

Screenshots should be added to `public/screenshots/`.

Recommended portfolio screenshots:

- Landing page hero
- Dashboard overview
- Clients page
- Payments page
- Reminder generator

The screenshots folder includes a note file explaining what to capture.

## Live Demo

Add your deployed URL here after publishing the project.

Recommended deployment options:

- Vercel
- Netlify
- Cloudflare Pages

## Installation

Clone the repository:

```bash
git clone <your-repo-url>
cd PayNudge
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the local app:

```text
http://127.0.0.1:5173/
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run start
```

Run lint checks:

```bash
npm run lint
```

## Environment Variables

The current MVP uses mock data and does not require environment variables to run.

An `.env.example` file is included for future integrations. Do not commit real secrets.

Example future variables:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_secret_key
OPENAI_API_KEY=your_openai_api_key
```

Important:

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are client-exposed values for a Vite app.
- `STRIPE_SECRET_KEY` and `OPENAI_API_KEY` should only be used from a backend, API route, or serverless function.
- Never expose service-role keys or private API keys in frontend code.

## How The MVP Works

PayNudge currently uses mock data from `src/data/mockData.js` and stores app changes in React state. The main app state lives in `src/App.jsx`, where clients, payments, reminders, modal state, filters, and route state are managed.

Payment status logic lives in `src/utils/payments.js`. A payment becomes overdue when it is unpaid and the due date has passed. A payment can also display as due soon when it is unpaid and due within the current week.

Reusable UI components live in `src/components/`, including tables, forms, buttons, cards, modals, badges, and the reminder generator.

## What I Learned

This project demonstrates:

- Building a SaaS-style dashboard from reusable React components
- Managing mock product data with React state
- Deriving dashboard metrics from structured payment data
- Designing status systems for paid, unpaid, due soon, and overdue payments
- Creating a polished marketing landing page for a SaaS MVP
- Structuring a frontend project so it can later connect to a real backend
- Preparing a project for GitHub with linting, documentation, and safe environment variable handling

## Future Improvements

- Connect Supabase for persistent users, clients, payments, and reminders
- Add Supabase Auth with email/password and Google login
- Add Row Level Security so each user only sees their own records
- Add Stripe Checkout for paid plan upgrades
- Add email reminder sending through a backend service
- Add recurring payments and invoice attachments
- Add analytics for monthly collected revenue
- Add saved reminder templates
- Add tests for payment status logic and form behavior

## Portfolio Note

PayNudge is a frontend SaaS MVP built to demonstrate product thinking, UI design, React component architecture, state management, dashboard logic, and readiness for future full-stack integrations.

It is intentionally scoped as an MVP: the user experience is functional and polished, while backend services such as Supabase, Stripe, and AI-powered message generation can be added later.


<img width="1872" height="912" alt="plug11" src="https://github.com/user-attachments/assets/47f97777-e53d-42e1-93cb-985183207589" />
<img width="1890" height="927" alt="plug13" src="https://github.com/user-attachments/assets/a9a3a85b-d216-4c1e-a46b-2e701a811c9a" />



