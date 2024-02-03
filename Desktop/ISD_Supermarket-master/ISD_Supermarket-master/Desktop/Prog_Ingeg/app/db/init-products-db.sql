CREATE TABLE IF NOT EXISTS supermarket_products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT,
  price REAL,
  description TEXT,
  supermarket_name TEXT NOT NULL
);
