import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import adminServiceRoutes from './routes/adminServiceRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import adminTeamRoutes from './routes/adminTeamRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import adminBlogRoutes from './routes/adminBlogRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminContactRoutes from './routes/adminContactRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import adminAchievementRoutes from './routes/adminAchievementRoutes.js';
import sitePageRoutes from './routes/sitePageRoutes.js';
import adminSitePageRoutes from './routes/adminSitePageRoutes.js';
import {
  aboutAdminRouter,
  careersAdminRouter,
  galleryAdminRouter,
  privacyPolicyAdminRouter,
  contactPageAdminRouter
} from './routes/adminPageAliasRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const app = express();
app.set('trust proxy', 1);

const allowedOrigins = [
  'https://frontend-ava-b60g.onrender.com',
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });
const uploadLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });
const chatbotLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());
app.use('/uploads', express.static(resolve(__dirname, '../uploads')));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/admin/services', adminServiceRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/admin/team', adminTeamRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin/blogs', adminBlogRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/admin/achievements', adminAchievementRoutes);
app.use('/api/site-pages', sitePageRoutes);
app.use('/api/admin/site-pages', adminSitePageRoutes);
app.use('/api/admin/about', aboutAdminRouter);
app.use('/api/admin/careers', careersAdminRouter);
app.use('/api/admin/gallery', galleryAdminRouter);
app.use('/api/admin/privacy-policy', privacyPolicyAdminRouter);
app.use('/api/admin/contact-page', contactPageAdminRouter);
app.use('/api/contact', contactLimiter, contactRoutes);
app.use('/api/admin/contact', adminContactRoutes);
app.use('/api/uploads', uploadLimiter, uploadRoutes);
app.use('/api', mediaRoutes);
app.use('/api/chat', chatbotLimiter, chatbotRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
