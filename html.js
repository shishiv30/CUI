var fs = require('fs'),
    ejs = require('ejs'),
    i18n = require('i18n');
var ejsUrl = __dirname + '/src/doc/';

i18n.configure({
    locales: ['en', 'ch'],
    register: global,
    directory: ejsUrl + 'locales/'
});

function ejs2html(ejsName) {
    var htmlPath = '/public/',
        ejsPath = '/src/doc/';
    ejsPath = __dirname + ejsPath + ejsName;
    i18n.setLocale('ch');
    htmlPath = __dirname + htmlPath;
    if (!fs.existsSync(htmlPath)){
        fs.mkdirSync(htmlPath);
    }
    ejs.renderFile(ejsPath, {rootUrl:'%RootUrl%'}, function (err, result) {
        if (!err) {
            var htmlName = ejsName.replace('.ejs', '.html');
            fs.writeFile(htmlPath + htmlName, result, function () {});
        } else {
            /*eslint no-console: ["error", { allow: ["log"] }] */
            console.log(err);
        }
    });
}

ejs2html('index.ejs');
