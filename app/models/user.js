"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
    return (this.provider !== 'local' || (password && password.length > 6));
};


var user = new Schema({
    provider: {
        type: String,
        required: 'Provider is required'
    },
    providerData: {},
    additionalProvidersData: {},
    accessToken: {
        type: String
    },
    displayName: {
        type: String,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your first name']
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your last name']
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your email'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    comfirmedEmail: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        unique: true,
        required: 'Please fill in a username',
        trim: true
    },
    salt: {
        type: String
    },
    password: {
        type: String,
        default: '',
        validate: [validateLocalStrategyPassword, 'Password should be longer']
    },
    access: {
        type: String,
        enum: ['Basic', 'Paid', 'Admin']
    },
    bio: {
        type: String,
        trim: true,
        default: '',
    },
    dob: {
        type: Date,
    },
    location: {
        type: String,
    },
    sex: {
        type: String,
        enum: ['Male', 'Female']
    },
    link: {
        type: String
    },
    profession: {
        type: String
    },
    avatarImg: {
        type: String,
        default: '//scriptduploads.s3.amazonaws.com/1424274913115.png',
    },
    activity: [{
        script: {
            type: ObjectId,
            ref: 'Script'
        },
        action: {
            type: String,
            enum: ['Favorited', 'Uploaded', 'Purchased']
        },
        created: {
            type: Date,
            default: Date.now
        }
    }],
    uploads: [{
        script: {
            type: ObjectId,
            ref: 'Script'
        },
        created: {
            type: Date,
            default: Date.now
        }
    }],
    purchases: [{
        script: {
            type: ObjectId,
            ref: 'Script'
        },
        created: {
            type: Date,
            default: Date.now
        }
    }],
    favorites: [{
        script: {
            type: ObjectId,
            ref: 'Script'
        },
        created: {
            type: Date,
            default: Date.now
        }
    }],
    followers: [{
        user: {
            type: ObjectId,
            ref: 'User'
        },
        created: {
            type: Date,
            default: Date.now
        }
    }],
    following: [{
        user: {
            type: ObjectId,
            ref: 'User'
        },
        created: {
            type: Date,
            default: Date.now
        }
    }],
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
});

// methods ======================
user.pre('save', function(next) {
    if (this.password && this.password.length > 6) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }

    next();
});

user.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};

user.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

user.statics.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne({
        username: possibleUsername
    }, function(err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};

module.exports = mongoose.model('User', user);
