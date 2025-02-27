const db = require("../config/db");

exports.getAllProjects = async () => {
    try {
        const [rows] = await db.query(
            "SELECT projects.*, users.name AS lead_name FROM projects JOIN users ON projects.project_lead = users.id"
        );
        return rows;
    } catch (error) {
        throw error;
    }
};

exports.createProject = async (title, description, project_lead) => {
    try {
        await db.query(
            "INSERT INTO projects (title, description, project_lead) VALUES (?, ?, ?)", 
            [title, description, project_lead]
        );
    } catch (error) {
        throw error;
    }
};

exports.getProjectById = async (id) => {
    try {
        const [rows] = await db.query("SELECT * FROM projects WHERE id = ?", [id]);
        if (rows.length) {
            rows[0].deadline = rows[0].deadline ? rows[0].deadline.toISOString().split("T")[0] : "";
            return rows[0];
        }
        return null;
    } catch (error) {
        throw error;
    }
};

exports.updateProject = async (id, title, description, project_lead, deadline) => {
    try {
        await db.query(
            "UPDATE projects SET title = ?, description = ?, project_lead = ?, deadline = ? WHERE id = ?",
            [title, description, project_lead, deadline, id]
        );
        return true;
    } catch (error) {
        throw error;
    }
};

exports.deleteProject = async (id) => {
    try {
        await db.query("DELETE FROM projects WHERE id = ?", [id]);
        return true;
    } catch (error) {
        throw error;
    }
};
