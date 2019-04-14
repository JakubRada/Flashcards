# Flashcards

Maturitní aplikace na učení slovíček nebo jiné látky.
Uživatel si vytváří kartičky se slovíčky, které zařazuje do libovolných okruhů.
Z těchto okruhů je poté zkoušen třemi typy testů.

## Instalace a spouštění

Pro správné fungování je potřeba mít nainstalován `Python 3.6` nebo vyšší a `Django 2.1.5` (instalace pomocí `pip install django=2.1.5`).

Pro instalaci vývojářské verze je potřeba mít nainstalován `npm`.

Instalace aplikace

1. Naklonování Github repozitáře
    - `git clone https://github.com/JakubRada/Flashcards.git`
2. Přesunutí se do příslušné složky
    - `cd Flashcards/user_interface/`
3. Instalace pomocí `npm`
    - `npm install`

Nejprve je potřeba spustit server. Ve složce server (je v ní soubor `manage.py`) spustíme příkaz `python manage.py runserver localhost:8000`.

Poté se spustí samotná aplikace. Buď spuštěním `flashcards.exe` souboru na Windows, nebo `flashcards` souboru na Linux.

Ve vývoji lze spouštět aplikaci pomocí příkazu `npm start` ve složce user_interface (je potřeba mít nainstalovaný `npm`).

Více informací najdete na [*webové stránce projektu*](https://jakubrada.github.io/Flashcards/index.html), kde se nachází uživatelská příručka i vývojářská dokumentace.
