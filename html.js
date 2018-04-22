const fs = require('fs'),
    ejs = require('ejs'),
    i18n = require('i18n'),
    config = require('./config'),
    url = config.github.url,
    cdnUrl = url + 'dist/src/',
    ejsUrl = __dirname + '/src/doc/';
i18n.configure({
    locales: ['en', 'ch'],
    register: global,
    directory: ejsUrl + 'locales/'
});

function ejs2html(ejsName, ejsFolder) {
    var htmlPath = '/public/',
        ejsPath = __dirname + ejsFolder + ejsName;
    i18n.setLocale('ch');
    htmlPath = __dirname + htmlPath;
    if(!fs.existsSync(htmlPath)) {
        fs.mkdirSync(htmlPath);
    }
    ejs.renderFile(ejsPath, {
        url: url,
        cdnUrl: cdnUrl
    }, function (err, result) {
        if(!err) {
            var htmlName = ejsName.replace('.ejs', '.html');
            fs.writeFile(htmlPath + htmlName, result, function () {});
        } else {
            /*eslint no-console: ["error", { allow: ["log"] }] */
            console.log(err);
        }
    });
}
ejs2html('index.ejs', '/src/doc/');
ejs2html('demo1.ejs', '/src/demo1/');
ejs2html('demo1-1.ejs', '/src/demo1/');
ejs2html('demo1-2.ejs', '/src/demo1/');
ejs2html('demo1-3.ejs', '/src/demo1/');
ejs2html('demo1-4.ejs', '/src/demo1/');
ejs2html('demo1-5.ejs', '/src/demo1/');
ejs2html('demo1-6.ejs', '/src/demo1/');
ejs2html('demo1-1-1.ejs', '/src/demo1/');
ejs2html('demo1-1-2.ejs', '/src/demo1/');
ejs2html('demo1-1-3.ejs', '/src/demo1/');
ejs2html('demo1-1-4.ejs', '/src/demo1/');
ejs2html('demo1-1-5.ejs', '/src/demo1/');
ejs2html('demo1-1-6.ejs', '/src/demo1/');
ejs2html('demo1-1-7.ejs', '/src/demo1/');
