require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');


const db = require('./models/db');
const rezerwacjeRoutes = require('./routes/rezerwacje');

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); 


app.use(session({
    secret: process.env.SESSION_SECRET || 'studencki_sekret',
    resave: false,
    saveUninitialized: true
}));


app.use('/api/rezerwacje', rezerwacjeRoutes);

app.post('/api/register', async (req, res, next) => {
    try {
        const { imie, email, haslo } = req.body;
        
        if (!imie || !email || !haslo || haslo.length < 6) {
            return res.status(400).json({ success: false, message: 'Niepoprawne dane' });
        }

        const hashedHaslo = await bcrypt.hash(haslo, 10);
        db.execute('INSERT INTO uzytkownicy (imie, email, haslo) VALUES (?, ?, ?)', [imie, email, hashedHaslo], (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ success: false, message: 'Ten email jest już zajęty' });
                }
                return next(err);
            }
            res.json({ success: true });
        });
    } catch (error) {
        next(error);
    }
});

app.post('/api/login', (req, res, next) => {
    try {
        const { email, haslo } = req.body;
        db.execute('SELECT * FROM uzytkownicy WHERE email = ?', [email], async (err, results) => {
            if (err) return next(err);
            
            if (results.length > 0) {
                const user = results[0];
                if (await bcrypt.compare(haslo, user.haslo)) {
                    req.session.userId = user.id;
                    req.session.userImie = user.imie;
                    return res.json({ success: true, imie: user.imie });
                }
            }
            res.status(401).json({ success: false, message: 'Błędny email lub hasło' });
        });
    } catch (error) {
        next(error);
    }
});


app.get('/api/status', (req, res) => {
    res.json(req.session.userId ? { loggedIn: true, imie: req.session.userImie } : { loggedIn: false });
});


app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

app.use((err, req, res, next) => {
    console.error("Wystąpił błąd na serwerze:", err.stack);
    res.status(500).json({ error: 'Wewnętrzny błąd serwera' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});