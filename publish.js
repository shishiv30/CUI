var ghpages = require('gh-pages');
var path = require('path');

ghpages.publish(path.join(__dirname, 'public/dist'), {
    branch:'gh-pages'
}, (err) => {
    if (err) console.log(err);
    else consle.log('Successfully Published!!!!')
});