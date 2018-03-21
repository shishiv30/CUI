const ejs = require('ejs');
const express = require('express');
const i18n = require('i18n');
const hostname = 'localhost';
const port = 3025;
const ejsUrl = __dirname + '/src/doc/';
var app = express();
console.log(__dirname + '/public');
app.use(express.static(__dirname + '/public'));
var setLang = function (req, res) {
    var languageInBrowser = req.headers['accept-language'];
    languageInBrowser = languageInBrowser.length ? languageInBrowser.split(',')[0] : '';
    var lang = req.params.lang || languageInBrowser;
    i18n.setLocale([req, res.locals], lang);
    return lang;
};
app.get('/:lang', function (req, res) {
    var lang = setLang(req, res);
    var ejsPath = ejsUrl + 'index.ejs';
    ejs.renderFile(ejsPath, {
        url: '//' + hostname + ':' + port + '/',
        lang: lang
    }, function (err, result) {
        res.send(result);
    });
});
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
