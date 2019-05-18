'use strict';

module.exports = function(app) {
    var eventsList = require('../controllers/events.controller');
    var authController = require('../controllers/auth.controller');

    app.route('/api/events')
        .get(eventsList.list_all_events)
        .post(authController.verify_token, eventsList.create_event);

    app.route('/api/events/:eventId')
        .get(eventsList.read_event)
        .put(authController.verify_token, eventsList.update_event)
        .post(authController.verify_token, eventsList.post_to_event)
        .delete(authController.verify_token, eventsList.delete_event);

    app.route('/api/events/:eventId/participants')
        .get(eventsList.read_participants)
        .post(authController.verify_token, eventsList.add_participant)
        .delete(authController.verify_token, eventsList.delete_participant);
};
