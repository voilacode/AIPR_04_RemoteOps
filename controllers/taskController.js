const db = require("../config/db");

// Fetch tasks and render the index page
exports.getTasks = async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM tasks");  // Use `await`
        res.render("index", { tasks: results, user: req.session.user });
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).send("Error fetching tasks");
    }
};

exports.showCreateForm = (req, res) => {
    res.render("create", { csrfToken: req.csrfToken(), user: req.session.user });
};

exports.createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        await db.query("INSERT INTO tasks (title, description, status) VALUES (?, ?, 'New')", [title, description]);  // Use `await`
        res.redirect("/");
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).send("Error creating task");
    }
};

exports.updateTaskStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        if (!id || !status) {
            return res.status(400).json({ error: "Invalid data" });
        }

        const [result] = await db.query("UPDATE tasks SET status = ? WHERE id = ?", [status, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json({ message: "Task updated successfully" });
    } catch (err) {
        console.error("Error updating task status:", err);
        res.status(500).json({ error: "Database update failed" });
    }
};

exports.editTaskForm = async (req, res) => {
    try {
        const [task] = await db.query("SELECT * FROM tasks WHERE id = ?", [req.params.id]);
        if (task.length === 0) {
            return res.status(404).send("Task not found");
        }
        res.render('edit', { task: task[0], csrfToken: req.csrfToken(), user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching task details");
    }
};

exports.editTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const taskId = req.params.id;

        await db.query("UPDATE tasks SET title = ?, description = ? WHERE id = ?", [title, description, taskId]);

        res.redirect('/');  
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating task");
    }
}
