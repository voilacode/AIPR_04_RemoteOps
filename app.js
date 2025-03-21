// Import necessary dependencies for the application
const express = require('express'); // Web framework
const session = require('express-session'); // Session management
const bodyParser = require('body-parser'); // Parsing request bodies
const cookieParser = require('cookie-parser'); // Parsing cookies
const csrf = require('csurf'); // CSRF protection
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const aiRoutes = require('./routes/aiRoutes'); // AI routes
const taskRoutes = require('./routes/taskRoutes'); // AI routes
const projectRoutes = require('./routes/projectRoutes'); // AI routes

// Initialize Express app
const app = express();

// Set view engine
app.set('view engine', 'ejs');

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// CSRF protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);
app.use(express.json()); // Ensure the body is being parsed as JSON

app.use((req, res, next) => {
  if (req.path.startsWith("/update")) {
      return next(); // ✅ Bypass CSRF for API routes
  }
  res.locals.csrfToken = req.csrfToken(); // ✅ Pass token to views
  next();
});


// Session setup
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      '3e6166a76a331d65fb41187d070a0dc2d577cf7c755bbdac547aad8d4f7223e3', // Replace with your generated key
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 3600000, // 1 hour
    },
  })
);

// Middleware to make username available to all views
app.use((req, res, next) => {
  res.locals.username = req.session.username || null;
  next();
});

// Middleware to expose CSRF token to all views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Routes
app.use('/', authRoutes);
app.use('/', aiRoutes);
app.use('/', taskRoutes);
app.use('/project', projectRoutes);
app.post('/update-task-status/:id', async (req, res) => {
  try {
      const { status } = req.body;
      const { id } = req.params;
      
      await db.query("UPDATE tasks SET status = ? WHERE id = ?", [status, id]);
      res.json({ success: true });
  } catch (err) {
      console.error("Error updating task status:", err);
      res.status(500).json({ success: false });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
