const ejs = require('ejs');
const express = require('express');
const i18n = require('i18n');
const hostname = 'localhost';
const port = 3025;
var app = express();
app.use(express.static(__dirname + '/public'));
var setLang = function (req, res) {
    var languageInBrowser = req.headers['accept-language'];
    languageInBrowser = languageInBrowser.length ? languageInBrowser.split(',')[0] : '';
    var lang = req.params.lang || languageInBrowser;
    i18n.setLocale([req, res.locals], lang);
    return lang;
};
var url = '//' + hostname + ':' + port + '/';
var cdnUrl = url + 'dist/src/';
app.get('/demo1', function (req, res) {
    try {
        var lang = setLang(req, res);
        var ejsPath = __dirname + '/src/demo1/' + 'demo1.ejs';
        ejs.renderFile(ejsPath, {
            url: url,
            cdnUrl: cdnUrl,
            lang: lang
        }, function (err, result) {
            res.send(result);
        });
    } catch(e) {
        console.log(e);
    }
});
app.get('/demo1-2', function (req, res) {
    try {
        var lang = setLang(req, res);
        var ejsPath = __dirname + '/src/demo1/' + 'demo1-2.ejs';
        ejs.renderFile(ejsPath, {
            url: url,
            cdnUrl: cdnUrl,
            lang: lang
        }, function (err, result) {
            res.send(result);
        });
    } catch(e) {
        console.log(e);
    }
});
app.get('/:lang', function (req, res) {
    try {
        var lang = setLang(req, res);
        var ejsPath = __dirname + '/src/doc/' + 'index.ejs';
        ejs.renderFile(ejsPath, {
            url: url,
            cdnUrl: cdnUrl,
            lang: lang
        }, function (err, result) {
            res.send(result);
        });
    } catch(e) {
        console.log(e);
    }
});
i18n.configure({
    locales: ['en', 'ch'],
    register: global,
    directory: __dirname + '/src/doc/locales/'
});
app.use(i18n.init);
app.listen(port, hostname, () => {
    /*eslint no-console: ["error", { allow: ["log"] }] */
    console.log(`Server running at http://${hostname}:${port}/`);
});
