use strict;
use warnings;
use DBI;

# Connessione al database
my $dbh = DBI->connect("dbi:SQLite:dbname=users.db", "", "", { RaiseError => 1, AutoCommit => 1 });

# Creazione della tabella degli utenti
my $create_table_sql = q{
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT
    )
};

$dbh->do($create_table_sql);

# Chiusura della connessione al database
$dbh->disconnect;
