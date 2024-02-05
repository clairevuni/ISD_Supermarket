// authMiddleware.js ->route di autenticazione

const jwt = require('jsonwebtoken');
const axios = require('axios');
const SECRET_KEY = 'your_secret_key';

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('Token is missing');
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send('Token is invalid');
    }

    req.user = decoded;
    next();
  });
}

async function authenticateUser(req, res, next) {
  try {
    const { username } = req.user;
    const userResponse = await axios.get(`http://localhost:4000/users/getUserInfo/${username}`);
    
    if (userResponse.data && userResponse.data.role === 'user') {
      next();
    } else {
      return res.status(403).send('Unauthorized');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}

async function authenticateSupermarket(req, res, next) {
  try {
    const { username } = req.user;
    const supermarketResponse = await axios.get(`http://localhost:4000/supermarkets/getSupermarketInfo/${username}`);
    
    if (supermarketResponse.data && supermarketResponse.data.role === 'supermarket') {
      next();
    } else {
      return res.status(403).send('Unauthorized');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  verifyToken,
  authenticateUser,
  authenticateSupermarket,
};

