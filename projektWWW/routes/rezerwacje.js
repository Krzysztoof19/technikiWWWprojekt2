const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Brak autoryzacji' });
    db.execute('SELECT * FROM rezerwacje WHERE user_id = ?', [req.session.userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Błąd bazy' });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { typ_treningu, data_treningu } = req.body;
    db.execute('INSERT INTO rezerwacje (user_id, typ_treningu, data_treningu) VALUES (?, ?, ?)', 
    [req.session.userId, typ_treningu, data_treningu], (err, result) => {
        if (err) return res.status(500).json({ error: 'Błąd zapisu' });
        res.json({ success: true, id: result.insertId });
    });
});

router.put('/:id', (req, res, next) => {
    try {
        if (!req.session.userId) return res.status(401).json({ error: 'Brak autoryzacji' });
        
        const { data_treningu } = req.body;

        const dateCheck = new Date(data_treningu);
        if (isNaN(dateCheck.getTime())) {
            return res.status(400).json({ success: false, message: 'Nieprawidłowy format daty!' });
        }

        db.execute('UPDATE rezerwacje SET data_treningu = ? WHERE id = ? AND user_id = ?', 
        [data_treningu, req.params.id, req.session.userId], (err) => {
            if (err) return next(err);
            res.json({ success: true });
        });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', (req, res) => {
    db.execute('DELETE FROM rezerwacje WHERE id = ? AND user_id = ?', 
    [req.params.id, req.session.userId], (err) => {
        if (err) return res.status(500).json({ error: 'Błąd usuwania' });
        res.json({ success: true });
    });
});

module.exports = router;