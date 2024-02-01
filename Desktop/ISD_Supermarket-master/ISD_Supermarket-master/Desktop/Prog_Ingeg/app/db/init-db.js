const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Creazione o apertura del database SQLite
const db = new sqlite3.Database('users.db');

// Funzione per eseguire le query in modo sequenziale
const runSequentialQueries = (queries) => {
  if (queries.length === 0) {
    console.log('Database initialized successfully.');
    // Chiudi la connessione al database dopo l'inizializzazione
    db.close();
    return;
  }

  const query = queries.shift();
  db.run(query, (err) => {
    if (err) {
      console.error('Error executing query:', err);
      db.close(); // Chiudi la connessione in caso di errore
    } else {
      runSequentialQueries(queries); // Esegui la prossima query
    }
  });
};

// Funzione per inizializzare il database
const initDb = () => {
  const initDbScript = fs.readFileSync(path.join(__dirname, 'init-db.sql'), 'utf8');
  const queries = initDbScript.split(';').filter(query => query.trim() !== '');

  // Rimuovi eventuali spazi vuoti nelle query
  const trimmedQueries = queries.map(query => query.trim());

  // Esegui le query in modo sequenziale
  runSequentialQueries(trimmedQueries);
};

// Esegui l'inizializzazione del database
initDb();
