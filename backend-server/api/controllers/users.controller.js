'use strict';

var userModel = require('../models/users.model')
var mongoose = require('mongoose'),
    User = mongoose.model('Users');

exports.list_all_users = function(req, res) {
    User.find({}, { password: 0 }, function(err, users) {
        if (err)
            return res.status(500).send(err);
        res.status(200).json(users);
    });
};

exports.create_user = function(req, res) {
    User.findOne({ email: req.body.email }, function(err, user) {
        if (err)
            return res.status(500).send(err);
        if (user)
            return res.status(400).send({ message: 'User already exists.' });

        var new_user = new User(req.body);
        new_user.save(function(err, user) {
            if (err)
                return res.status(500).send(err);
            user.password = 0;
            res.status(200).json(user);
        });
    });
};

exports.read_user = function(req, res) {
    User.findById(req.params.userId, function(err, user) {
        if (err)
            return res.status(500).send(err);
        user.password = 0;
        res.status(200).json(user);
    });
};

exports.update_user = function(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, req.body, {new: true}, function(err, user) {
        if (err)
            return res.status(500).send(err);
        user.password = 0;
        res.status(200).json(user);
    });
};

exports.delete_user = function(req, res) {
    User.remove({ _id: req.params.userId }, function(err, user) {
        if (err)
            return res.status(500).send(err);
        if (user.deletedCount == 0)
            return res.status(404).json({ message: 'User does not exist' });
        res.status(200).json({ message: 'User successfully deleted' });
    });
};

function is_admin(userId) {
    return User.findById(userId, function(err, user) {
        if (err || user == null)
            return false;
        return (user.type == userModel.UserType.ADMIN);
    });
}

function is_volunteer(userId) {
    return User.findById(userId, function(err, user) {
        if (err || user == null)
            return false;
        return (user.type == userModel.UserType.VOLUNTEER);
    });
}

function is_ngo(userId) {
    return User.findById(userId, function(err, user) {
        if (err || user == null)
            return false;
        return (user.type == userModel.UserType.NGO);
    });
}

exports.verify_permission_admin = function(req, res, next) {
    if (!is_admin(req.userId))
        return res.status(500).send({ auth: false, message: 'Permission required for this action.' });
    next();
};

exports.verify_permission_volunteer = function(req, res, next) {
    if (!is_volunteer(req.userId) && !is_admin(req.userId))
        return res.status(500).send({ auth: false, message: 'Permission required for this action.' });
    next();
};

exports.verify_permission_ngo = function(req, res, next) {
    if (!is_ngo(req.userId) && !is_admin(req.userId))
        return res.status(500).send({ auth: false, message: 'Permission required for this action.' });
    next();
};
