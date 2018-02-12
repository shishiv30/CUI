const ejs = require('ejs');
const express = require('express');
const i18n = require('i18n');
const hostname = '127.0.0.1';
const port = 3025;
const ejsUrl = __dirname + '/src/doc/';

var app = express();

var setLang = function (req, res) {
    var languageInBrowser = req.headers['accept-language'];
    languageInBrowser = languageInBrowser.length ? languageInBrowser.split(',')[0] : '';
    i18n.setLocale([req, res.locals], req.params.lang || languageInBrowser);
};

app.get('/:lang', function (req, res) {
    setLang(req, res);
    var ejsPath = ejsUrl + 'index.ejs';
    ejs.renderFile(ejsPath, {
        url: 'http://' + hostname + ':' + port + '/'
    }, function (err, result) {
        res.send(result);
    });
});

app.use(express.static('public'));

i18n.configure({
    locales: ['en', 'ch'],
    register: global,
    directory: ejsUrl + 'locales/'
});
app.use(i18n.init);

app.listen(port, hostname, () => {
    /*eslint no-console: ["error", { allow: ["log"] }] */
    console.log(`Server running at http://${hostname}:${port}/`);
});
