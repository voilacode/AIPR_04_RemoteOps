const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

router.get('/aiapp', ensureAuthenticated, aiController.getAIApp);
router.post('/aiapp', ensureAuthenticated, aiController.askBot);

module.exports = router;
