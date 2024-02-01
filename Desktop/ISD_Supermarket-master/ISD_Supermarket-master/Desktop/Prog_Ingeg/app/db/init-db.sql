-- init-db.sql

-- Crea la tabella degli utenti se non esiste
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT
);

-- Inserisci utenti di esempio
INSERT INTO users (username, password) VALUES
  ('admin', '$2b$10$Tu4kD4Vgub.D78gJnNVvrO4weM/kf9Fp6x/B4eKqSFRifp67GADfa'), -- Password: admin
  ('user1', '$2b$10$Tu4kD4Vgub.D78gJnNVvrO4weM/kf9Fp6x/B4eKqSFRifp67GADfa'), -- Password: password1
  ('user2', '$2b$10$Tu4kD4Vgub.D78gJnNVvrO4weM/kf9Fp6x/B4eKqSFRifp67GADfa'); -- Password: password2
