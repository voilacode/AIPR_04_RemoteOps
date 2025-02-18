const db = require("../config/db");

class Task {
    static async getAllTasks() {
        const [rows] = await db.query("SELECT * FROM tasks");
        return rows;
    }

    static async createTask(title, description) {
        const [result] = await db.query(
            "INSERT INTO tasks (title, description) VALUES (?, ?)",
            [title, description]
        );
        return result.insertId;
    }

    static async updateTaskStatus(id, status) {
        await db.query("UPDATE tasks SET status = ? WHERE id = ?", [status, id]);
    }
}

module.exports = Task;
