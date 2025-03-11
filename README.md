# RemoteOps: AI-Powered Workflow Management Hub

## 🚀 Introduction

As remote work becomes the new norm, efficient workflow management is critical for teams to maintain productivity and collaboration. **RemoteOps** is an AI-powered workflow management hub designed to streamline task coordination, enhance team collaboration, and provide actionable insights.

Built using modern technologies such as **Node.js, Express.js, Tailwind CSS, and MySQL**, RemoteOps leverages AI-driven features and real-time data integration to optimize workflows and improve organizational efficiency.

## 🔥 Key Features

- **Task Management:** Create, assign, and track tasks effortlessly through an intuitive interface.
- **AI-Powered Insights:** Intelligent suggestions for task prioritization, resource allocation, and deadline adjustments.
- **Role-Based Access Control:** Secure and customizable user access based on team roles and responsibilities.
- **Performance Analytics:** Real-time data integration to monitor productivity and organizational efficiency.
- **Notification System:** Stay updated on task progress, deadlines, and performance metrics.

## 🎨 Tech Stack

- **Node.js** - Fast and scalable server-side runtime environment.
- **Express.js** - Lightweight and flexible web application framework.
- **Tailwind CSS** - Utility-first CSS framework for modern UI design.
- **MySQL** - Reliable and powerful relational database management system.

## 📊 AI-Driven Functionality

RemoteOps uses advanced AI algorithms to provide actionable insights and optimize workflows by:

- Analyzing team performance and suggesting resource allocation.
- Recommending task prioritization based on deadlines and dependencies.
- Offering deadline adjustments for better time management.

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/voilacode/AIPR_04_RemoteOps.git
   cd AIPR_04_RemoteOps
   ```

### 2️⃣ Setup Database Credentials

```sh
const mysql = require('mysql2');

const db = mysql
  .createPool({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'databasename',
  })
  .promise();

module.exports = db;
```

### 3️⃣ Setup Database

User table

```sh
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    location VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_lead INT,
    deadline datetime,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_lead) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_id INT,
    user_id INT,
    status ENUM('New', 'Ongoing', 'Verification', 'Rejected', 'Completed') DEFAULT 'New',
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

```

Insert default users into tables, the accounts are created with password as 12345

```sh
INSERT INTO users (name, phone, email, password, gender, location, role)
VALUES ('Admin', '1234567890', 'admin@gmail.com', '$2b$10$MN9cI0M2wzY2r8fJ6xazlOqKWgdPGBsNUWEZqtqBcyIb01fXs.WGW', 'male', 'Admin Location', 'admin');

INSERT INTO users (name, phone, email, password, gender, location, role)
VALUES ('User', '1234567890', 'user@gmail.com', '$2b$10$MN9cI0M2wzY2r8fJ6xazlOqKWgdPGBsNUWEZqtqBcyIb01fXs.WGW', 'male', 'User Location', 'user');
```

## Login Details

- **User Account:** email: user@gmail.com, password: 12345
- **Admin Account:** email: admin@gmail.com, password: 12345

### 4️⃣ Run the application by starting the server

```sh
node app.js
```

Open the browser and point the url to http://localhost:3000
