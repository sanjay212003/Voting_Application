const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/', (req, res) => {
    if (!req.session.admin_id) {
        return res.redirect('/');
    }

    db.query('SELECT Candidates.name, Candidates.party, COUNT(Votes.candidate_id) AS vote_count FROM candidates LEFT JOIN votes ON Votes.candidate_id = Candidates.candidate_id GROUP BY candidates.candidate_id ORDER BY vote_count DESC', (err, results) => {
        if (err) throw err;

        // Find the candidate with the maximum vote count
        const maxVoteCandidate = results.length > 0 ? results[0] : null;

        res.render('stats', { results, maxVoteCandidate });
    });
});

module.exports = router;
