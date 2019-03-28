---
title: Flashcards
---

# Přehled

Aplikace Flashcards má stejnou strukturu jako webová aplikace, hlavní části jsou naprogramovány s použitím HTML, CSS a Javascriptu, ale na rozdíl od ostatních webových aplikací se nevykresluje ve webovém prohlížeči, ale v Electronu. Data se ukládají do oddělené databáze, takže obě části aplikace běží nezávisle na sobě. O databázi se stará Django Framework (Python) a běží to na localhostu. Klient a server komunikují asynchronně skrz JSON requesty.

# Použité knihovny

Aplikace používá mnoho různých knihoven na usnadnění používání některých funkcí. Na serverové části je použito Django, které ovšem vyžaduje nainstalovaný Python 3 (je doporučeno používat nejnovější verzi). Na straně klienta je použit Electron, který renderuje všechny vizuální aspekty místo prohlížeče, a ten pro své fungování potřebuje Node.js. Pro hezčí vzhled je použit Bootstrap, skládá se ze tří souborů: `.css`, které je upravené kvůli sladění některých barev s celkovým vzhledem, `.js` a `popper.js`, které jsou potřeba pro některé funkce. Pro dynamické měnění obsahu na stránce a komunikaci se serverem je použita JQuery.

- Server
    - Python 3.7 nebo vyšší (*www.python.org/downloads/windows*)
    - Django 2.1.5 (nainstalováno příkazem `pip install Django==2.1.5`)
- Uživatelské rozhraní
    - Node.js (*www.npmjs.com/get-npm*)
    - Electron (*www.electronjs.org*)
    - Electron packager
    - Bootstrap předkompilované soubory (stažené z *www.getbootstrap.com/docs/4.3/getting-started/download/*)
        - CSS, Javascript a Popper
    - JQuery (*www.jquery.com*)

# Konfigurace serveru

Jak bylo zmíněno dříve, o všechna ukládaná data se stará Django běžící offline na localhostu na portu 8000. Všechny soubory týkající se serveru se nachází ve složce `./server/`. Ve složce `./server/server` je obecné nastavení serverové aplikace, ve složce `./server/cards/` jsou pak soubory této konkrétní aplikace s modely pro databázi a funkcemi na zpracovávání příchozích a odchozích requestů.

## Spuštění serveru

&nbsp;&nbsp;&nbsp;&nbsp;`python manage.py runserver localhost:8000`

- Spuštěn ze složky, ve které se nachází soubor `manage.py` (`./server/`)

## Základní nastavení serveru

- Soubory v `./server/server`.
- Zde se nastavují všechny nainstalované aplikace využívající tento server (v tomto případě pouze 'cards'), typ použité databáze ('sqlite3') a které urls jsou použity pro příjímání requestů (`urls.py`).
- Dále se zde nachází secret key pro případ publikování databáze na internet

## Nastavení aplikace Cards

Všechny soubory v `./server/cards/`. Pro tuto aplikaci jsou potřebné pouze `models.py`, `urls.py` a `views.py`. Ostatní jsou buď automaticky vytvořené, nebo prázdné.

Základní adresa k serveru

&nbsp;&nbsp;&nbsp;&nbsp;`localhost:8000/cards`

### Modely

V tomto souboru se definují databázové objekty s jejich proměnnými a vztahy s ostatními objekty. Každý model slouží jako šablona pro záznamy do databáze a vytvoří si tabulku, kam tyto záznamy budou ukládány. Jednotlivé řádky tabulky jsou propojovány s jinými tabulkami skrze relationship fields.

- model `Tag(tag_name, previous_success_rate, card_count)` ... šablona pro okruhy
    - `tag_name` ... CharField (max. 100 znaků); reprezentuje jméno daného okruhu
    - `previous_success_rate` ... IntegerField; reprezentuje procentuální úspěšnost posledního testu daného okruhu
    - `card_count` ... IntegerField, volitelný (default=0); reprezentuje počet karet propojených k okruhu
    - každá proměnná má svoje `get` a `set`, které vrací, nebo upravují jejich hodnoty
    - `add_card` a `remove_card` metody slouží k navýšení, nebo snížení počtu karet v `card_count` proměnné
- model `Card(card_front, card_back, tag_count, tags)` ... šablona pro kartičky
    - `card_front` ... CharField (max. 200 znaků); reprezentuje text zobrazený na přední straně kartičky
    - `card_back` ... CharField (max. 200 znaků); reprezentuje text zobrazený na zadní straně kartičky
    - `tag_count` ... IntegerField, volitelný (default=0); reprezentuje počet okruhů, ve kterých je daná kartička
    - `tags` ... ManyToManyField; propojuje kartičky s libovolným počtem okruhů
        - příkazem `tags.add(tag)` je propojena kartička s okruhem, `tags.remove(tag)` zničí vazbu mezi nimi
        - v každém okruhu se automaticky vytvoří proměnná `cards`, kam se naopak ukládají všechny propojené kartičky. To znamená, že jejich spojení je oboustranné a lze k nim přistoupit z obou dvou.
    - každá proměnná má svoje `get` a `set`, které vrací, nebo upravují jejich hodnoty
    - `add_tag` a `remove_tag` metody slouží ke zvýšení, nebo snížení počtu okruhů v `tag_count` proměnné

### Views a Urls

Zde jsou definovány funkce, které spravují příchozí a odchozí JSON a Http requesty z/do klienta. Všechna data posílaná requesty jsou v JSON formátu pro lepší komunikaci s Javascriptem.

- request `cards`
    - musí být poslán na url `localhost:8000/cards/cards`
    - vrací seznam JSON objektů, každý reprezentuje jednu kartičku z databáze
    - JSON objekt neobsahuje všechny atributy kartičky - `{id, card_front, card_back}`
- request `tags`
    - musí být poslán na url `localhost:8000/cards/tags`
    - vrací seznam JSON objektů, každý reprezentuje jeden okruh z databáze
    - JSON objekt neobsahuj všechny atributy kartičky - `{id, tag_name}`
- request `tag(tag_id)`
    - musí být poslán na url `localhost:8000/cards/tags/tag_id/`
    - vrací JSON objekt se všemi informacemi o okruhu specifikovaným `tag_id`
    - vrací `{id, tag_name, success_rate, card_count, cards}`
- request `card(card_id)`
    - musí být poslán na url `localhost:8000/cards/cards/card_id/`
    - vrací JSON objekt se všemi informacemi o kartičce specifikované `card_id`
    - vrací `{id, card_front, card_back, tag_count, tags}`
- request `add_tag`
    - musí být poslán na url `localhost:8000/cards/add_tag/`
    - dostane JSON objekt od klienta - `{type, id, tag_name, success_rate, card_count, cards}`
        - podle hodnoty `type` argumentu určí, která akce se provede
        - vytvoří nový okruh (`type: new`),
        - zaktualizuje jméno (`type: update`),
        - zaktualizuje úspěšnost posledního testu (`type: test`),
        - smaže okruh (`type: delete`).
- request `add_card`
    - musí být poslán na url `localhost:8000/cards/add_card/`
    - dostane JSON objekt od klienta - `{type, id, card_front, card_back, tag_count, tags}`
        - podle hodnoty `type` argumentu určí, která akce se provede
        - vytvoří novou kartičku (`type: new`),
        - zaktualizuje jméno a automaticky všechny vazby mezi okruhy (`type: update`),
        - smaže kartičku (`type: delete`).
- request `import_all`
    - musí být poslán na url `localhost:8000/cards/import/`
    - dostane dvojici seznamů JSON objektů, které obsahují okruhy i kartičky

        `[`

        &nbsp;&nbsp;&nbsp;&nbsp;`[{type: "new", card_front, card_back, tag_count, tags}],`

        &nbsp;&nbsp;&nbsp;&nbsp;`[{type: "new", tag_name, success_rate: 0, card_count: 0}]`

        `]`

    - funkce sama určí, jestli je položka unikátní a přidá ji do databáze - automaticky spojí okruhy s kartičkami na základě indexů druhého listu (v každé `tags` proměnné je seznam indexů položek z druhého listu, které mají být propojeny)
    - když položka již existuje, je přeskočena

V souboru `urls.py` jsou definovány url adresy kam se posílají jednotlivé requesty. Každý request má svojí adresu pro lepší organizaci.

# Klient

Klient uživatelského rozhraní je vytvořeno stejným způsobem jako moderní webové aplikace, ale místo renderování v prohlížeči jako Firefox nebo Chrome se vykreslují v Electronu. Výhoda tohoto řešení je lepší fungování offline a také vytváření vlastního okna pro aplikaci pro hezčí vzhled, ale na druhou stranu je nezbytné nainstalovat Node.js, což dělá klienta náročného na úložiště (kolem 100 MB minimálně). Zase ale mohou být využity ostatní Node.js rozšíření, jako například file manager. Díky tomu máme přístup k souborům na lokálním disku, čehož by nešlo dosáhnout s běžnou webovou aplikací, protože Javascript žádnou takovou funkci neposkytuje.

## Složky a soubory

Všechny soubory jsou umístěny ve složce `./user_interface/`.

- `/assets/` obsahuje obrázky a ikony.
- `/lib/` obsahuje předkompilované Bootstrap soubory, Jquery a speciální CSS soubor, který otáčí kartičkou.
- `/node_modules/` obsahuje všechny Node.js package všetně Electronu; z těchto souborů se postaví konečný spustitelný soubor
- `/src/` obsahuje Javascript a HTML soubory, které zajišťují funkcionalitu aplikace
- Dále složka obsahuje soubory `package-lock.json` a `package.json`
    - První z těchto dvou popisuje přesný strom souborů stažených do node-modules složky
    - Druhý slouží ke spouštění aplikace z terminálu a ke konečnému zabalení aplikace do spustitelné formu

## Structure

Konkrétní obsahy jednotlivých souborů jsou popsány v následujících kapitolách, tady je popsán pouze proces. Vykreslovací proces začíná v `render.js` souboru, který je nastaven ke spuštění v `package.json`.

Tento soubor vytvoří okno a načte do něj `mainWindow.html`, který určuje rozložení a vzhled stránky. Aplikace je postavena jako jednostránková aplikace, to znamená, že všechny části jsou na jedné stránce, ale většina je skrytá a zobrazuje se jen ta momentálně potřebná část. O viditelnost se stará Javascriptový soubor.

Vzhled HTML stránky je vylepšen Bootstrapem. Do `mainWindow.html` jsou nalinkovány `.css` soubory, které jsou upravené oproti těm oficiálním o některé barvy, `.js` soubory a `popper.js`, které jsou potřebné pro některé funkce Bootstrapu.

Do `mainWindow.htlm` je také nalinkován `main.js` soubor, který tvoří jádro aplikace a obsahuje všechny hlavní funkce aplikace. Například se stará o viditelnost obsahu, získává input od uživatele a posílá a příjímá requesty z databáze. Všechny jeho funkce jsou popsány v některé z dalších kapitol.

### Instalace Electronu

&nbsp;&nbsp;&nbsp;&nbsp;`npm install electron --save-dev`

- spuštěno v hlavni složce projektu

### Instalace Electron-packageru

&nbsp;&nbsp;&nbsp;&nbsp;`npm install electron-packager --save-dev`

- spuštěno ve složce, ve které jsou node-modules

### Spuštění klienta z terminálu

&nbsp;&nbsp;&nbsp;&nbsp;`npm start`

- spuštěno ve složce `user_interface`

### Zabalení aplikace do package

Pro zabalení aplikace do složky obsahující spustitelný soubor a vše potřebné pro spuštění souboru bez instalace spustit

&nbsp;&nbsp;&nbsp;&nbsp;`npm run` + jedna z možností `package-win/package-linux/pakcage-mac`

Tento příkaz je definován v `package.json` v atributu `"scripts":{}` a zabalí aplikaci do složky `/user_interface/release-builds/`. Použije k tomu `electron-packager` a výsledný package funguje bez instalování čehokoliv. **To platí jen pro vizuální stránku aplikace, server potřebuje mít nainstalované Django a Python a musí být spuštěn z příkazové řádky (viz Spuštění serveru)**

## render.js

Jednoduchý soubor, popisují se jenom vlastnosti okna a který HTML soubor se má použít.

1. Na začátku souboru se musí zahrnout všechny Node.js moduly, které budou použity, včetně Electronu a je potřeba příradit mu proměnné `app` a `BrowserWindow`.
2. Vše ostatní by mělo být v bloku `app.on("ready", function() { code });`, který před spuštěním počká až se dokončí načtení modulů a inicializaci okna.
3. Vytvořit instanci classy `BrowserWindow`, kde se nadefinují vlastnosti okna.
    - Výška, šířka okna (i s minimálními hodnotami, aby byl vidět nějaký obsah), kde na obrazovce se má okno zobrazit a nadpis. Je možné přidat ještě ikonku, ale to udělá Electron-packager.
4. Metodou `.setMenu` nastavíme lištu menu (v této aplikaci je defaultně vypnutá).
5. Načtení HTML kódu ze souboru (`mainWindow.html` v tomto případě).
6. Na konci je pojistka, aby se vypnula aplikace po zavření všech oken.

Více informací o Electron API a dalších možnostech nastavení je na *www.electronjs.org/docs*.

## mainWindow.html

V hlavičce tohoto souboru je mnoho `link` a `script` tagů, které načítají javascriptová a css rozšíření. V zakomentovaných řádcích jsou online CDN odkazy pro případ, že by ty stažené soubory přestaly fungovat (např. kvůli novější verzi). Dále jsou zde dva speciální `script` tagy kolem ostatních, aby je Electron správně načetl při renderování.

Skoro všechny tagy inheritují vlastnosti z `bootstrap.css` a obsahují spoustu `class` atributů. Ty které jsou nějakým způsobem ovládány Javascriptem jsou také pojmenovány pomocí unikátního `id` atributu.

Většina obsahu se generuje dynamicky, takže HTML samo o sobě obsahuje jen přípravená místa pro naplnění daty z databáze.

Více detailních informací o `class` atributech je v dokumentaci Bootstrapu (*www.getbootstrap.com/docs/4.2/getting-started/introduction/*).

## main.js

Tento soubor obsahuje kombinaci JQuery API a čistého Javascriptu. Všechny příkazy z JQuery jsou označeny `$` a zajišťují lepší import dat do HTML souboru a také usnadňují komunikaci se serverem.

Po načtení `mainWindow.html` do Electronu se spustí blok `$(document).ready(function() { code });`. Nejprve zavolá funkci `reset()`, která skryje vše kromě titulní strany. Poté čeká na **click events** na tlačítkách v liště menu a spustí příslušnou funkci, když **event** nastane.

### Home button

Spustí pouze funkci `reset()` a zobrazí titulní stranu.

### Další funkce

- `hide_all()` - skryje úplně vše, kromě navigační lišty (ta skrýt nelze).
- `reset()` - zavolá `hide_all()` a zviditelní titulní stranu
- `show_one_item(item)` - bere `id` objektu jako argument; zavolá `hide_all()` a zobrazí daný objekt
- `post_information(suffix, data)` - bere příponu za základní adresu k serveru, kam se pošle request, a data k odeslání (v JSON formátu) jako argumenty; vytvoří **ajax POST** request
- `load_information(suffix)` - bere příponu za základní adresu k serveru jako argument; vytvoří **ajax GET** request a vrátí příchozí data
- `create_card_object(type, id, card_front, card_back, tags)`
    - vytvoří string z JSON objektu (kartička) s hodnotami z argumentů
- `create_tag_object(type, id, tag_name, success_rate, card_count, cards)`
    - vytvoří string z JSON objektu (okruh) s hodnotami z argumentů

### Click events

- Každý **click event** musí mít za sebou metodu `.unbind()`, jinak by se příkazy sčítaly a po druhém zmáčknutí daného tlačítka by se funkce spustila dvakrát a tak dále.
- Uvnitř každého **click event**u musí být zavolána funkce `event.preventDefault();`. Jelikož tato aplikace používá JQuery pro správu kliknutí, je potřeba zabránit HTML, aby se snažilo reagovat na kliknutí. Stránka by se obnovila, protože HTML by nevědělo, co dělat, a byla by vidět jen titulní strana.
