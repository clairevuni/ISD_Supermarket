const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const { check, validationResult } = require('express-validator');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
const router = express.Router();

const dbSupermarkets = new sqlite3.Database('supermarkets.db');
const dbFolderPath = path.join(__dirname, 'db');
const spmDbPath = path.join(dbFolderPath, 'supermarkets.db');

const initSupermarketsDb = () => {
  const initSupermarketsDbScript = fs.readFileSync(path.join(__dirname, 'db', 'init-supermarkets-db.sql'), 'utf8');

  dbSupermarkets.run(initSupermarketsDbScript, function (err) {
    if (err) {
      console.error('Error initializing supermarkets database:', err);
    } else {
      console.log('Supermarkets database initialized successfully.');
    }
  });
};

initSupermarketsDb();



router.get('/login-supermarket', (req, res) => {
  const filePath = path.join(__dirname, 'HTML', 'login-supermarket.html');
  res.sendFile(filePath);
});

router.get('/register-supermarket', (req, res) => {
  const filePath = path.join(__dirname, 'HTML', 'register-supermarket.html');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send(data);
    }
  });
});

router.post('/register-supermarket', [
  check('username').notEmpty().withMessage('Username is required'),
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 5 }).withMessage('Password must be at least 5 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter'),
], (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const checkSupermarketQuery = 'SELECT * FROM supermarkets WHERE username = ?';

    dbSupermarkets.get(checkSupermarketQuery, [username], (err, existingSupermarket) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      } else if (existingSupermarket) {
        return res.status(400).send('Supermarket already exists');
      } else {
        const insertSupermarketQuery = 'INSERT INTO supermarkets (username, password) VALUES (?, ?)';
        const hash = bcrypt.hashSync(password, 10);

        dbSupermarkets.run(insertSupermarketQuery, [username, hash], insertErr => {
          if (insertErr) {
            console.error(insertErr);
            return res.status(500).send('Internal Server Error');
          } else {
            const redirectUrl = '/login-supermarket';
            res.status(200).json({ message: 'Registration successful', redirect: redirectUrl });
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/login-supermarket', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM supermarkets WHERE username = ?';

  dbSupermarkets.get(query, [username], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (!row) {
      return res.status(401).send('Authentication Failed: User not found');
    }

    bcrypt.compare(password, row.password, (bcryptErr, bcryptResult) => {
      if (bcryptErr) {
        console.error(bcryptErr);
        return res.status(500).send('Internal Server Error');
      }

      if (bcryptResult) {
        // Successful login
        const redirectUrl = '/supermarket-welcome'; // Indica la pagina di benvenuto
        res.status(200).json({ message: 'Login successful', redirect: redirectUrl, username: username });
      } else {
        res.status(401).send('Authentication Failed');
      }
    });
  });
});

router.get('/supermarket-welcome', (req, res) => {
  const { username } = req.query;
  const filePath = path.join(__dirname, 'HTML', 'supermarket-welcome.html');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

  const welcomeMessage = `Welcome, ${username || 'Supermarket'}!`;
const renderedHTML = data.replace('<!--#welcome-message-->', welcomeMessage);

const userWelcomeMessage = username ? `Welcome, ${username}! What we are doing today?` : 'Welcome, Supermarket!';
const userRenderedHTML = renderedHTML.replace('<!--#welcome-user-->', userWelcomeMessage);

res.status(200).send(userRenderedHTML);
  });
});


const initProductsDb = () => {
  const initProductsDbScript = fs.readFileSync(path.join(__dirname, 'db', 'init-products-db.sql'), 'utf8');

  dbSupermarkets.run(initProductsDbScript, function (err) {
    if (err) {
      console.error('Error initializing products database:', err);
    } else {
      console.log('Products database initialized successfully.');
    }
  });
};
initProductsDb();

router.get('/supermercatoS', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'HTML', 'supermercatoS.html');
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/save-product', (req, res) => {
  const { supermarketName } = req.params;
  const { productName, productCategory, productPrice, productDescription } = req.body;

  const insertProductQuery = 'INSERT INTO supermarket_products (name, category, price, description) VALUES (?, ?, ?, ?)';

  // Inizia la transazione
  dbSupermarkets.run('BEGIN TRANSACTION');

  // Esegui l'inserimento del prodotto
  dbSupermarkets.run(insertProductQuery, [productName, productCategory, productPrice, productDescription], insertErr => {
    if (insertErr) {
      console.error(insertErr);

      // Rollback della transazione in caso di errore
      dbSupermarkets.run('ROLLBACK', rollbackErr => {
        if (rollbackErr) {
          console.error(rollbackErr);
          return res.status(500).json({ error: 'Internal Server Error', details: rollbackErr.message });
        }
        return res.status(500).json({ error: 'Internal Server Error', details: insertErr.message });
      });
    } else {
      // Esegui il commit della transazione solo se non ci sono errori
      dbSupermarkets.run('COMMIT', commitErr => {
        if (commitErr) {
          console.error(commitErr);
          return res.status(500).json({ error: 'Internal Server Error', details: commitErr.message });
        }
        // Invia una risposta di successo
        res.status(200).json({ message: 'Product saved successfully' });
      });
    }
  });
});



router.get('/get-products', (req, res) => {
  const getProductsQuery = 'SELECT * FROM supermarket_products';

  dbSupermarkets.all(getProductsQuery, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    } else {
      // Invia una risposta JSON
      return res.status(200).json(rows);
    }
  });
});

module.exports = router;
