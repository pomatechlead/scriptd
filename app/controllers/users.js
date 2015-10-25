"use-strict";

var Promise = require('bluebird');
var errorHandler = require('./errors');
var mongoose = require('mongoose');
var Script = require('../models/script');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var async = require('async');
var crypto = require('crypto');
var passport = require('passport');
var User = require('../models/user');
var config = require('../../config/config');
var knox = require('knox');
var _ = require('lodash');

var knoxClient = knox.createClient({
    key: config.AmazonS3.AccessKey,
    secret: config.AmazonS3.SecretKey,
    bucket: config.AmazonS3.DynamicBucketName
});

Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);
Promise.promisifyAll(mongoose.Query.prototype);

// Authentication ======================================
exports.signup = function(req, res) {
    delete req.body.roles;
    var user = new User(req.body);
    var message = null;
    user.provider = 'local';
    user.displayName = user.firstName + ' ' + user.lastName;
    user.username = user.email;
    user.avatarImg = req.session.avatarImg;
    user.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            user.password = undefined;
            user.salt = undefined;

            req.login(user, function(err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(user);
                }
            });
        }
    });
};
exports.socialSignup = function(req, res) {
    var user = req.user;
    var message = null;
    delete req.body.roles;
    if (user) {
        user = _.extend(user, req.body);
        user.updated = Date.now();
        user.avatarImg = req.session.avatarImg;
        user.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                user.password = undefined;
                user.salt = undefined;

                req.login(user, function(err) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        res.json(user);
                    }
                });
            }
        });
    }
};
exports.uploadPhoto = function(req, res) {
  if (!req.files.file)
    return res.status(400).json("File not provided.");
  knoxClient.putFile(req.files.file.path, req.files.file.name, { 'x-amz-acl': 'public-read' },
    function(s3err, s3res){
      if(s3err)
        console.log(s3err.message);
      req.session.avatarImg = s3res.req.url.replace('http:','').replace('https:','');
      res.json(s3res.req.url.replace('http:','').replace('https:',''));
  });
};
exports.signin = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err || !user) {
            res.status(400).send(info);
        } else {
            user.password = undefined;
            user.salt = undefined;
            req.login(user, function(err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(user);
                }
            });
        }
    })(req, res, next);
};

exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

exports.oauthCallback = function(strategy) {
    return function(req, res, next) {
        passport.authenticate(strategy, function(err, user, redirectURL) {
            if (err || !user) {
                return res.redirect('/#/signin');
            }
            req.login(user, function(err) {
                if (err) {
                    return res.redirect('/#/signin');
                }
                if (user.bio === ''){
                    return res.redirect('/#/socialSignup');
                }else{
                    return res.redirect(redirectURL || '/');
                }
            });
        })(req, res, next);
    };
};


// Authorization =======================================
exports.userByID = function(req, res, next, id) {
    User.findOne({
        _id: id
    })
    .select('-password -salt -accessToken')
    .exec(function(err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Failed to load User ' + id));

        req.profile = user;
        next();
    });
};
exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({
            message: 'User is not logged in'
        });
    }
    next();
};
exports.hasAuthorization = function(req, res, next) {
    if (req.profile.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
    if (!req.user) {
        var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
        var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;
        var mainProviderSearchQuery = {};
        mainProviderSearchQuery.provider = providerUserProfile.provider;
        mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];
        var additionalProviderSearchQuery = {};
        additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];
        var searchQuery = {
            $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
        };
        User.findOne(searchQuery, function(err, user) {
            if (err) {
                return done(err);
            } else {
                if (!user) {
                    var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

                    User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
                        user = new User({
                            firstName: providerUserProfile.firstName,
                            lastName: providerUserProfile.lastName,
                            username: availableUsername,
                            displayName: providerUserProfile.displayName,
                            email: providerUserProfile.email,
                            provider: providerUserProfile.provider,
                            providerData: providerUserProfile.providerData
                        });
                        user.save(function(err) {
                            return done(err, user);
                        });
                    });
                } else {
                    return done(err, user);
                }
            }
        });
    } else {
        var user = req.user;
        if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
            if (!user.additionalProvidersData) user.additionalProvidersData = {};
            user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;
            user.markModified('additionalProvidersData');
            user.save(function(err) {
                return done(err, user, '/#!/settings/accounts');
            });
        } else {
            return done(new Error('User is already connected using this provider'), user);
        }
    }
};

// Passwords ===========================================

exports.forgot = function(req, res, next) {
    async.waterfall([
        // Generate random token
        function(done) {
            crypto.randomBytes(20, function(err, buffer) {
                var token = buffer.toString('hex');
                done(err, token);
            });
        },
        // Lookup user by username
        function(token, done) {
            if (req.body.email) {
                User.findOne({
                    email: req.body.email
                }, '-salt -password', function(err, user) {
                    if (!user) {
                        return res.status(400).send({
                            message: 'No account with that username has been found'
                        });
                    } else if (user.provider !== 'local') {
                        return res.status(400).send({
                            message: 'It seems like you signed up using your ' + user.provider + ' account'
                        });
                    } else {
                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                        user.save(function(err) {
                            done(err, token, user);
                        });
                    }
                });
            } else {
                return res.status(400).send({
                    message: 'Username field must not be blank'
                });
            }
        },
        function(token, user, done) {
            res.render('resetpassword', {
                name: user.displayName,
                appName: config.app.title,
                url: 'http://' + req.headers.host + '/auth/reset/' + token
            }, function(err, emailHTML) {
                done(err, emailHTML, user);
            });
        },
        // If valid email, send reset email using service
        function(emailHTML, user, done) {
            var smtpTransport = nodemailer.createTransport(config.mailer.options);
            var mailOptions = {
                to: user.email,
                from: config.mailer.from,
                subject: 'Password Reset',
                html: emailHTML
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                if (!err) {
                    res.send({
                        message: 'An email has been sent to ' + user.email + ' with further instructions.'
                    });
                }

                done(err);
            });
        }
    ], function(err) {
        if (err) return next(err);
    });
};
exports.validateResetToken = function(req, res) {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function(err, user) {
        if (!user) {
            return res.redirect('/#!/password/reset/invalid');
        }

        res.redirect('/#/main/modal/reset/' + req.params.token);
    });
};
exports.reset = function(req, res, next) {
    // Init Variables
    var passwordDetails = req.body;
    async.waterfall([
        function(done) {
            User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {
                    $gt: Date.now()
                }
            }, function(err, user) {
                if (!err && user) {
                    if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
                        user.password = passwordDetails.newPassword;
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function(err) {
                            if (err) {
                                return res.status(400).send({
                                    message: errorHandler.getErrorMessage(err)
                                });
                            } else {
                                req.login(user, function(err) {
                                    if (err) {
                                        res.status(400).send(err);
                                    } else {
                                        res.json(user);
                                        done(err, user);
                                    }
                                });
                            }
                        });
                    } else {
                        return res.status(400).send({
                            message: 'Passwords do not match'
                        });
                    }
                } else {
                    return res.status(400).send({
                        message: 'Password reset token is invalid or has expired.'
                    });
                }
            });
        },
        function(user, done) {
            res.render('resetpasswordconfirm', {
                name: user.displayName,
                appName: config.app.title
            }, function(err, emailHTML) {
                done(err, emailHTML, user);
            });
        },
        // If valid email, send reset email using service
        function(emailHTML, user, done) {
            var smtpTransport = nodemailer.createTransport(config.mailer.options);
            var mailOptions = {
                to: user.email,
                from: config.mailer.from,
                subject: 'Your password has been changed',
                html: emailHTML
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
    });
};
exports.changePassword = function(req, res) {
    var passwordDetails = req.body;
    if (req.user) {
        if (passwordDetails.newPassword) {
            User.findById(req.user.id, function(err, user) {
                if (!err && user) {
                    if (user.authenticate(passwordDetails.currentPassword)) {
                        if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
                            user.password = passwordDetails.newPassword;

                            user.save(function(err) {
                                if (err) {
                                    return res.status(400).send({
                                        message: errorHandler.getErrorMessage(err)
                                    });
                                } else {
                                    req.login(user, function(err) {
                                        if (err) {
                                            res.status(400).send(err);
                                        } else {
                                            res.send({
                                                message: 'Password changed successfully'
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            res.status(400).send({
                                message: 'Passwords do not match'
                            });
                        }
                    } else {
                        res.status(400).send({
                            message: 'Current password is incorrect'
                        });
                    }
                } else {
                    res.status(400).send({
                        message: 'User is not found'
                    });
                }
            });
        } else {
            res.status(400).send({
                message: 'Please provide a new password'
            });
        }
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }
};

// Profile =============================================
exports.me = function(req, res) {
    res.json(req.user || null);
};

exports.user = function(req, res) {
    res.json(req.profile || null);
};

exports.update = function(req, res) {
    // Init Variables
    var user = req.user;
    var message = null;

    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;
    if (user) {
        // Merge existing user
        user = _.extend(user, req.body);
        user.updated = Date.now();
        user.displayName = user.firstName + ' ' + user.lastName;
        if(req.session.avatarImg)
          user.avatarImg = req.session.avatarImg;
        user.save(function(err, user) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
              res.json(user);
            }
        });
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }
};
