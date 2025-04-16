import { addUser, getUserByEmail, validateUser } from '../models/userModels.js';

export function showRegister(req, res) {
  if (req.session.userId) return res.redirect('/jobs');
  res.render('register', { title: 'Register', error: null });
}

export function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.render('register', { title: 'Register', error: 'All fields are required.' });
  }
  if (getUserByEmail(email)) {
    return res.render('register', { title: 'Register', error: 'Email already registered.' });
  }
  addUser({ name, email, password });
  res.redirect('/login');
}

export function showLogin(req, res) {
  if (req.session.userId) return res.redirect('/jobs');
  res.render('login', { title: 'Login', error: null });
}

export function login(req, res) {
  const { email, password } = req.body;
  const user = validateUser(email, password);
  if (!user) {
    return res.render('login', { title: 'Login', error: 'Invalid email or password.' });
  }
  req.session.userId = user.id;
  req.session.userName = user.name;
  res.cookie('lastVisit', new Date().toLocaleString(), { maxAge: 365 * 24 * 60 * 60 * 1000 });
  res.redirect('/jobs');
}

export function logout(req, res) {
  req.session.destroy(() => {
    res.redirect('/login');
  });
}