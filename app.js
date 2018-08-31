const express = require("express");
const path = require('path');
const db = require('./db');
const route = require('./route/router');

let app = express();

db.init()
    .then(() => {
        console.log('db initialized');
    })
    .catch(() => {
        console.log('init error');
        process.exit(1);
    });

let port = 8080;

app.use('/', express.static(path.join(__dirname, 'client')));

app.use('/', route);

app.listen(port, () => {
    console.log("Server started on port: " + port);
});