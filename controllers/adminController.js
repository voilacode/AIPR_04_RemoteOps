const db = require("../config/db");
const userModel = require('../models/userModel');

exports.getUsersWithTasks = async (req, res) => {
  if (req.session.user.role === 'user') {
    return res.redirect('/');
  }

  try {
    const [users] = await db.query(`
      SELECT users.id, users.name, users.email, users.role, 
             projects.id AS project_id, projects.title AS project_name,
             tasks.id AS task_id, tasks.title AS task_name, tasks.status
      FROM users
      LEFT JOIN tasks ON users.id = tasks.user_id
      LEFT JOIN projects ON tasks.project_id = projects.id
      ORDER BY users.id, projects.id, tasks.id
    `);

    const userMap = new Map();

    users.forEach(row => {
      if (!userMap.has(row.id)) {
        userMap.set(row.id, {
          id: row.id,
          name: row.name,
          email: row.email,
          role: row.role,
          projects: new Map(),
          standaloneTasks: []
        });
      }

      const userData = userMap.get(row.id);

      if (row.project_id) {
        if (!userData.projects.has(row.project_id)) {
          userData.projects.set(row.project_id, {
            id: row.project_id,
            name: row.project_name,
            tasks: []
          });
        }
        if (row.task_id) {
          userData.projects.get(row.project_id).tasks.push({
            id: row.task_id,
            name: row.task_name,
            status: row.status
          });
        }
      } else if (row.task_id) {
        userData.standaloneTasks.push({
          id: row.task_id,
          name: row.task_name,
          status: row.status
        });
      }
    });

    res.render("users", { users: Array.from(userMap.values()), user: req.session.user });
  } catch (err) {
    console.error("Error fetching users with tasks:", err);
    res.status(500).send("Error fetching users with tasks");
  }
};