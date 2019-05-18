'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const UserType = Object.freeze({
    ADMIN: 0,
    VOLUNTEER: 1,
    NGO: 2
});

var UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    type: {
        type: Number,
        enum: Object.values(UserType)
    }
});

Object.assign(UserSchema.statics, {
    UserType
});

module.exports = mongoose.model('Users', UserSchema);
