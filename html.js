var fs = require('fs'),
    ejs = require("ejs");


function ejs2html(ejsName, data) {
    var htmlPath = '/public/',
        ejsPath = '/src/doc/',
        ejsPath = __dirname + ejsPath + ejsName;
    var htmlPath = __dirname + htmlPath;
    ejs.renderFile(ejsPath, {}, function (err, result) {
        if (!err) {
            var htmlName = ejsName.replace('.ejs', '.html');
            fs.writeFile(htmlPath + htmlName, result, function (err) {
            });
        }
        else {
            console.log(err);
        }
    });
}

ejs2html("index.ejs")
