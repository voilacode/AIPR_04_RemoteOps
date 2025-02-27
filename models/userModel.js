const db = require('../config/db');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

class User {
  static async getAllUsers() {
      const [rows] = await db.query('SELECT id, name FROM users');
      return rows;
  }
}

// Register a new user in the database
exports.registerUser = async (
  name,
  phone,
  email,
  password,
  gender,
  location
) => {
  const query =
    'INSERT INTO users (name, phone, email, password, gender, location) VALUES (?, ?, ?, ?, ?, ?)';

  try {
    const [results] = await db.query(query, [
      name,
      phone,
      email,
      password,
      gender,
      location,
    ]);
    return results;
  } catch (err) {
    throw err;
  }
};

// Find user by email
exports.findUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], callback);
};

// Find user by ID
exports.findUserById = async (id, callback) => {
  const query = 'SELECT * FROM users WHERE id = ?';

  try {
    const [results, fields] = await db.query(query, [id]);
    callback(null, results);
  } catch (err) {
    callback(err, null);
  }
};

// Get all users
exports.getAllUsers = async (callback) => {
  const query = 'SELECT * FROM users';
  try {
    const [results, fields] = await db.query(query);
    callback(null, results);
  } catch (err) {
    callback(err, null);
  }
};

// Get user by email with async/await
exports.getUserByEmail = async (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  try {
    const [results, fields] = await db.query(query, [email]);

    // Check if user exists
    if (results.length > 0) {
      callback(null, results[0]);
    } else {
      callback(null, null);
    }
  } catch (err) {
    callback(err, null);
  }
};
