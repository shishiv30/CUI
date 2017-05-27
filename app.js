const http = require('http');
var path = require('path');
const ejs = require('ejs');
const express = require('express');

const hostname = '127.0.0.1';
const port = 8080;


var app = express();

app.get('/', function (req, res) {
    var ejsPath = __dirname + '/src/doc/index.ejs';
    ejs.renderFile(ejsPath, {url: 'http://' + hostname + ':' + port + '/'}, function (err, result) {
        res.send(result);
    });
});
app.use(express.static('public'));

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
