'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('Users');

exports.list_all_users = function(req, res) {
    User.find({}, { password: 0 }, function(err, users) {
        if (err)
            res.send(err);
        res.json(users);
    });
};

exports.create_user = function(req, res) {
    var new_user = new User(req.body);
    new_user.save(function(err, user) {
        if (err)
            res.send(err);

        user.password = 0;
        res.json(user);
    });
};

exports.read_user = function(req, res) {
    User.findById(req.params.userId, function(err, user) {
        if (err)
            res.send(err);
            user.password = 0;
        res.json(user);
    });
};

exports.update_user = function(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, req.body, {new: true}, function(err, user) {
        if (err)
            res.send(err);
        user.password = 0;
        res.json(user);
    });
};

exports.delete_user = function(req, res) {
    User.remove({ _id: req.params.userId }, function(err, user) {
        if (err)
            res.send(err);
        res.json({ message: 'User successfully deleted' });
    });
};

exports.is_admin = function(userId) {
    User.findById(userId, function(err, user) {
        return (user.type == User.statics.UserType.ADMIN);
    });
}

exports.is_volunteer = function(userId) {
    User.findById(userId, function(err, user) {
        return (user.type == User.statics.UserType.VOLUNTEER);
    });
}

exports.is_ngo = function(userId) {
    User.findById(userId, function(err, user) {
        return (user.type == User.statics.UserType.NGO);
    });
}