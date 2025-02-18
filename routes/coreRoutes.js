const express = require('express');
const router = express.Router();
const coreController = require('../controllers/coreController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

// Route to render the homepage for authenticated users
// router.get('/', ensureAuthenticated, coreController.getIndex);

module.exports = router;
