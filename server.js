"use strict";
// Required files ==========================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var morgan = require('morgan');
var passport = require('passport');
var swig = require('swig');
var helmet = require('helmet');
var multer = require('multer');
var path = require('path');


// Configuration ===========================================
require('./config/init')();
var config = require('./config/config');
var port = process.env.PORT || 8080;
mongoose.connect(config.db);

var connection = mongoose.connection;
connection.once('open', function() {
  console.log('Successfully connected to: ' + config.db)
});

// Modules =================================================
config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
  require(path.resolve(modelPath));
});

// Security ==================================================
app.use(helmet.xframe());
app.use(helmet.xssFilter());
app.use(helmet.nosniff());
app.use(helmet.ienoopen());
app.disable('x-powered-by');

// Express application middleware
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(multer({
  dest: config.tempFolder,
  inMemory: false,
  rename: function(fieldname, filename) {
    return Date.now();
  },
  onFileUploadStart: function(file) {
    if (file.extension.toLowerCase() !== 'pdf' &&
        file.extension.toLowerCase() !== 'png' &&
        file.extension.toLowerCase() !== 'jpg')
      return false;
  },
  onFileUploadComplete: function(file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path);
  }
}));

app.use(session({
  secret: 'watchoutfortheooze', //session cookie is signed with this secret to prevent tampering
  resave: true, //forces session to be saved even when unmodified
  saveUninitialized: true //forces a session that is "uninitialized" to be saved to the store.
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(express.static(__dirname + '/public'));

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');
require('./config/passport')();



// Routes  =================================================
config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
  require(path.resolve(routePath))(app);
});

// Start app ===============================================
app.listen(port, function() {
  console.log('Started on port ' + port);
});





// Seed Test Data ==========================================
// =========================================================
//var Promise = require('bluebird');
//var User = require('./app/models/user');
//var Script = require('./app/models/script');
//var crypto = require('crypto');
//
//Promise.promisifyAll(User);
//Promise.promisifyAll(User.prototype);
//Promise.promisifyAll(mongoose.Query.prototype);
//
//User.remove().execAsync()
//  .then(function() {
//    return Script.remove().execAsync();
//  })
//  .then(function() {
//    var user = new User({
//      displayName: 'PJ' + ' ' + 'Targun',
//      firstName: 'Pj',
//      lastName: 'Targun',
//      email: 'pjtargun@gmail.com',
//      username: 'pjtargun@gmail.com',
//      password: 'passpass123',
//      access: 'Basic',
//      avatarImg: 'http://placehold.it/50x50',
//      provider: 'local',
//      bio: 'Bacon beef ribs short ribs, meatball shank ground round pork chop flank turkey. Leberkas turducken ribeye beef ribs chicken, chuck corned beef picanha filet mignon pork chop sirloin drumstick bresaola pancetta turkey. Boudin t-bone capicola drumstick.',
//      dob: new Date('1985-02-03'),
//      location: 'Chicago, IL',
//      sex: 'Male',
//      link: 'http://SocketBot.com/',
//      profession: 'Developer'
//    });
//
//    return User(user).saveAsync();
//  })
//  .then(function(user) {
//    var script = new Script({
//      title: 'Test Script 1',
//      description: 'Picanha fatback pancetta leberkas bacon turducken bresaola sausage chicken. Cupim chuck biltong pastrami. Beef ribs doner picanha drumstick chuck shankle bresaola capicola sirloin filet mignon andouille sausage ribeye salami. ',
//      genres: ['Drama'],
//      catergory: 'TV',
//      type: 'Fiction',
//      author: user[0]
//    });
//    return Script(script).saveAsync();
//  })
//  .then(function(script) {
//    return User.updateAsync({
//      _id: script[0].author
//    }, {
//      $push: {
//        uploads: {
//          script: script[0]
//        },
//        activity: {
//          action: 'Uploaded',
//          script: script[0]
//        }
//      }
//    });
//  })
//  .then(function() {
//    var user = new User({
//      displayName: 'Phil' + ' ' + 'Targun',
//      firstName: 'Phil',
//      lastName: 'Targun',
//      email: 'phil@toptal.com',
//      username: 'phil@toptal.com',
//      password: 'passpass123',
//      access: 'Basic',
//      avatarImg: 'http://placehold.it/50x50',
//      provider: 'local',
//      bio: 'Turducken ribeye chicken capicola picanha swine, tenderloin beef ribs pastrami chuck fatback shank strip steak alcatra pork chop. Drumstick biltong pork prosciutto jerky.',
//      dob: new Date('1985-01-03'),
//      location: 'Chicago, IL',
//      sex: 'Male',
//      link: 'http://SocketBot.com/',
//      profession: 'Developer'
//    });
//    return User(user).saveAsync();
//  })
//  .then(function(user) {
//    var script = new Script({
//      title: 'Test Script 2',
//      description: 'Corned beef boudin short loin, frankfurter ball tip ham pork. Cow beef beef ribs, pork tenderloin kielbasa pastrami pig pork belly ball tip tail drumstick swine fatback doner.',
//      genres: ['Drama'],
//      catergory: 'TV',
//      type: 'Fiction',
//      author: user[0]
//    });
//    return Script(script).saveAsync();
//  })
//  .then(function(script) {
//    return User.updateAsync({
//      _id: script[0].author
//    }, {
//      $push: {
//        uploads: {
//          script: script[0]
//        },
//        activity: {
//          action: 'Uploaded',
//          script: script[0]
//        }
//      }
//    });
//  });
