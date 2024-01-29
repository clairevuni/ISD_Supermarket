const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');  // Aggiunto per gestire il caricamento di file
const upload = multer({ dest: 'uploads/' });  // Cartella di destinazione per i file
const app = express();
const PORT = 3000;

const cors = require('cors');
app.use(cors());

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

const db = new sqlite3.Database('users.db');
const dbSupermarkets = new sqlite3.Database('supermarkets.db');

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

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'HTML', 'menu.html');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send(data);
    }
  });
});

app.get('/login', (req, res) => {
  const filePath = path.join(__dirname, 'HTML', 'index.html');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send(data);
    }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';

  db.get(query, [username], (err, row) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else if (row) {
      bcrypt.compare(password, row.password, (bcryptErr, bcryptResult) => {
        if (bcryptErr) {
          res.status(500).send('Internal Server Error');
        } else if (bcryptResult) {
          res.redirect(`/welcome?username=${username}`);
        } else {
          res.status(401).send('Authentication Failed');
        }
      });
    } else {
      res.status(401).send('Authentication Failed');
    }
  });
});

app.get('/register', (req, res) => {
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

app.post('/register', [
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
            return res.redirect('/login');
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/welcome', (req, res) => {
  const { username } = req.query;
  const filePath = path.join(__dirname, 'HTML', 'welcome.html');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      // Sostituisci il segnaposto nel messaggio di benvenuto con il nome utente
      const welcomeMessage = `Welcome, ${username || 'Guest'}!`;
      const renderedHTML = data.replace('<!--#welcome-message-->', welcomeMessage);

      // Aggiungi il messaggio di benvenuto personalizzato all'utente
      const userWelcomeMessage = username ? `Welcome, ${username}! What we are doing today?` : 'Welcome, Guest!';
      const userRenderedHTML = renderedHTML.replace('<!--#welcome-user-->', userWelcomeMessage);

      res.status(200).send(userRenderedHTML);
    }
  });
});

app.get('/logout', (req, res) => {
  // Distruggi la sessione per effettuare il logout
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      // Reindirizza alla pagina home dopo il logout
      res.redirect('/');
    }
  });
});



app.get('/supermercato', (req, res) => {
  const filePath = path.join(__dirname, 'HTML', 'supermercato.html');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send(data);
    }
  });
});


app.get('/carrello', (req, res) => {
  
});



app.get('/login-supermarket', (req, res) => {
  const filePath = path.join(__dirname, 'HTML', 'login-supermarket.html');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send(data);
    }
  });
});


app.get('/register-supermarket', (req, res) => {
  const filePath = path.join(__dirname, 'HTML', 'register-supermarket.html');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send(data);
    }
  });
});

app.post('/register-supermarket', [
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
            return res.redirect('/login-supermarket');
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/login-supermarket', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM supermarkets WHERE username = ?';

  dbSupermarkets.get(query, [username], (err, row) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else if (row) {
      bcrypt.compare(password, row.password, (bcryptErr, bcryptResult) => {
        if (bcryptErr) {
          res.status(500).send('Internal Server Error');
        } else if (bcryptResult) {
          res.redirect(`/supermarket-welcome?username=${username}`);
        } else {
          res.status(401).send('Authentication Failed');
        }
      });
    } else {
      res.status(401).send('Authentication Failed');
    }
  });
});

app.get('/supermarket-welcome', (req, res) => {
  const filePath = path.join(__dirname, 'HTML', 'supermarket-welcome.html');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send(data);
    }
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


app.post('/save-product', (req, res) => {
  const { productName, productCategory, productImage, productPrice, productDescription } = req.body;

  const insertProductQuery = 'INSERT INTO supermarket_products (name, category, image, price, description) VALUES (?, ?, ?, ?, ?)';

  // Inizia la transazione
  dbSupermarkets.run('BEGIN TRANSACTION');

  dbSupermarkets.run(insertProductQuery, [productName, productCategory, productImage, productPrice, productDescription], insertErr => {
    if (insertErr) {
      console.error(insertErr);

      // Rollback della transazione in caso di errore
      dbSupermarkets.run('ROLLBACK');
      
      return res.status(500).json({ error: 'Internal Server Error', details: insertErr.message });
    } else {
      // Esegui il commit della transazione solo se non ci sono errori
      dbSupermarkets.run('COMMIT');

      // Reindirizza l'utente alla pagina di benvenuto del supermercato dopo aver salvato il prodotto
      return res.redirect('/supermarket-welcome');
    }
  });
});

app.get('/get-products', (req, res) => {
  const getProductsQuery = 'SELECT * FROM supermarket_products';

  dbSupermarkets.all(getProductsQuery, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    } else {
      return res.status(200).json(rows);
    }
  });
});




app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
