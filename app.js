const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

const app = express();

// Import MySQL database connection
const db = require('./db');

// Use body-parser middleware for parsing URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Use express-session middleware for session management
app.use(session({
    secret: 'sanj@3134', // Set your secret key
    resave: false,
    saveUninitialized: true
}));

// Set the view engine to EJS and specify the 'views' directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Import and use routes
const loginRoute = require('./src/routes/login');
const adminRoute = require('./src/routes/admin');
const voterRoute = require('./src/routes/voter');
const statsRoute = require('./src/routes/stats');

app.use('/', loginRoute); // Use loginRoute for base URL
app.use('/admin', adminRoute); // Use adminRoute for '/admin' URLs
app.use('/voter', voterRoute); // Use voterRoute for '/voter' URLs
app.use('/stats', statsRoute); // Use statsRoute for '/stats' URLs

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server and listen on port 3000
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

module.exports = app;
