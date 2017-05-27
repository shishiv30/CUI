const http = require('http');
var path = require('path');
const express = require('express');

const hostname = '127.0.0.1';
const port = 8080;


var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendfile('public/index.html');
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
