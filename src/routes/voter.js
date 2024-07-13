const express = require('express');
const router = express.Router();
const db = require('../../db');
const path = require('path');

router.get('/', (req, res) => {
    if (!req.session.voter_id) {
        return res.redirect('/');
    }

    // Query candidates with age greater than 30
    db.query('SELECT * FROM Candidates WHERE age > 30', (err, results) => {
        if (err) throw err;
        res.render('voter', { candidates: results });
    });
});

router.post('/vote', (req, res) => {
    if (!req.session.voter_id) {
        return res.redirect('/');
    }

    const voter_id = req.session.voter_id;
    const candidate_id = req.body.candidate;

    // Check if the candidate is eligible (age > 30)
    db.query('SELECT age FROM Candidates WHERE candidate_id = ?', [candidate_id], (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            return res.status(400).send('Invalid candidate selected.');
        }

        const candidateAge = results[0].age;
        if (candidateAge <= 30) {
            return res.render('message',{message:"CANDIDATE IS NOT ELIGIBLE FOR VOTING!!!"})
        }

        // Proceed with registering the vote
        db.query('INSERT INTO Votes (voter_id, candidate_id) VALUES (?, ?)', [voter_id, candidate_id], (err, result) => {
            if (err) throw err;

            db.query('UPDATE Voters SET has_voted = 1 WHERE voter_id = ?', [voter_id], (err, result) => {
                if (err) throw err;
                res.render('message',{message:"VOTE CASTED SUCCESSFULLY 👍!!!"})
            });
        });
    });
});

module.exports = router;
