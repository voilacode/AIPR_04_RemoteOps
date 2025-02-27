const Project = require("../models/projectModel");
const db = require("../config/db");

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.getAllProjects();
        res.render("projects/index", { projects, user: req.session.user });
    } catch (error) {
        res.status(500).send("Error fetching projects");
    }
};

exports.getCreatePage = async (req, res) => {
    try {
        const [users] = await db.query("SELECT id, name FROM users");
        res.render("projects/create", { users, user: req.session.user });
    } catch (error) {
        res.status(500).send("Error fetching users");
    }
};

exports.createProject = async (req, res) => {
    try {
        const { title, description, project_lead } = req.body;
        await Project.createProject(title, description, project_lead);
        res.redirect("/project");
    } catch (error) {
        res.status(500).send("Error creating project");
    }
};

exports.getEditPage = async (req, res) => {
    try {
        const project = await Project.getProjectById(req.params.id);
        if (!project) return res.status(404).send("Project not found");

        const [users] = await db.query("SELECT id, name FROM users");

        res.render("projects/edit", {
            project,
            users,
            user: req.session.user,
            csrfToken: req.csrfToken(),
        });
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).send("Error fetching project");
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { title, description, project_lead, deadline } = req.body;
        await Project.updateProject(req.params.id, title, description, project_lead, deadline);
        res.redirect("/project");
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).send("Error updating project");
    }
};

exports.deleteProject = async (req, res) => {
    try {
        await Project.deleteProject(req.params.id);
        res.redirect("/project");
    } catch (error) {
        res.status(500).send("Error deleting project");
    }
};
