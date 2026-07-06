# Current Project State

Snapshot of the repository as read on 2026-06-30.

## Structure

- `frontend/`: React 19 + Vite + Tailwind CSS
- `server/`: Node.js + Express + MongoDB + Mongoose

## Frontend

- Routing is defined in [`frontend/src/App.jsx`](frontend/src/App.jsx).
- Public pages include Home, About, Services, Contact, Blog, Blog Detail, Achievements, Information, Careers, Gallery, and Privacy Policy.
- Admin routes include login, dashboard, services, team, blogs, inquiries, and achievements.
- `ProtectedRoute` is used to guard admin pages.

## Backend

- Server entry point is [`server/src/server.js`](server/src/server.js).
- Enabled API groups:
  - `/api/auth`
  - `/api/services`
  - `/api/team`
  - `/api/blogs`
  - `/api/achievements`
  - `/api/contact`
  - `/api`
  - `/api/chat`
- Health check is available at `GET /api/health`.
- CORS allows localhost frontend ports `3000` and `5173`, plus `FRONTEND_URL` from `.env`.

## Scripts

Frontend:

```bash
cd frontend
npm run dev
npm run build
npm run preview
```

Backend:

```bash
cd server
npm run dev
npm run start
npm run seed
```

## Notes

- The README says the frontend should use `VITE_API_BASE_URL=http://localhost:5000/api` locally.
- The backend reads env vars from [`server/.env`](server/.env).
- Seeded admin credentials in the README are:
  - Email: `admin@cafirm.com`
  - Password: `Admin@12345`
