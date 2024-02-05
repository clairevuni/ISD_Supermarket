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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'uominiseksi', resave: true, saveUninitialized: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
const jwt = require('jsonwebtoken');
const { createSecretKey } = require('crypto');
const db = new sqlite3.Database('users.db');
const dbFolderPath = path.join(__dirname, 'db');
const usersDbPath = path.join(dbFolderPath, 'users.db');
const secretKey = 'uominiseksi';
const router = express.Router();

const initDb = () => {
  const initDbScript = fs.readFileSync(path.join(__dirname, 'db', 'init-db.sql'), 'utf8');

  db.run(initDbScript, function (err) {
    if (err) {
      console.error('Error initializing database:', err);
    } else {
      console.log('Database initialized successfully.');
    }
  });
};

initDb();




router.get('/login', (req, res) => {
  const filePath = path.join(__dirname, 'HTML', 'index.html');
  res.sendFile(filePath);
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';

  db.get(query, [username], (err, row) => {
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
        const userId = row.id;
        const username = req.body.username;
        const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', redirect: '/welcome', token, username });
      } else {
        res.status(401).send('Authentication Failed');
      }
    });
  });
});

router.get('/register', (req, res) => {
  const filePath = path.join(__dirname, 'HTML', 'register.html');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send(data);
    }
  });
});

router.post('/register', [
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

    const checkUserQuery = 'SELECT * FROM users WHERE username = ?';

    db.get(checkUserQuery, [username], (err, existingUser) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      } else if (existingUser) {
        return res.status(400).send('Username already exists');
      } else {
        const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
        const hash = bcrypt.hashSync(password, 10);

        db.run(insertUserQuery, [username, hash], insertErr => {
          if (insertErr) {
            console.error(insertErr);
            return res.status(500).send('Internal Server Error');
          } else {
            const redirectUrl = '/login';
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

router.get('/welcome', (req, res) => {
  const { username } = req.query;
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).send('Token mancante');
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => { 
    if (err) {
      return res.status(401).send('Token non valido');
    }

    const filePath = path.join(__dirname, 'HTML', 'welcome.html');
    fs.readFile(filePath, 'utf8', (readErr, data) => {
      if (readErr) {
        console.error(readErr);
        return res.status(500).send('Internal Server Error');
      }

      const welcomeMessage = `Welcome, ${decoded.username || 'Guest'}!`;
      const renderedHTML = data.replace('<!--#welcome-message-->', welcomeMessage);

      const userWelcomeMessage = decoded.username
        ? `Welcome, ${decoded.username}! What we are doing today?`
        : 'Welcome, Guest!';
      const userRenderedHTML = renderedHTML.replace('<!--#welcome-user-->', userWelcomeMessage);

      res.status(200).send(userRenderedHTML);
    });
  });
});

// Modifica il microservizio
router.get('/carrello', (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).send('<p>Error: Token mancante</p>');
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send('<p>Error: Token non valido</p>');
    }

    const userId = decoded.username;
    const query = 'SELECT * FROM user_cart WHERE user_username = ?';

    db.all(query, [userId], (dbErr, rows) => {
      if (dbErr) {
        console.error(dbErr);
        return res.status(500).send('<p>Error: Internal Server Error!!!</p>');
      }

      const userMessage = `Benvenuto nel carrello, ${userId || 'Visitatore'}!`;
      const productListHTML = generateProductListHTML(rows);

      // Invia direttamente l'HTML come risposta
      const html = `
        <html>
          <head>
            <!-- Eventuali intestazioni -->
          </head>
          <body>
            <div>${userMessage}</div>
            ${productListHTML}
          </body>
        </html>
      `;
      res.status(200).send(html);
    });
  });
});

// Aggiungi la funzione per generare HTML dal risultato del database
function generateProductListHTML(products) {
  let html = '<div id="cartContainer">';

  if (Array.isArray(products) && products.length > 0) {
    products.forEach(product => {
      html += `
        <div class="product">
          <h2>${product.productName}</h2>
          <p>Id del Prodotto: ${product.external_product_id}</p>
          <p>Quantità: ${product.quantity}</p>
        </div>
      `;
    });
  } else {
    html += '<p>Nessun prodotto nel carrello.</p>';
  }

  html += '</div>';
  return html;
}







router.post('/aggiungi-al-carrello', (req, res)=>{
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).send('Token mancante');
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send('Token non valido');
    }
  const userId = decoded.username; 
  const productId = req.body.productId; 
  const productName = req.body.name;
  console.log(userId, "\n", productId, "\n", productName);

    db.run('INSERT INTO user_cart (user_username, external_product_id, quantity, productName) VALUES (?, ?, 1, ?)', [userId, productId, productName], function(err) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore durante l\'aggiunta al carrello' });
      } else {
        res.status(200).json({ message: 'Prodotto aggiunto al carrello con successo' });
      }
    });
  });

});

router.get('/supermercato', (req, res) => {
  const filePath = path.join(__dirname, 'HTML', 'supermercato.html');
  res.sendFile(filePath);
});


router.get('/logout', (req, res) => {
  try {
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error!!' });
  }
});

module.exports = router;
