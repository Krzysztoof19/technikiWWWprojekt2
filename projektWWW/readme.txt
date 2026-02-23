Projekt zaliczeniowy z przedmiotu TechnikiWWW. Jest to aplikacja webowa w architekturze Client-Server,
obsługująca stronę szkoły tenisa stołowego. Aplikacja posiada system logowania/rejestracji oraz panel do zarządzania swoimi rezerwacjami treningów.

Zastosowane technologie
- Frontend: HTML, CSS, JavaScript (komunikacja asynchroniczna przez Fetch API)
- Backend: Node.js, Express.js
- Baza danych: MySQL (lokalnie przez XAMPP)
- Użyte pakiety npm: express, mysql2, bcryptjs (hasła), express-session (sesje), dotenv

Struktura projektu
- `/public` - pliki frontendu (widoki HTML, CSS, JS dla klienta, grafiki)
- `/models` - konfiguracja i połączenie z bazą danych
- `/routes` - wydzielone ścieżki (endpointy) API dla rezerwacji
- `server.js` - główny plik serwera i autoryzacja
- `package.json` - konfiguracja projektu i zależności
- `readme.txt` - dokumentacja i instrukcja uruchomienia

Instrukcja uruchomienia

Baza danych
1. Włącz XAMPP i uruchom moduł MySQL.
2. Wejdź do phpMyAdmin (http://localhost/phpmyadmin/).
3. Stwórz bazę danych o nazwie `tenis_szkola`.
4. Wykonaj poniższy kod SQL, aby utworzyć wymagane tabele i relacje:

CREATE TABLE uzytkownicy (
    id INT AUTO_INCREMENT PRIMARY KEY,
    imie VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    haslo VARCHAR(255) NOT NULL
);

CREATE TABLE rezerwacje (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    typ_treningu VARCHAR(100) NOT NULL,
    data_treningu DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES uzytkownicy(id) ON DELETE CASCADE
);

Zmienne środowiskowe (.env)
Ze względów bezpieczeństwa plik `.env` nie jest przesyłany do repozytorium. Aby aplikacja działała poprawnie, należy utworzyć w głównym folderze projektu plik o nazwie `.env`i umieścić w nim
następującą konfigurację:

DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=tenis_szkola
PORT=3000
SESSION_SECRET=bardzo_tajne_haslo

Instalacja i uruchomienie aplikacji
1. Otwórz terminal w głównym folderze projektu.
2. Zainstaluj wszystkie wymagane biblioteki komendą:
npm install

Uruchom serwer aplikacji:
node server.js

Otwórz przeglądarkę i wpisz adres: http://localhost:3000

Obsługa aplikacji
1. Po uruchomieniu serwera zarejestruj nowe konto lub zaloguj się na istniejące.
2. Przejdź do sekcji "Treningi Indywidualne" – tam znajduje się panel zarządzania rezerwacjami.
3. Formularz pod tabelą pozwala na dodanie nowego terminu.
4. Przycisk "Edytuj datę" w tabeli pozwala na zmianę terminu istniejącej rezerwacji.
5. Przycisk "Odwołaj" trwale usuwa rezerwację z bazy danych.



