'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    date: String,
    content: String    
});

var EventSchema = new Schema({
    name: String,
    date: String,
    description: String,
    location: String,
    creatorId: String,
    participants: [String],
    posts: [PostSchema]
});

module.exports = mongoose.model('Events', EventSchema);
