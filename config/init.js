'use strict';

var glob = require('glob');

module.exports = function() {
    glob('./config/env/' + 'heroku' + '.js', {
        sync: true
    }, function(err, environmentFiles) {
        if (!environmentFiles.length) {
            process.env.SERVER_LOCATION = 'heroku';
        }
    });

};
