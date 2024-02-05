const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();


const dbPath = path.join(__dirname, 'supermarkets.db');


const db = new sqlite3.Database(dbPath);


const initDbScript = fs.readFileSync(path.join(__dirname, 'init-supermarkets-db.sql'), 'utf8');


db.exec(initDbScript, function (err) {
  if (err) {
    console.error('Error initializing supermarkets database:', err);
  } else {
    console.log('Supermarkets database initialized successfully.');
  }

  db.close();
});
