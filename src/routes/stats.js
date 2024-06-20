const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/', (req, res) => {
    if (!req.session.admin_id) {
        return res.redirect('/');
    }

    db.query('SELECT Candidates.name, COUNT(Votes.candidate_id) AS vote_count FROM Votes JOIN Candidates ON Votes.candidate_id = Candidates.candidate_id GROUP BY Votes.candidate_id', (err, results) => {
        if (err) throw err;
        res.render('stats', { results });
    });
});

module.exports = router;
