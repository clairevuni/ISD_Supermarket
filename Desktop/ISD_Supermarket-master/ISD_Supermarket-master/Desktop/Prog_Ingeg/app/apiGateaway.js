const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const usersMicroservice = require('./usersMicroservice');
const supermarketsMicroservice = require('./supermarketsMicroservice');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// route microservizio utenti
app.use('/users', usersMicroservice);

// route microservizio supermercati
app.use('/supermarkets', supermarketsMicroservice);

app.listen(PORT, () => {
  console.log(`API Gateway running at http://localhost:${PORT}/`);
});
