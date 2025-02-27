const express = require('express');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const adminController = require('../controllers/adminController');
const router = express.Router();

// Route to render the registration page
router.get('/register', (req, res) => {
  const error = req.query.error || null; 
  res.render('register', { error, csrfToken: req.csrfToken() });
});

// Route to handle user registration
router.post('/register', authController.registerUser);

// Route to render the login page
router.get('/login', (req, res) => {
  const error = req.query.error || null; 
  res.render('login', { error, csrfToken: req.csrfToken() });
});

// Route to handle user login
router.post('/login', authController.loginUser);

// Route to log out the user
router.get('/logout', authController.logout);

// Route to render the profile page for authenticated users
router.get('/profile', ensureAuthenticated, profileController.getProfile);

// Route to render the admin page for authenticated admins
router.get("/admin", ensureAuthenticated, adminController.getUsersWithTasks);

module.exports = router;
