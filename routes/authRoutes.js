import express from 'express';
import {
  showRegister,
  register,
  showLogin,
  login,
  logout
} from '../controllers/userController.js';

const router = express.Router();

router.get('/register', showRegister);
router.post('/register', register);

router.get('/login', showLogin);
router.post('/login', login);

router.post('/logout', logout);

export default router;