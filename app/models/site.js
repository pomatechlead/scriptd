"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var site = new Schema({
    flim: [{
        name: {
            type: String
        },
        type: {
            type: String,
            enum: ['Trending', 'Recent', 'Category', 'Type', 'Tag']
        },
        position: {
            type: Number
        }
    }],
    tv: [{
        name: {
            type: String
        },
        type: {
            type: String,
            enum: ['Trending', 'Recent', 'Category', 'Type', 'Tag']
        },
        position: {
            type: Number
        }
    }]
});

module.exports = mongoose.model('Site', site);