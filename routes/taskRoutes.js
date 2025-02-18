const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

router.get("/", ensureAuthenticated, taskController.getTasks);
router.get("/create", ensureAuthenticated, taskController.showCreateForm);
router.post("/create", ensureAuthenticated, taskController.createTask);
router.post("/update", ensureAuthenticated, taskController.updateTaskStatus); 
router.get("/edit/:id", ensureAuthenticated, taskController.editTaskForm);
router.post("/edit/:id", ensureAuthenticated, taskController.editTask);

module.exports = router;
