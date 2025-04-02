const db = require("../config/db");
const AIService = require("../services/aiService");

exports.getTasks = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT tasks.id, tasks.title, tasks.description, tasks.status, tasks.deadline, tasks.project_id, 
                   projects.title AS project_name, users.name AS user_name 
            FROM tasks 
            LEFT JOIN projects ON tasks.project_id = projects.id
            LEFT JOIN users ON tasks.user_id = users.id
        `);

        res.render("index", { tasks: results, user: req.session.user, csrfToken: req.csrfToken() });
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).send("Error fetching tasks");
    }
};

exports.showCreateForm = async (req, res) => {
    try {
        const [projects] = await db.query("SELECT * FROM projects");
        const [users] = await db.query("SELECT id, name FROM users");
        res.render("create", { csrfToken: req.csrfToken(), user: req.session.user, projects, users });
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).send("Error fetching data");
    }
};

exports.createTask = async (req, res) => {
    try {
        const { title, description, project_id, user_id, deadline, dependencies } = req.body;

        // AI-powered task priority suggestion
        const priority = await AIService.suggestPriority(deadline, dependencies);

        await db.query(
            "INSERT INTO tasks (title, description, status, project_id, user_id, deadline, priority) VALUES (?, ?, DEFAULT, ?, ?, ?, ?)",
            [title, description, project_id, user_id, deadline, priority]
        );

        res.redirect("/");
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).send("Error creating task");
    }
};

exports.editTask = async (req, res) => {
    try {
        const { title, description, project_id, user_id, deadline, dependencies } = req.body;
        const taskId = req.params.id;

        // AI-based deadline optimization
        const adjustedDeadline = await AIService.recommendDeadline(deadline, dependencies);

        await db.query(
            "UPDATE tasks SET title = ?, description = ?, project_id = ?, deadline = ?, user_id = ?, adjusted_deadline = ? WHERE id = ?",
            [title, description, project_id, deadline, user_id, adjustedDeadline, taskId]
        );

        res.redirect('/');
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).send("Error updating task");
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

exports.optimizeTasks = async (req, res) => {
    try {
        const [tasks] = await db.query(`
            SELECT tasks.id, tasks.title, tasks.description, tasks.deadline, 
                   projects.title AS project_name, users.name AS user_name 
            FROM tasks 
            LEFT JOIN projects ON tasks.project_id = projects.id
            LEFT JOIN users ON tasks.user_id = users.id
        `);

        // Optimize tasks using AI Service
        const optimizedTasks = await Promise.all(
            tasks.map(async (task) => {
                const priority = await AIService.suggestPriority(task.deadline, []);
                const adjusted_deadline = await AIService.recommendDeadline(task.deadline, []);
                return {
                    ...task,
                    priority,
                    adjusted_deadline,
                };
            })
        );

        res.render("optimized", { tasks: optimizedTasks, user: req.session.user });
    } catch (err) {
        console.error("Error optimizing tasks:", err);
        res.status(500).send("Error optimizing tasks");
    }
};


exports.editTaskForm = async (req, res) => {
    try {
        const [task] = await db.query("SELECT * FROM tasks WHERE id = ?", [req.params.id]);
        const [users] = await db.query("SELECT id, name FROM users");
        if (task.length === 0) {
            return res.status(404).send("Task not found");
        }

        const [projects] = await db.query("SELECT * FROM projects");

        // Format the deadline properly
        task[0].deadline = task[0].deadline ? task[0].deadline.toISOString().split('T')[0] : '';

        res.render("edit", { task: task[0], csrfToken: req.csrfToken(), user: req.session.user, projects, users });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching task details");
    }
};