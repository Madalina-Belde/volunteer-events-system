'use strict';

var userController = require('../controllers/users.controller')
var mongoose = require('mongoose'),
    Event = mongoose.model('Events');

// All events
exports.list_all_events = function(req, res) {
    Event.find({}, function(err, events) {
        if (err)
            return res.status(500).send(err);
        res.status(200).json(events);
    });
};

exports.create_event = function(req, res) {
    if (req.body == null ||
        req.body.name == null ||
        req.body.date == null ||
        req.body.description == null ||
        req.body.location == null)
        return res.status(400).send({ message: 'Missing fields' });

    var new_event = new Event(req.body);
    new_event.creatorId = req.userId;
    new_event.save(function(err, event) {
        if (err)
            return res.status(500).send(err);
        res.status(200).json(event);
    });
};

// Specific event
exports.read_event = function(req, res) {
    Event.findById(req.params.eventId, function(err, event) {
        if (err)
            return res.status(500).send(err);
        res.status(200).json(event);
    });
};

exports.update_event = function(req, res) {
    Event.findOneAndUpdate({ _id: req.params.eventId }, req.body, { new: true }, function(err, event) {
        if (err)
            return res.status(500).send(err);
        res.status(200).json(event);
    });
};

exports.delete_event = function(req, res) {
    Event.remove({ _id: req.params.eventId }, function(err, event) {
        if (err)
            return res.status(500).send(err);
        if (event.deletedCount == 0)
            return res.status(404).json({ message: 'Event does not exist' });
        res.status(200).json({ message: 'Event successfully deleted' });
    });
};

// Participants
exports.read_participants = function(req, res) {
    Event.findById(req.params.eventId, function(err, event) {
        if (err)
            return res.status(500).send(err);
        res.status(200).json(event.participants);
    });
};

exports.add_participant = function(req, res) {
    Event.findById(req.params.eventId, function(err, event) {
        if (err)
            return res.status(500).send(err);
        if (event.participants.includes(req.userId))
            return res.status(400).send({ message: 'Participant already exists.' });
    
        event.update({ $push: { participants: req.userId } }, { upsert: true }, function(err, participant) {
            if (err)
                return res.status(500).send(err);
            res.status(200).json({ message: 'Participant successfully added' });
        });
    });
};

exports.delete_participant = function(req, res) {
    Event.findById(req.params.eventId, function(err, event) {
        if (err)
            return res.status(500).send(err);
        if (!event.participants.includes(req.userId))
            return res.status(404).send({ message: 'Participant not found.' });
    
        event.update({ $pull: { participants: req.userId } }, { upsert: true }, function(err, participant) {
            if (err)
                return res.status(500).send(err);
            res.status(200).json({ message: 'Participant successfully deleted' });
        });
    });
};

// Posts
exports.read_posts = function(req, res) {
    Event.findById(req.params.eventId, function(err, event) {
        if (err)
            return res.status(500).send(err);
        res.status(200).json(event.posts);
    });
};

exports.add_post = function(req, res) {
    if (req.body == null ||
        req.body.date == null ||
        req.body.content == null)
        return res.status(400).send({ message: 'Missing fields' });

    Event.findOneAndUpdate({ _id: req.params.eventId }, { $push: { posts: req.body } }, { upsert: true }, function(err, event) {
        if (err)
            return res.status(500).send(err);
        res.status(200).json(event);
    });
};

exports.delete_post = function(req, res) {
    Event.findById(req.params.eventId, function(err, event) {
        if (err)
            return res.status(500).send(err);

        var postFound = false;
        for (var i in event.posts) {
            if (event.posts[i]._id == req.params.postId) {
                postFound = true;
                break;
            }
        }
        if (!postFound)
            return res.status(404).send({ message: 'Post not found.' });
    
        event.update({ $pull: { posts: { _id: req.params.postId } } }, { upsert: true }, function(err, event) {
            if (err)
                return res.status(500).send(err);
            res.status(200).json({ message: 'Post successfully deleted' });
        });
    });
};


// Event permission verification
exports.check_if_owned = function(req, res, next) {
    Event.findById(req.params.eventId, function(err, event) {
        if (err)
            return res.status(500).send(err);
        if (!event)
            return res.status(404).json({ message: 'Event not found' });
        if (req.userId != event.creatorId)
            return res.status(500).send({ auth: false, message: 'Only event owner can perform this action.' });
        next();
    });
};