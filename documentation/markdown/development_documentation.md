---
title: Flashcards
---

# Overview

Flaschcards app has the same structure as a web application, main parts are programmed using html, css and javascript, but is rendered using Electron instead of conventional web browser. In addition, all the data are saved into separate database, so both parts can be altered independently. As server side app is used Django by Python and its run on localhost. Visual part and server part are communicating asynchronously through JSON requests.

# Dependencies

App uses many dependencies. On the server side is used Django framework, which also requires Python 3 (using the latest version is recommended). On the user side is used electron to render all visual features instead of web browser and it also requires Node.js. Bootstrap is used for better looks of the application, contains of three files: css file, which is altered to change some default colors, javascript file and popper.js. For asynchronous changes and communication with the server is used JQuery.

- Server side
    - Python 3.7 (*www.python.org/downloads/windows/*)
    - Django 2.1.5 (installed by `pip install Django==2.1.5`)
- User side
    - Node.js
    - Electron (*www.electronjs.org*)
    - Electron packager (*www.github.com/electron-userland/electron-packager*)
    - Bootstrap precompiled files (downloaded from *www.getbootstrap.com/docs/4.3/getting-started/download/*)
        - css file, javascript file and popper.js
    - JQuery (*www.jquery.com*)

# Server side

As said above, all data are handled by Django running offline on localhost. All files related to server are saved in `./server/` folder. In the `./server/server/` folder are basic settings for server app and in the `./server/cards/` folder are files unique for this specific app. In this folder can be found models for database objects and functions handling requests from user client.

## Command to start a server

`python manage.py runserver localhost:8000`

- From `./server/` folder

## Default server configuration 

- Files in `./server/server/`
- Here have to be set all installed apps (only 'cards' in this case), type of database is used (sqlite3) and which urls will server for receiving requests (specified in 'urls.py')
- It also contains secret key for this database in case it was to be published online

## Cards app configuration

All files in `./server/cards/`. For this app are important only `models.py`, `urls.py` and `views.py`. Others are either necessary for Django or are empty, without use in this case.

### Models

Here are declared database objects with their variables and relations among them. Each model serves as a template and creates table in the database. Individual rows are connected among tables through relationship fields.

- model `Tag(tag_name, previous_success_rate, card_count)`
    - `tag_name` ... CharField (max. 100 characters); represents name of a specific tag
    - `previous_success_rate` ... IntegerField; represents success rate of the last test of a specific tag
    - `card_count` ... IntegerField, optional (default=0); represents number of cards linked to a specific tag
    - each variable has its `get` and `set` method to alter or return value
    - `add_card` and `remove_card` methods serve to increase or decrease `card_count` variable
- model `Card(card_front, card_back, tag_count, tags)`
    - `card_front` ... CharField (max. 200 characters); represents text shown on front side of a specific card
    - `card_back` ... CharField (max. 200 characters); represents text shown on back side of a specific card
    - `tag_count` ... IntegerField, optional (default=0); represents number of tags linked to a specific card
    - `tags` ... ManyToManyField; links cards to tags and tags to cards
        - by running `tags.add(tag)` are tags connected to a specific card, `tags.remove(tag)` destroys the connection
        - in each tag is simultaneously created variable `cards` where are stored connections with each card so these relations can be accessed from both ends
    - each variable has its `get` and `set` method to alter or return value
    - `add_tag` and `remove_tag` methods serve to increase or decrease `tag_count` variable

### Views and urls

Here are declared functions to handle incoming and outcoming Json and Http requests from client. All requests and responses are happening through Json objects in order to communicate better with JavaScript.

- request `cards`
    - request has to be sent on url `localhost:8000/cards/cards/`
    - returns list of Json objects, each represents one card from database
    - Json object does not contain all information - `{id, card_front, card_back}`
- request `tags`
    - request has to be sent on url `localhost:8000/cards/tags/`
    - returns list of Json objects, each represents one tag from database
    - Json object does not contain all information - `{id, tag_name}`
- request `tag(tag_id)`
    - request has to be sent on url `localhost:8000/cards/tags/tag_id/`
    - returns Json object with all information about tag specified by `tag_id`
    - returns `{id, tag_name, success_rate, card_count, cards}`
- request `card(card_id)`
    - request has to be sent on url `localhost:8000/cards/cards/card_id/`
    - returns Json object with all information about card specified by `card_id`
    - returns `{id, card_front, card_back, tag_count, tags}`
- request `add_tag`
    - request sent on url `localhost:8000/cards/add_tag/`
    - receives Json object from client - `{type, id, tag_name, success_rate, card_count, cards}` - by `type` value decides what change will happen
        - adds new tag (`"type": "new`),
        - updates name of a tag (`"type": "update"`),
        - updates success rate of the last test (`"type": "test"`),
        - deletes a tag (`"type": "delete"`).
- request `add_card`
    - request sent on url `localhost:8000/cards/add_card/`
    - receives Json object from client - `{type, id, card_front, card_back, tag_count, tags}` - by `type` value decides what change will happen
        - adds new card and automatically updates all tag relationships (`"type": "new"`),
        - updates names and relationships (`"type": "update"`),
        - deletes a card (`"type": "delete").
- request `import_all`
    - request sent on url `localhost:8000/cards/import/`
    - receives list of two Json object lists containing both cards and tags

        `[`

        &nbsp;&nbsp;&nbsp;&nbsp;`[{type: "new", card_front, card_back, tag_count, tags}],`

        &nbsp;&nbsp;&nbsp;&nbsp;`[{type: "new", tag_name, success_rate: 0, card_count: 0}]`

        `]`

    - determines if imported item is non-existant and adds it to the database - connects tags to cards based on indexes of second list (in each tags variable are indexes of second list to connect to) in the process
    - if item already exists its skipped

In `urls.py` are defined addresses where to send specific requests. Each request has its own address for better organization.

# Client side

User interface client is created in the same way as any modern web application, but for rendering is used Electron instead of some web browser such as Firefox or Chrome. Its advantage is that it can be run offline and in a separate window so it looks much better, but on the other hand it is necessary to use Node.js so the client takes quite a lot of memory. As it was said Electron is a framework built on Node.js so all its packages can be used in the app, such as file manager. This means the app can access file on the hard drive which would not be possible, for safety reasons, from simple web app.

## Folders and files

All files for the client are located in `./user_interface/` folder.

- `/assets/` contains images and icons.
- `/lib/` contains Bootstrap files, Jquery and custom .css file for flipping card.
- `/node_modules/` contains all Node.js packages including electron; from these will be built final executable.
- `/src/` contains Javascript and HTML files which define actual functionality of the application
- In this file are also `package-lock.json` and `package.json`
    - the first one describes the exact tree of files downloaded into node-modules
    - the second one handles starting the app from terminal and also packaging the file into executable

## Structure

Contents of all files are described in next chapters, this part describes only the process. Rendering process starts at the `render.js` file which is set to be executed first in `package.json`.

This file creates window and loads into it `mainWindow.html` file which controls the layout and visual aspect of the app. It is constructed as a one-page app so everything is declared in one html file and only currently required parts are shown, the rest is hidden. Visibility is determined by Javascript file.

The visuals of html layout is enhanced by Bootstrap. To the `mainWindow.html` are linked Bootstraps precompiled `.css` files, which are modified in order to adjust some colors to app theme, `.js` files, which are required for some features, and `popper.js`, which is also required by Bootstrap.

To `mainWindow.html` is also linked `main.js` file, which contains all inner functions of the app. For example, it handles what is visible, getting input from user and sending and receiving requests from the database. All its functions are described in some of next chapters.

### Installing Electron

&nbsp;&nbsp;&nbsp;&nbsp;`npm install electron --save-dev`

- executed in main folder of the project

### Terminal command to start client

&nbsp;&nbsp;&nbsp;&nbsp;`npm start`

- executed from `user_interface` folder

### Packaging

To package app into folder containing executable and other dependencies is run by

&nbsp;&nbsp;&nbsp;&nbsp;`npm run` + one of these `package-win/package-linux/pakcage-mac`

This command is defined in the `package.json` file in attribute `"scripts": {}` and packs file into folder `/user_interface/release-builds/` using `electron-packager` and it is functioning without installing anything. **But it's only the visual part, the server needs to have installed Python and Django and it has to be turned manually from command line or by using shell script added to `render.js`.**

## render.js

It's a simple file, where are described only looks of the window and which html it should render.

1. On the beggining of the file it is necessary to include Electron and assign to it `app` and `BrowserWindow` variables.
2. Everything else should be in `app.on("ready", function() { code });` statement, it waits before Electron is initialized.
3. To `mainWindow` variable is assigned `BrowserWindow` class - here are defined properties of the window
    - Here are set height, width, where should the window appear and its title
4. With `.setMenu` are specified items in menu bar (turned off by default).
5. Loading `html` code from another file
6. Making sure that app will quit after the window is closed

For discovering more about Electron APIs and possibilities visit (*www.electronjs.org/docs*)

## mainWindow.html

In the header of this file are many `link` and `script` tags loading Javascript and css extensions. In commented part are online CDN links in case the linked files are not downloaded. Also there are two special `script` tags around the others just for Electron to load them correctly.

Almost every tags are inheriting from `bootstrap.css` so they many classes in themselves. Those which will be accessed from `main.js` for dynamical updates are also named by `id` property.

Most of the content is dynamically updated so there is almost no content, these are just prepared to be filled by the data from database.

For discovering more about Bootstrap classes visit its documentation (*www.getbootstrap.com/docs/4.2/getting-started/introduction/*).

## main.js

This file contains combination of JQuery APIs and plain Javascript. By definition everything from JQuery begins with `$` sign and it provides better communication with `html` file and it makes handling requests easier.

After the `mainWindow.html` is loaded into Electron and everything is set up, the block inside `$(document).ready(function() {});` is executed first. It calls the `reset()` function, which hides everything except title page, and it waits for pressing any of the buttons in navigation bar and calls corresponding function when done so.

### Home button

Calls only the `reset()` function and shows title page.

### Other functions

- `hide_all()` - hides every div; only navigation bar remains
- `reset()` - calls `hide_all()` and shows title page
- `show_one_item(item)` - takes id of div to show as an argument; calls `hide_all()` and shows `item`
- `post_information(suffix, data)` - takes suffix to `database_path` to send data to and data as arguments; makes **ajax POST** request with json object
- `load_information(suffix)` - takes suffix to `database_path` to get data from; makes **ajax GET** request and returns data from the specified path
- `create_card_object(type, id, card_front, card_back, tags)`
    - returns string of JSON card object with values from arguments
- `create_tag_object(type, id, tag_name, success_rate, card_count, cards)`
    - returns string of JSON tag object with values from arguments

### Click events

- Every **click** event has to be `unbind()`, otherwise the events would stack up and after second press of the button the function would be called twice and so on.
- Inside every **click** event should be called `event.preventDefault();`. This app uses JQuery for handling button clicks so we need to disable the `html` handling the clicks. Otherwise the page would refresh and we would see title page again.

