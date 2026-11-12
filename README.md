# MatruCare AI - Hackathon Registration Portal

A MERN-stack portal where participants sign up, verify their email with an OTP, log in to a personal dashboard, and register for a hackathon with full team details. OTP and confirmation emails are sent through Nodemailer from `matrucareai@gmail.com` (sender name: MatruCare AI).

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcrypt |
| Email | Nodemailer (Gmail SMTP, App Password) |
| OTP | Custom 6-digit generator (`crypto.randomInt`), stored hashed, 10 min expiry, single use |

## Project structure

```
/client   React app (pages, components, auth context)
/server   Express API (models, routes, middleware, utils)
```

## Setup

### Prerequisites
Node.js 18+, a MongoDB instance (local or Atlas), and a Gmail account with 2-Step Verification and an App Password.

### 1. Server
```bash
cd server
npm install
cp .env.example .env     # then fill in the values
npm run dev              # http://localhost:5000
```

### 2. Client
```bash
cd client
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:5000/api
npm run dev              # http://localhost:5173
```

## Environment variables

Server (`server/.env`):

| Variable | Purpose |
|---|---|
| `PORT` | API port (default 5000) |
| `CLIENT_URL` | Allowed CORS origin(s), comma-separated |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `EMAIL_USER` | `matrucareai@gmail.com` |
| `EMAIL_PASS` | Gmail App Password (not the account password) |
| `EMAIL_FROM_NAME` | `MatruCare AI` |

Client (`client/.env`): `VITE_API_URL` - base URL of the API, ending in `/api`.

Never commit real `.env` files. Only `.env.example` is tracked.

### Gmail App Password
Google Account > Security > enable 2-Step Verification > App passwords > create one for "Mail" and paste it into `EMAIL_PASS`.

## User flow

1. **Signup** - creates an unverified account, emails a 6-digit OTP, redirects to OTP page.
2. **Verify OTP** - valid for 10 minutes, invalidated after first use; Resend OTP available.
3. **Login** - bcrypt compare, JWT issued and stored in `localStorage`.
4. **Dashboard** - private; shows profile and registration, or a "Register Now" button.
5. **Registration** - full form with dynamic team member boxes; saves to DB and emails a confirmation.
6. **Logout** - clears the token and returns Home.

Route protection: Home, Login and Signup are public (plus the OTP step, which is part of signup). All other pages are behind the JWT guard, as the brief requires.

## API documentation

Protected endpoints need `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Body: `fullName, email, password, confirmPassword`. Creates user, sends OTP |
| POST | `/api/auth/verify-otp` | No | Body: `email, otp`. Marks account verified |
| POST | `/api/auth/resend-otp` | No | Body: `email`. Sends a fresh OTP |
| POST | `/api/auth/login` | No | Body: `email, password`. Returns `{ token, user }` |
| GET | `/api/user/me` | Yes | Logged-in user's profile |
| PUT | `/api/user/update` | Yes | Body: `fullName`. Update profile |
| POST | `/api/hackathon/register` | Yes | Submit registration; sends confirmation email |
| GET | `/api/hackathon/my-entry` | Yes | Returns `{ entry }` (null if none) |
| DELETE | `/api/hackathon/:id` | Yes | Delete your own registration |
| GET | `/api/health` | No | Health check |

Registration body fields: `fullName, email, mobile, college, course, branch, year, domain, projectName, pptLink, prototypeLink, demoLink (optional), teamSize (1-5), members [{ name, email }]`. `members` must have `teamSize` entries when `teamSize > 1`, and be empty for solo.

## Security notes

- Passwords hashed with bcrypt; plain text is never stored.
- OTPs are stored hashed, expire after 10 minutes and are cleared after first use.
- JWT secret and email credentials come from environment variables only.
- Email templates use only "MatruCare AI" and `matrucareai@gmail.com`; no personal names.
- Server re-validates every registration field independently of the client.

## Deployment

- **Backend (Render/Railway):** root directory `server`, build `npm install`, start `npm start`. Set all server env vars; set `CLIENT_URL` to the deployed frontend URL.
- **Frontend (Vercel/Netlify):** root directory `client`, build `npm run build`, output `dist`. Set `VITE_API_URL` to the deployed API URL. Add an SPA fallback (Vercel: rewrite all paths to `/index.html`; Netlify: `/* /index.html 200` in `_redirects`).

Live URLs: _add after deployment_

## Screenshots

_Add screenshots of Home, Signup, OTP, Dashboard and Registration here._

## Notes

- The Contact form opens the visitor's mail client addressed to `matrucareai@gmail.com`, since the brief defines no contact API.
- College, course, branch and track lists live in `client/src/utils/options.js`.
