'use strict';

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config');
var mongoose = require('mongoose'),
    User = mongoose.model('Users');

exports.register_user = function(req, res) {
    if (req.body == null ||
        req.body.name == null ||
        req.body.email == null ||
        req.body.password == null ||
        req.body.type == null)
        return res.status(400).send({ message: 'Missing fields' });

    User.findOne({ email: req.body.email }, function(err, user) {
        if (err)
            return res.status(500).send(err);
        if (user)
            return res.status(400).send({ message: 'User already exists.' });

        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            type: req.body.type
        },
        function(err, user) {
            if (err)
                return res.status(500).send({ message: 'There was a problem registering the user.' });
    
            var token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });
    
            res.status(200).send({ auth: true, token: token });
        });
    });
};

exports.login = function(req, res) {
    if (req.body == null ||
        req.body.email == null ||
        req.body.password == null)
        return res.status(400).send({ message: 'Missing fields' });

    User.findOne({ email: req.body.email }, function(err, user) {
        if (err)
            return res.status(500).send({ message: 'Error on the server.' });
        if (!user)
            return res.status(404).send({ message: 'No user found.' });

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid)
            return res.status(401).send({ auth: false, token: null });

        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).send({ auth: true, token: token });
    });
};

exports.get_my_user = function(req, res) {
    User.findById(req.userId,
        { password: 0 },
        function(err, user) {
            if (err)
                return res.status(500).send({ message: 'There was a problem finding the user.' });
            if (!user)
                return res.status(404).send({ message: 'No user found.' });

            res.status(200).send(user);
    });
};

exports.verify_token = function(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err)
            return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });

        // token is good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    });
};
