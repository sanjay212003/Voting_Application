const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../../db');

// Render login page
router.get('/', (req, res) => {
    res.render('login');
});

// Handle login
router.post('/login', (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).send('All fields are required');
    }

    if (role === 'admin') {
        db.query('SELECT * FROM Admin WHERE username = ?', [username], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.render('message',{message:"INVALID USERNAME OR PASSWORD!!!☠️"});
            }

            if (results.length === 0) {
                res.render('message',{message:"INVALID USERNAME OR PASSWORD!!!☠️"});
            }

            const admin = results[0];
            if (bcrypt.compareSync(password, admin.password)) {
                req.session.admin_id = admin.admin_id;
                res.redirect('/admin');
            } else {
                res.render('message',{message:"INVALID USERNAME OR PASSWORD!!!☠️"});
            }
        });
    } else if (role === 'voter') {
        db.query('SELECT * FROM Voters WHERE name = ?', [username], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Internal server error');
            }

            if (results.length === 0) {
                return res.render('message',{message:"INVALID USERNAME OR PASSWORD🏴‍☠️!!!"})
            }

            const voter = results[0];
            if (!voter.voter_id) {
                console.error('Password not found for user:', username);
                return res.status(500).send('Internal server error');
            }

            if (bcrypt.compareSync(password, voter.voter_id)) {
                req.session.voter_id = voter.voter_id;
                if (voter.has_voted) {
                    res.render('message',{message:"YOU HAVE ALREADY VOTED🤫 !!!"});
                } else {
                    res.redirect('/voter');
                }
            } else {
                res.render('message',{message:"INVALID USERNAME OR PASSWORD!!!"});
            }
        });
    } else {
        res.status(400).send('Invalid role');
    }
});

module.exports = router;
