import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';
import expressLayouts from 'express-ejs-layouts';

import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicantRoutes from './routes/applicantRoutes.js';

dotenv.config();

const app = express();

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));
app.set('layout', 'layout');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(expressLayouts);
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Static files
app.use(express.static(path.join(process.cwd(), 'public')));

// Pass user info and last visit to all views
app.use((req, res, next) => {
  res.locals.userName = req.session.userName;
  res.locals.userId = req.session.userId;
  res.locals.lastVisit = req.cookies.lastVisit;
  next();
});

// Optional: Landing page
app.get('/', (req, res) => res.render('index', { title: 'Home' }));

// Routes
app.use('/', authRoutes);
app.use('/jobs', jobRoutes);
app.use('/jobs/:id/applicants', applicantRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));