# CA Firm Full-Stack Website

Modern full-stack Chartered Accountant firm website with separated frontend and backend.

## Structure

- `frontend/` React 19 + Vite + Tailwind CSS
- `server/` Node.js + Express + MongoDB + Mongoose

## Frontend

- Home, About, Services, Team, Contact, Blog, Blog Detail
- SEO meta tags
- Loading and error states
- Framer Motion animations
- React Router navigation

## Backend

- JWT auth
- REST APIs for services, team, blogs, and contact
- MongoDB schemas
- Protected admin routes

## Environment

Copy the example env files:

- `frontend/.env.example` to `frontend/.env`
- `server/.env.example` to `server/.env`

## Local Run

Backend:

```bash
cd server
npm install
npm run seed
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Admin login seeded by default:

- Email: `test@cafirm.com`
- Password: `test@12345`

## Atlas Seed Command

The backend seed script uses the MongoDB URI from [`server/.env`](C:\Users\t480\OneDrive - Aggaarwal Vikram & Associates\Desktop\js\ca-firm-website\server\.env). With your Atlas connection set, run:

```bash
cd server
npm run seed
```

That will connect to Atlas, clear the seeded collections, create the admin user, and insert sample services, team members, and blogs.

## Backend Route Check

The API is wired for the Atlas database with these routes:

- `POST /api/auth/login`
- `GET /api/services`
- `POST /api/services`
- `PUT /api/services/:id`
- `DELETE /api/services/:id`
- `GET /api/team`
- `POST /api/team`
- `PUT /api/team/:id`
- `DELETE /api/team/:id`
- `GET /api/blogs`
- `GET /api/blogs/:slug`
- `GET /api/blogs/id/:id`
- `POST /api/blogs`
- `PUT /api/blogs/:id`
- `DELETE /api/blogs/:id`
- `POST /api/contact`
- `GET /api/contact`
- `GET /api/home-video`

Protected admin routes require a Bearer token from `POST /api/auth/login`.

## Media Collection

The home hero video is stored in MongoDB in the `media` collection with documents like:

```json
{
  "type": "home_video",
  "videoUrl": "https://res.cloudinary.com/demo/video/upload/sample.mp4"
}
```

The frontend requests it from `GET /api/home-video` and plays it in a `<video>` element with `autoplay`, `muted`, and `loop`.

## Local Deployment Notes

Frontend:

- Set `frontend/.env` with `VITE_API_BASE_URL=http://localhost:5000/api`
- Run `npm run dev` in `frontend/`

Backend:

- Keep the Atlas URI in `server/.env`
- Run `npm run dev` in `server/`

For production deployment, the frontend and backend can be hosted separately with the frontend pointing to the deployed backend API URL through `VITE_API_BASE_URL`.
