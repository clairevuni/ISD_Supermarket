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

/*router.get('/menu', (req, res) => {
  const filePath = path.join(__dirname, 'HTML', 'menu.html');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send(data);
    }
  });
});*/



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
        // Successful login
        // Creare un token JWT utilizzando l'ID dell'utente come parte dei dati da firmare
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

  // Verificare il token nell'header della richiesta
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).send('Token mancante');
  }

  // Verificare e decodificare il token
  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {  // Rimuovi il "Bearer" dal token
    if (err) {
      return res.status(401).send('Token non valido');
    }

    // L'utente è autenticato, puoi procedere con la risposta personalizzata
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

function generateProductListHTML(products) {
  let productListHTML = '';

  products.forEach(product => {
    productListHTML += `<div class="cart-item">
                          <p>Nome: ${product.name}</p>
                          <p>Quantità: ${product.quantity}</p>
                          <p>Prezzo: ${product.price}</p>
                        </div>`;
  });

  return productListHTML;
}

router.get('/carrello', (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Token mancante' });
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token non valido' });
    }

    const userId = decoded.username;
    const query = 'SELECT * FROM user_cart WHERE user_username = ?';

    db.all(query, [userId], (dbErr, rows) => {
      if (dbErr) {
        console.error(dbErr);
        return res.status(500).json({ error: 'Internal Server Error!!!' });
      }

      const userMessage = `Benvenuto nel carrello, ${userId || 'Visitatore'}!`;
      const productListHTML = generateProductListHTML(rows);

      // Restituisci solo i dati JSON senza HTML
      res.status(200).send({
        message: userMessage,
        products: rows,
        productListHTML: productListHTML
      });
    });
  });
});


// Funzione per generare l'HTML della lista dei prodotti





/*router.get('/carrello', (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).send('Token mancante');
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send('Token non valido');
    }

    // Esegui le operazioni specifiche del carrello e restituisci la risposta al server principale
    const filePath = path.join(__dirname, 'HTML', 'carrello.html');
    fs.readFile(filePath, 'utf8', (readErr, data) => {
      if (readErr) {
        console.error(readErr);
        return res.status(500).send('Internal Server Error');
      }

      // Personalizza la risposta in base all'utente autenticato
      const userMessage = `Benvenuto nel carrello, ${decoded.username || 'Visitatore'}!`;
      const renderedHTML = data.replace('<!--#carrello-message-->', userMessage);

      res.status(200).send(renderedHTML);
    });
  });
});*/


router.post('/aggiungi-al-carrello', (req, res)=>{
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).send('Token mancante');
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send('Token non valido');
    }
  const userId = decoded.username; // ID dell'utente autenticato
  const productId = req.body.productId; // ID del prodotto da aggiungere al carrello
  console.log(userId, "\n", productId);

    // Esempio di query per inserire il prodotto nel carrello
    db.run('INSERT INTO user_cart (user_username, external_product_id, quantity) VALUES (?, ?, 1)', [userId, productId], function(err) {
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
    // Azioni di logout necessarie
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error!!' });
  }
});

module.exports = router;
