const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

router.get("/", ensureAuthenticated, projectController.getProjects);
router.get("/create", ensureAuthenticated, projectController.getCreatePage);
router.post("/create", ensureAuthenticated, projectController.createProject);
router.get("/edit/:id", ensureAuthenticated, projectController.getEditPage);
router.post("/edit/:id", ensureAuthenticated, projectController.updateProject);
router.post("/delete/:id", ensureAuthenticated, projectController.deleteProject);

module.exports = router;