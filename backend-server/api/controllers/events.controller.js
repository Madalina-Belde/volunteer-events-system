'use strict';

var mongoose = require('mongoose'),
    Event = mongoose.model('Events');

// All events
exports.list_all_events = function(req, res) {
    Event.find({}, function(err, events) {
        if (err)
            res.send(err);
        res.json(events);
    });
};

exports.create_event = function(req, res) {
    var new_event = new Event(req.body);
    new_event.save(function(err, event) {
        if (err)
            res.send(err);
        res.json(event);
    });
};

// Specific event
exports.read_event = function(req, res) {
    Event.findById(req.params.eventId, function(err, event) {
        if (err)
            res.send(err);
        res.json(event);
    });
};

exports.update_event = function(req, res) {
    Event.fineOneAndUpdate({ _id: req.params.eventId }, req.body, { new: true }, function(err, event) {
        if (err)
            res.send(err);
        res.json(event);
    });
};

exports.post_to_event = function(req, res) {
    Event.fineOneAndUpdate({ _id: req.params.eventId }, { $push: { posts: req.body } }, { upsert: true }, function(err, event) {
        if (err)
            res.send(err);
        res.json(event);
    });
};

exports.delete_event = function(req, res) {
    Event.remove({ _id: req.params.eventId }, function(err, event) {
        if (err)
            res.send(err);
        res.json({ message: 'Event successfully deleted' });
    });
};

// Participants
exports.read_participants = function(req, res) {
    Event.findById(req.params.eventId, function(err, event) {
        if (err)
            res.send(err);
        res.json(event.participants);
    });
};

exports.add_participant = function(req, res) {
    Event.fineOneAndUpdate({ _id: req.params.eventId }, { $push: { participants: req.userId } }, { upsert: true }, function(err, participant) {
        if (err)
            res.send(err);
        res.json(participant);
    });
};

exports.delete_participant = function(req, res) {
    Event.fineOneAndUpdate({ _id: req.params.eventId }, { $pull: { participants: req.userId } }, { upsert: true }, function(err, participant) {
        if (err)
            res.send(err);
        res.json({ message: 'Event successfully deleted' });
    });
};

// Event permission verification
exports.check_if_owned = function(req, res, next) {
    Event.findById(req.params.eventId, function(err, event) {
        if (err)
            res.send(err);
        if (req.userId != event.creatorId)
            return res.status(500).send({ auth: false, message: 'Only event owner can perform this action.' });
        next();
    });
};