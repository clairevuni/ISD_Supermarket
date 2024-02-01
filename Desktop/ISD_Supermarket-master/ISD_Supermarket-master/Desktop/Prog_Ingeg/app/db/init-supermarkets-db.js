const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Percorso del database dei supermercati
const dbPath = path.join(__dirname, 'supermarkets.db');

// Crea una nuova istanza del database
const db = new sqlite3.Database(dbPath);

// Leggi lo script di inizializzazione del database
const initDbScript = fs.readFileSync(path.join(__dirname, 'init-supermarkets-db.sql'), 'utf8');

// Esegui lo script per inizializzare il database
db.exec(initDbScript, function (err) {
  if (err) {
    console.error('Error initializing supermarkets database:', err);
  } else {
    console.log('Supermarkets database initialized successfully.');
  }

  // Chiudi la connessione al database
  db.close();
});
