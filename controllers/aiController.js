const aiModel = require('../models/aiModel');
const db = require("../config/db");

exports.getAIApp = (req, res) => {
  const user = req.session.user;  
  res.render('aiapp', { user, content: '' });
};

exports.askBot = async (req, res) => {
    try {
        const { prompt } = req.body;
        let sql = "";
        let content = "I don't understand your query.";

        if (prompt.toLowerCase().includes("ongoing projects")) {
            sql = "SELECT COUNT(*) AS count FROM projects";
        } else if (prompt.toLowerCase().includes("total tasks")) {
          sql = "SELECT COUNT(*) AS count FROM tasks";
        } else if (prompt.toLowerCase().includes("rejected tasks")) {
            sql = "SELECT COUNT(*) AS count FROM tasks WHERE status = 'Rejected'";
        } else if (prompt.toLowerCase().includes("completed tasks")) {
            sql = "SELECT COUNT(*) AS count FROM tasks WHERE status = 'Completed'";
        } else if (prompt.toLowerCase().includes("total users")) {
            sql = "SELECT COUNT(*) AS count FROM users";
        } else if (prompt.toLowerCase().includes("tasks assigned to")) {
            sql = "SELECT users.name, tasks.title FROM tasks JOIN users ON tasks.user_id = users.id";
        } else if (prompt.toLowerCase().includes("pending tasks")) {
            sql = "SELECT COUNT(*) AS count FROM tasks WHERE status = 'Pending'";
        } else if (prompt.toLowerCase().includes("latest project")) {
            sql = "SELECT name FROM projects ORDER BY created_at DESC LIMIT 1";
        } else if (prompt.toLowerCase().includes("highest priority task")) {
            sql = "SELECT title FROM tasks ORDER BY priority DESC LIMIT 1";
        } else if (prompt.toLowerCase().includes("oldest user")) {
            sql = "SELECT name FROM users ORDER BY created_at ASC LIMIT 1";
        } else if (prompt.toLowerCase().includes("total users")) {
          sql = "SELECT count(*) as count FROM users";
      }

        if (sql) {
            const [results] = await db.query(sql);
            if (results.length === 0) {
                content = "Empty set";
            } else {
                if (results[0].count !== undefined) {
                    content = `Result: ${results[0].count}`;
                } else {
                    content = Object.values(results[0]).join(", ");
                }
            }
        }

        res.render("aiapp", { csrfToken: req.csrfToken(), content, user: req.session.user });

    } catch (err) {
        console.error("Error in bot:", err);
        res.status(500).send("Error processing query");
    }
};
