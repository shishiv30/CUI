const ejs = require('ejs');
const express = require('express');
const i18n = require('i18n');
const config = require('./config');
const hostname = config.dev.hostname;
const port = config.dev.port;
const url = config.dev.url;
const cdnUrl = url + 'dist/src/';

var app = express();
app.use(express.static(__dirname + '/public'));
var setLang = function (req, res) {
    var languageInBrowser = req.headers['accept-language'];
    languageInBrowser = languageInBrowser.length ? languageInBrowser.split(',')[0] : '';
    var lang = req.params.lang || languageInBrowser;
    i18n.setLocale([req, res.locals], lang);
    return lang;
};

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

app.get('/demo1-1', function (req, res) {
    try {
        var lang = setLang(req, res);
        var ejsPath = __dirname + '/src/demo1/' + 'demo1-1.ejs';
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

app.get('/demo1-3', function (req, res) {
    try {
        var lang = setLang(req, res);
        var ejsPath = __dirname + '/src/demo1/' + 'demo1-3.ejs';
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
app.get('/demo1-4', function (req, res) {
    try {
        var lang = setLang(req, res);
        var ejsPath = __dirname + '/src/demo1/' + 'demo1-4.ejs';
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

app.get('/demo1-5', function (req, res) {
    try {
        var lang = setLang(req, res);
        var ejsPath = __dirname + '/src/demo1/' + 'demo1-5.ejs';
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

app.get('/demo1-6', function (req, res) {
    try {
        var lang = setLang(req, res);
        var ejsPath = __dirname + '/src/demo1/' + 'demo1-6.ejs';
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
