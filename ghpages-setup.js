var ghpages = require('gh-pages');

ghpages.publish('build', {
    branch: 'feature/mvc-refactor',
    repo: 'https://github.com/BrandonAGoodwin/nn-visualiser.git',
    remote: 'github'
}, function(err) {});

//"deploy": "gh-pages -d build",