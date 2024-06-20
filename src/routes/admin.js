const express = require('express');
const router = express.Router();
const db = require('../../db');
const bcrypt = require('bcryptjs');

// Middleware to check if user is authenticated as admin
const authenticateAdmin = (req, res, next) => {
    if (!req.session.admin_id) {
        return res.redirect('/');
    }
    next();
};

// Admin dashboard
router.get('/', authenticateAdmin, (req, res) => {
    res.render('admin');
});

// Register voter
router.post('/register/voter', authenticateAdmin, (req, res) => {
    const { name, password } = req.body;

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert into Voters table
    db.query('INSERT INTO Voters (name, voter_id) VALUES (?, ?)', [name, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error registering voter:', err);
            return res.status(500).send('Internal server error');
        }
        res.redirect('/admin');
    });
});

// Register candidate
router.post('/register/candidate', authenticateAdmin, (req, res) => {
    const { name, party ,age} = req.body;

    // Insert into Candidates table
    db.query('INSERT INTO Candidates (name, party,age) VALUES (?, ?,?)', [name, party,age], (err, result) => {
        if (err) {
            console.error('Error registering candidate:', err);
            return res.status(500).send('Internal server error');
        }
        res.redirect('/admin');
    });
});

module.exports = router;
