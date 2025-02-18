const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.get("/", taskController.getTasks);
router.get("/create", taskController.showCreateForm);
router.post("/create", taskController.createTask);
router.post("/update", taskController.updateTaskStatus); // Add this route
router.get("/edit/:id", taskController.editTaskForm);
router.post("/edit/:id", taskController.editTask);

module.exports = router;
