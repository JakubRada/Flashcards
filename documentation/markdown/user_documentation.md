---
title: Flashcards
subtitle: Uživatelská příručka
---

# O aplikaci

*Flashcards* je offline počítačová aplikace navržená pro zkoušení slovíček či jiné látky. Umožňuje vytváření a úpravu kartiček a jejich zařazování do okruhů. Okruhy pak lze vyzkoušet třemi typy testů. Kartičky se slovíčky lze zařazovat do libovolného množství okruhů ke zkoušení. Pro urychlení vytváření kartiček aplikace nabízí export a import dat do/ze souboru.

# Instalace a spuštění

1. Nainstalujeme Python 3.7 (Linux z terminálu, Windows z *www.python.org/downloads/windows/*)
2. Nainstalujeme Django 2.1.5.
    - Na Windows otevřeme příkazový řádek jako správce.
    - Zadáme příkaz

    &nbsp;&nbsp;&nbsp;&nbsp;`pip install Django==2.1.5`

3. Spustíme Django server
    - Složka `./server/` (musí zde být soubor `manage.py`)
    - Spustíme příkaz

    &nbsp;&nbsp;&nbsp;&nbsp;`python manage.py runserver localhost:8000`

4. Spustíme aplikaci **flashcards** (na Windows s příponou .exe).

# Termíny v aplikaci

- **Card** = kartička;
- **Front side** = líc kartičky (slovo, které bude zapsáno na přední stranu kartičky - v základním nastavení představuje otázku);
- **Back side** = rub kartičky (slovo, které bude zapsáno na zadní stranu kartičky - v základním nastavení představuje požadovanou odpověď na líc karty);
- **Tag** = okruh na zkoušení;
- **Tag name** = název okruhu;
- **Reverse** = přepínač ,,směru" otázek, nachází se u výběru typu testu;

# Vytváření kartiček

Funkce na vytváření nových kartiček. Každá kartička může být uložena v libovolném množství okruhů. Pokud budou obě zadané hodnoty stejné jako v nějaké již existující kartičce, aplikace upozorní uživatele a nová se stejnými hodnotami se již nevytvoří.

1. Klikneme na tlačítko **Create card** v menu liště.
2. Vyplníme políčko **Front side** textem, který chceme zobrazit na přední straně kartičky (maximální délka vloženého textu je 200 znaků).
3. To stejné provedeme s políčkem **Back side**.
4. Pod políčky jsou zobrazena zaškrtávací tlačítka pro všechny existující okruhy, kde označíme, do kterých okruhů chceme kartičku přidat.
5. Tlačítkem **Save** uložíme kartičku, tlačítkem **Cancel** zahodíme všechny zadané hodnoty a kartička se neuloží.

# Zobrazování a úprava kartiček

Funkce na úpravu existujících kartiček a zobrazení všech kartiček. Pokud budou obě upravované hodnoty změněné na již existující, aplikace upozorní uživatele a změny se neuloží.

1. Klikneme na tlačítko **Edit card** v menu liště.
2. Zobrazí se seznam všech existujících kartiček v tabulce.
    - Tabulka má čtyři sloupečky: text na přední straně (**Front side**); text na zadní straně (**Back side**); počet okruhů, které obsahují danou kartičku (**No. of tags**); tlačítko na úpravu (**Edit**) a na smazání (**Delete**).
3. Po kliknutí na tlačítko **Delete** se aplikace zeptá na potvrzení a poté kartičku smaže a odstraní ji ze všech okruhů.
4. Po kliknutí na tlačítko **Edit** se zobrazí formulář na úpravu.
    - Funguje stejně jako vytváření kartičky, s tím rozdílem, že políčka a zaškrtávací tlačítka jsou již předvyplněná momentálními hodnotami.

# Vytváření okruhů

Funkce na vytváření nových okruhů. Pokud okruh se zadanou hodnotou již existuje, aplikace upozorní uživatele a nový okruh nevytvoří.

1. Klikneme na tlačítko **Create tag** v menu liště.
2. Vyplníme políčko **Tag name** textem, který bude sloužit jako název nového okruhu na zkoušení (maximální délka názvu je 100 znaků).
3. Tlačítkem **Save** uložíme nový okruh, tlačítkem **Cancel** zahodíme vložený text a nový okruh se neuloží.

# Zobrazování a úprava okruhů

Funkce na úpravu existujících okruhů a zobrazení všech okruhů. Pokud bude vložený text názvem již existujícího okruhu, aplikace upozorní uživatele a změna se neuloží.

1. Klikneme na tlačítko **Edit tag** v menu liště.
2. Zobrazí se tabulka všech existujících okruhů v tabulce.
    - Tabulka má čtyři sloupečky: název okruhu (**Name of the tag**); počet kartiček v daném okruhu (**No. of cards**); úspěšnost posledního testu daného okruhu v procentech (**Learned**); tlačítko na úpravu (**Edit**) a na smazání (**Delete**).
3. Po kliknutí na tlačítko **Delete** se aplikace zeptá na potvrzení a poté okruh smaže. Kartičky v okruhu zůstanou zachovány.
4. Po kliknutí na tlačítko **Edit** se zobrazí formulář na úpravu.
    - Funguje stejně jako vytváření okruhů, s tím rozdílem, že políčko **Tag name** je již předvyplněno momentální hodnotou.

# Testy

Funkce spravující všechny testy. Jsou zde obsažené tři typy testů: procházení kartiček (v aplikaci **Browse**), vybírání z možností (v aplikaci **Choices**) a psaní správné odpovědi (v aplikaci **Write**). V nich uživatel postupně prochází všechny kartičky zvoleného okruhu a podle typu testu odpovídá na otázky. Při výběru okruhu k testování si lze zvolit, kterým ,,směrem" budou kartičky zkoušeny. Po každé odpovědi se zobrazí, zda byla odpověď správná, či špatná. Pokud byla špatná, zobrazí se i správné řešení. V průběhu testu je zobrazen počet zbývajících otázek a počet správných a špatných odpovědí. Po zodpovězení všech otázek se zobrazí celková úspěšnost testovaného okruhu, která se uloží pro budoucí porovnání, a uživatel si může prohlédnout všechny své odpovědi.

1. Klikneme na tlačítko **Test** v menu liště.
2. Zobrazí se seznam tlačítek, kdy každé představuje jeden okruh ke zkoušení.
3. Po kliknutí na tlačítko s názvem vybraného okruhu, který chceme otestovat, se zobrazí stránka na výběr typu testu.
4. Tlačítkem **Back to tag selection** se vrátíme na výběr okruhu.
5. Máme na výběr ze tří typů testů: procházení kartiček (**Browse**), vybírání z možností (**Choices**) a psaní správné odpovědi (**Write**).
6. Pod tlačítky je přepínač (**Reverse**), který určuje ,,směr" kartiček.
    - V normálním nastavení se aplikace ptá přední stranou kartičky a očekává odpověď zadní stranou
    - Při přepnutém přepínači se aplikace bude ptát zadní stranou kartičky a bude očekávat odpověď přední stranou.
7. Pro výběr typu testu klikneme na dané tlačítko.

## Test - procházení kartiček

Tento test nevyžaduje žádné odpovědi, uživatel pouze postupně prochází všechny kartičky.

- Kliknutím na kartičku se kartička otočí a zobrazí druhou stranu.
- Kliknutím na tlačítko **Next** se zobrazí další kartička, tlačítko **Previous** zobrazí předchozí kartičku.
- Nad kartičkami je ukazatel, který ukazuje, kolikátá kartička z celkového počtu je právě vidět.
- Procházení ukončíme tlačítkem **Back to test selection**.

## Test - vybírání z možností

Tento test spočívá ve vybírání správné ze čtyř možností, které aplikace nabídne. Po každé otázce aplikace zobrazí, zda byla vybraná odpověď správná a vybranou i správnou odpověď. Na konci testu je pak vyhodnocení úspěšnosti testu a seznam všech odpovědí vždy se správnou možností.

- Nahoře je velkým nápisem napsána přední strana kartičky, pro kterou hledáme správnou dvojici.
- Pod ní jsou možnosti, ze kterých vybíráme. Vybírá se kliknutím na danou odpověď.
- Na pravé straně jsou tři ukazatele: počet správných odpovědí (zelená barva), počet špatných odpovědí (červená barva) a počet zbývajících otázek (černá barva).
- Tlačítkem **Check answer** potvrdíme odpověď a zobrazí se zhodnocení.
- Na stránce se zhodnocením je jediné tlačítko **Next question**, kterým se posuneme na další otázku.

Po poslední otázce se zobrazí stránka se sumarizací otázek.

- Je zde vypsán počet správných odpovědí, procentuální úspěšnost a jestli došlo ke zlepšení, nebo ke zhoršení.
- Kliknutím na tlačítko **Show answers** se zobrazí seznam všech odpovědí.
    - Správné odpovědi jsou zvýrazněny zeleně, špatné červeně.
- Tlačítkem **Continue to test selection** se vrátíme na stránku s výběrem typu testu.

## Test - psaní správné odpovědi

Tento test spočívá v napsání správné odpovědi. Po každé otázce aplikace zobrazí, zda byla vybraná odpověď správná a vybranou i správnou odpověď. Aplikace toleruje překlepy podle délky slova (čím delší slovo, tím více chyb je uznáno). Taková odpověď je vyhodnocena jako správná, ale všechny chyby jsou zvýrazněny. Na konci testu je pak vyhodnocení úspěšnosti testu a seznam všech odpovědí vždy se správnou možností.

- Nahoře je velkým nápisem napsána přední strana kartičky, pro kterou píšeme správnou dvojici.
- Pod ní je jediné políčko, kam má být vepsána správná odpověď.
- Na pravé straně jsou tři ukazatele: počet správných odpovědí (zelená barva), počet špatných odpovědí (červená barva) a počet zbývajících otázek (černá barva).
- Tlačítkem **Check answer** potvrdíme odpověď a zobrazí se zhodnocení.
- Na stránce se zhodnocením je jediné tlačítko **Next question**, kterým se posuneme na další otázku.

Po poslední otázce se zobrazí stránka se sumarizací otázek.

- Je zde vypsán počet správných odpovědí, procentuální úspěšnost a jestli došlo ke zlepšení, nebo ke zhoršení.
- Kliknutím na tlačítko **Show answers** se zobrazí seznam všech odpovědí.
    - Správné odpovědi jsou zvýrazněny zeleně, špatné červeně.
- Tlačítkem **Continue to test selection** se vrátíme na stránku s výběrem typu testu.

# Export

Funkce umožňující export všech kartiček a okruhů, které jsou právě uložené v aplikaci. Export probíhá do **.csv** souboru, který je uložen do složky export, ta je ve stejné složce jako spouštěcí soubor aplikace.

1. Klikneme na tlačítko **File** a pak na tlačítko **Export** v menu liště.
2. Zobrazí se stránka s jediným políčkem, kam napíšeme název exportovaného souboru.
    - Název může obsahovat pouze písmena a číslice.
    - Název píšeme bez koncovky!
3. Kliknutím na tlačítko **Confirm export** se zahájí export dat (může to chvíli trvat).
4. Po exportování se zobrazí potvrzovací okénko, že export proběhl správně.

# Import

Funkce umožňující import kartiček a okruhů ze souboru s koncovkou **.csv**. Importovaná data musí být v přesně daném formátu (viz níže), jinak budou přeskočena. Pokud bude mezi importovanými daty již existující kartička, nebude se přepisovat, ani když bude v jiných okruzích než ta momentálně uložená v aplikaci.

1. Klikneme na tlačítko **File** a pak na tlačítko **Import** v menu liště.
2. Zobrazí se stránka s jediným tlačítkem, které zobrazí průzkumníka souborů.
3. V průzkumníkovi najdeme soubor, který chceme importovat.
4. Kliknutím na tlačítko **Confirm export** se zahájí import dat (může to chvíli trvat).
5. Po importování se zobrazí potvrzovací okénko, že byl import dokončen.

Formát **.csv** souboru

- Okruh
    - tag, číslo okruhu (počítají se jenom ty v tomto souboru), název okruhu
    - například: `tag, 1, Čísla`
- Kartička
    - card, přední strana kartičky, zadní strana kartičky, čísla okruhů, do kterých kartička patří, oddělené ,,|" (čísla okruhů v tomto souboru)
    - například: `card, One, Jedna, 1|2|3`
- Každý záznam píšeme na samostatný řádek

# Nápověda

Kliknutím na tlačítko **Help** v menu liště se zobrazí rychlá nápověda v angličtině.
