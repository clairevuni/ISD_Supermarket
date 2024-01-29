const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database('supermarkets.db');

// Crea la tabella dei supermercati se non esiste
db.run(`
  CREATE TABLE IF NOT EXISTS supermarkets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    username TEXT UNIQUE,
    password TEXT
  )
`);

// Pagina di login Supermercato
app.get('/login-supermarket', (req, res) => {
  res.sendFile(__dirname + '/login-supermarket.html');
});

// Gestione del login Supermercato
app.post('/login-supermarket', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM supermarkets WHERE username = ?';

  db.get(query, [username], (err, row) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    } else if (row) {
      bcrypt.compare(password, row.password, (bcryptErr, bcryptResult) => {
        if (bcryptErr) {
          return res.status(500).send('Internal Server Error');
        } else if (bcryptResult) {
          // Autenticazione riuscita, reindirizza all'area riservata del supermercato
          res.redirect(`/supermarket/${row.id}`);
        } else {
          return res.status(401).send('Authentication Failed');
        }
      });
    } else {
      return res.status(401).send('Authentication Failed');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
