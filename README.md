# Flashcards

Maturitní aplikace na učení slovíček nebo jiné látky.
Uživatel si vytváří kartičky se slovíčky, které zařazuje do libovolných okruhů. Z těchto okruhů je poté zkoušen třemi typy testů.

## Instalace

Pro správné fungování je potřeba mít nainstalován `Python 3.6` nebo vyšší a `Django 2.1.5` (instalace pomocí `pip install django=2.1.5`).

## Spouštění

Nejprve je potřeba spustit server. Ve složce server (je v ní soubor `manage.py`) spustíme příkaz `python manage.py runserver localhost:8000`.

Poté se spustí samotná aplikace. Buď spuštěním `flashcards.exe` souboru na Windows, nebo `flashcards` souboru na Linuxu. Ve vývoji lze spouštět aplikaci pomocí příkazu `npm start` ve složce user_interface (je potřeba mít nainstalovaný `npm`).

Více informací najdete na [*webové stránce projektu*](https://jakubrada.github.io/Flashcards/index.html), kde se nachází uživatelská příručka i vývojářská dokumentace.
