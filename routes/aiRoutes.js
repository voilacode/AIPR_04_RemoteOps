const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const AIService = require("../services/aiService");
const db = require("../config/db");

router.get('/aiapp', ensureAuthenticated, aiController.getAIApp);
router.post('/aiapp', ensureAuthenticated, aiController.askBot);

router.post("/recommendation", ensureAuthenticated, async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt is required." });

        const [tasks] = await db.query(`SELECT id, title, deadline, priority FROM tasks`);
        const recommendation = await AIService.getTaskRecommendation(tasks, prompt);
        
        res.json({ recommendation });
    } catch (err) {
        console.error("Error fetching AI recommendation:", err);
        res.status(500).json({ error: "AI failed to generate response." });
    }
});

module.exports = router;