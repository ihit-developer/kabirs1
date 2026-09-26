# Kabir's Restaurant — React Edition

A full-stack restaurant ordering platform: online menu & cart, checkout with
coupons/loyalty points, table reservations, live order tracking, and an
admin dashboard with real-time orders and sales analytics.

This is a rebuild of the original vanilla HTML/JS site as a **React (Vite)**
front end backed by the same **Express + MongoDB** API, with a few
important upgrades — see [What changed](#what-changed-from-the-original) below.

## Project structure

```
kabirs-restaurant-react/
├── server/          Express API (MongoDB, JWT admin auth, email, SSE)
└── client/          React app (Vite + Tailwind CSS)
```

## 1. Prerequisites

- Node.js 18+
- A MongoDB database — either [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier is fine) or a local `mongod`

## 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:

| Variable | Description |
|---|---|
| `MONGO_URI` | Your MongoDB connection string |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Credentials for the one-time admin seed script — **change these from the defaults** |
| `JWT_SECRET` | Any long random string — used to sign admin login sessions |
| `EMAIL_*` / `ADMIN_EMAIL` | Optional — leave blank to disable order-confirmation emails |

Then seed the database:

```bash
npm run seed          # menu items
npm run seed:coupons  # sample promo codes
npm run seed:admin    # creates the admin login using ADMIN_USERNAME/ADMIN_PASSWORD from .env
```

Start the API:

```bash
npm run dev     # http://localhost:5000
```

## 3. Frontend setup

In a second terminal:

```bash
cd client
npm install
npm run dev     # http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to `http://localhost:5000`, so
just open **http://localhost:5173** — no extra config needed.

## 4. Admin dashboard

Go to `http://localhost:5173/admin/login` and sign in with the
`ADMIN_USERNAME` / `ADMIN_PASSWORD` you set before running `npm run seed:admin`.

## 5. Production build

```bash
cd client && npm run build     # outputs client/dist
cd ../server && npm start      # serves the API + the built client together on one port
```

`server/server.js` already serves `client/dist` as static files and falls
back to `index.html` for client-side routing, so a single Node process
(behind Nginx, PM2, Render, Railway, a VPS, etc.) can run the whole app.
If you deploy the client and server on **different domains**, set
`origin` in `server/server.js`'s CORS config to your client's URL.

## What changed from the original

**Security fix:** the original admin panel checked a hardcoded
username/password sitting in plain-text client-side JavaScript — visible to
anyone who viewed the page source. This is now a proper backend login
(`POST /api/auth/login`) with a bcrypt-hashed password and short-lived JWT
sessions; every admin-only API route is protected server-side.

**Removed:** a "Credit/Debit Card" checkout option that collected full card
numbers directly in the browser. With no real payment gateway behind it,
that was pure liability with no benefit — it's replaced by JazzCash,
EasyPaisa and Bank Transfer, each verified by transaction ID/reference, plus
Cash on Delivery. Also dropped an unused `twilio` dependency.

**Kept & carried over as-is:** the menu, cart, coupon codes, loyalty points,
table reservations, reviews & ratings, live order tracking with a
progress timeline and ETA countdown, the admin dashboard (orders, menu
editor, coupons, reservations, loyalty, analytics with charts), real-time
new-order notifications (Server-Sent Events), and optional email
notifications.

**Rebuilt:** the entire front end (previously ~5,000 lines of hand-rolled
HTML/CSS/vanilla JS across five pages) is now a componentized React app
with client-side routing, shared cart/auth state, toast notifications
instead of `alert()`, and a refreshed visual design (Tailwind CSS,
Playfair Display + Inter typography) — while keeping the original's
dark/gold/red branding.

## Notes

- If the API is unreachable, the menu falls back to a small built-in sample
  menu so the storefront never shows a blank page — update `server/config/seed.js`
  and re-run `npm run seed` to change the real menu.
- Loyalty points: customers earn 1 point per Rs.10 spent; 100 points = Rs.50 off.
