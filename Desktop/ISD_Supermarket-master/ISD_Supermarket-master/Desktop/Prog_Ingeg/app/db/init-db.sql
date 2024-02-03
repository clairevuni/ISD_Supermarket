-- Modifica il tuo file init-db.sql

-- Crea la tabella degli utenti se non esiste
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT
);

-- Crea la tabella del carrello se non esiste
CREATE TABLE IF NOT EXISTS user_cart (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Inserisci utenti di esempio
INSERT INTO users (username, password) VALUES
  ('admin', '$2b$10$Tu4kD4Vgub.D78gJnNVvrO4weM/kf9Fp6x/B4eKqSFRifp67GADfa'), -- Password: admin
  ('user1', '$2b$10$Tu4kD4Vgub.D78gJnNVvrO4weM/kf9Fp6x/B4eKqSFRifp67GADfa'), -- Password: password1
  ('user2', '$2b$10$Tu4kD4Vgub.D78gJnNVvrO4weM/kf9Fp6x/B4eKqSFRifp67GADfa'); -- Password: password2
