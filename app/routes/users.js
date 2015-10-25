'use strict';

var passport = require('passport');

module.exports = function(app) {

  var users = require('../../app/controllers/users');

  app.get('/users/me', users.me);
  app.put('/users/:userId', users.requiresLogin,
    users.hasAuthorization,
    users.update);
  app.get('/users/:userId', users.user);
  app.post('/users/password', users.changePassword);
  app.post('/auth/forgot', users.forgot);
  app.get('/auth/reset/:token', users.validateResetToken);
  app.post('/auth/reset/:token', users.reset);
  app.post('/auth/signin', users.signin);
  app.post('/auth/signup', users.signup);
  app.post('/auth/socialSignup', users.socialSignup);
  app.post('/users/uploadPhoto', users.uploadPhoto);
  app.get('/auth/signout', users.signout);

  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email']
  }));
  app.get('/auth/facebook/callback', users.oauthCallback('facebook'));
  app.param('userId', users.userByID);


  // app.post('/imgupload', function(req, res){
  //   var image = req.files.image;
  //   var newImageLocation = path.join(__dirname, 'public/images', image.name);

  //   fs.readFile(image.path, function(err, data) {
  //       fs.writeFile(newImageLocation, data, function(err) {
  //           res.json(200, { 
  //               src: 'images/' + image.name,
  //               size: image.size
  //           });
  //       });
  //   });
  // })

  
}
