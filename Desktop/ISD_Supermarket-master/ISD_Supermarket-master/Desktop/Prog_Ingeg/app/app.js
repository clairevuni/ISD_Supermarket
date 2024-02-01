const express = require('express');
const axios = require('axios');
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
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.static('public'));
app.use(bodyParser.json());

app.use('/public/*.js', (req, res, next) => {
  res.type('application/javascript');
  next();
});

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

// Users Microservice routes
app.get('/login', (req, res) => {
  // You can call the Users microservice login endpoint through the API Gateway
  axios.get('http://localhost:4000/users/login', {params: req.body})
    .then(response => {
      res.status(response.status).send(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

app.post('/login', (req, res) => {
  // You can call the Users microservice login endpoint through the API Gateway
  const { username, password } = req.body;
  axios.post('http://localhost:4000/users/login', { username, password })
    .then(response => {
      if (response.status === 200) {
        // Ottenere l'URL di reindirizzamento dal microservizio degli utenti
        const redirectUrl = response.data.redirect;        
        res.redirect(redirectUrl);
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error34' });
    });
});

app.get('/welcome', (req, res) => {
  // Extract the username from the query parameters
  const username = req.query.username;

  // Make a GET request to the Users microservice login endpoint through the API Gateway
  axios.get(`http://localhost:4000/users/welcome?username=${username}`)
    .then(response => {
      res.status(response.status).send(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/logout', (req, res) => {
res.redirect('/');
});

app.get('/menu', (req, res) => {
  // You can call the Users microservice login endpoint through the API Gateway
  axios.get('http://localhost:4000/users/menu', req.body)
    .then(response => {
      res.status(response.status).send(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/register', (req, res) => {
  // Serve the registration HTML page
  res.sendFile(__dirname + '/HTML/register.html');
});

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Make sure the registration endpoint is correct
    const registrationEndpoint = 'http://localhost:4000/users/register';

    // Forward the request to the registration endpoint
    const response = await axios.post(registrationEndpoint, { username, password });

    // Check the status and handle the response
    if (response.status === 200) {
      // Registration successful, send a success message
      const redirectUrl = response.data.redirect;
      res.redirect(redirectUrl);
    } else {
      // Check for errors in the response and handle them
      if (response.data.errors && response.data.errors.length > 0) {
        res.status(400).json({ errors: response.data.errors });
      } else {
        // Handle other response statuses or errors if needed
        res.status(response.status).json(response.data);
      }
    }
  } catch (error) {
    // Handle network errors or other issues
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/carrello', (req, res) => {
  // You can call the Users microservice login endpoint through the API Gateway
  axios.get('http://localhost:4000/users/carrello', {params: req.body})
    .then(response => {
      res.status(response.status).send(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/supermercato', (req, res) => {
  // You can call the Users microservice login endpoint through the API Gateway
  axios.get('http://localhost:4000/users/supermercato', {params: req.body})
    .then(response => {
      res.status(response.status).send(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

/*
// Supermarkets Microservice routes
*/

app.get('/login-supermarket', (req, res) => {
  // You can call the Supermarkets microservice supermercato endpoint through the API Gateway
  axios.get('http://localhost:4000/supermarkets/login-supermarket', {params: req.body})
    .then(response => {
      res.status(response.status).send(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

app.post('/login-supermarket', (req, res) => {
  // You can call the Users microservice login endpoint through the API Gateway
  const { username, password } = req.body;
  axios.post('http://localhost:4000/supermarkets/login-supermarket', { username, password })
    .then(response => {
      if (response.status === 200) {
        // Ottenere l'URL di reindirizzamento dal microservizio degli utenti
        const redirectUrl = response.data.redirect;        
        res.redirect(redirectUrl);
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error34' });
    });
});

app.get('/register-supermarket', (req, res) => {
  // You can call the Supermarkets microservice supermercato endpoint through the API Gateway
  axios.get('http://localhost:4000/supermarkets/register-supermarket')
    .then(response => {
      res.status(response.status).send(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

app.post('/register-supermarket', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Make sure the registration endpoint is correct
    const registrationEndpoint = 'http://localhost:4000/supermarkets/register-supermarket';

    // Forward the request to the registration endpoint
    const response = await axios.post(registrationEndpoint, { username, password });

    // Check the status and handle the response
    if (response.status === 200) {
      // Registration successful, send a success message
      const redirectUrl = response.data.redirect;
      res.redirect(redirectUrl);
    } else {
      // Check for errors in the response and handle them
      if (response.data.errors && response.data.errors.length > 0) {
        res.status(400).json({ errors: response.data.errors });
      } else {
        // Handle other response statuses or errors if needed
        res.status(response.status).json(response.data);
      }
    }
  } catch (error) {
    // Handle network errors or other issues
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error1' });
  }
});

app.get('/supermercatoS', (req, res) => {
  // You can call the Users microservice login endpoint through the API Gateway
  
  axios.get('http://localhost:4000/supermarkets/supermercatoS', {params: req.body})
    .then(response => {
      res.status(response.status).send(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error!!');
    });
});




app.get('/supermarket-welcome', (req, res) => {
  // You can call the Supermarkets microservice supermercato endpoint through the API Gateway
  axios.get('http://localhost:4000/supermarkets/supermarket-welcome')
    .then(response => {
      res.status(response.status).send(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

//Products Routes

app.post('/save-product', async (req, res) => {
  try {
    const { productName, productCategory, productPrice, productDescription } = req.body;

    // Inoltra la richiesta al microservizio dei prodotti del supermercato
    const productsMicroserviceEndpoint = 'http://localhost:4000/supermarkets/save-product';
    const response = await axios.post(productsMicroserviceEndpoint, {
      productName,
      productCategory,
      productPrice,
      productDescription,
    });

    // Verifica lo stato e gestisci la risposta
    if (response.status === 200) {
      res.redirect('/supermercatoS'); // Reindirizza l'utente alla pagina di benvenuto del supermercato
    } else {
      res.status(response.status).json(response.data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/get-products', async (req, res) => {
  try {
    // Indirizzo del microservizio dei prodotti
    const productsServiceURL = 'http://localhost:4000/supermarkets/get-products';

    // Effettua una richiesta GET al microservizio dei prodotti
    const response = await axios.get(productsServiceURL);

    // Controlla lo stato della risposta e gestisci la risposta
    if (response.status === 200) {
      // Invia i dati dei prodotti come risposta
      res.status(200).json(response.data);
    } else {
      // Gestisci eventuali errori
      res.status(response.status).json(response.data);
    }
  } catch (error) {
    // Gestisci errori di rete o altri problemi
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Main app running at http://localhost:${PORT}/`);
});


