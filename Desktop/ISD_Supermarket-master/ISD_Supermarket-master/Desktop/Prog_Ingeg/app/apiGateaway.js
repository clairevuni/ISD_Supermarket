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

// Forward requests to the respective microservices based on the endpoint

// Users Microservice
app.use('/users', usersMicroservice);

// Supermarkets Microservice
app.use('/supermarkets', supermarketsMicroservice);

// Products Microservice
//app.use('/products', productsMicroservice);

app.listen(PORT, () => {
  console.log(`API Gateway running at http://localhost:${PORT}/`);
});
