'use strict';

module.exports = function(app) {
    var eventController = require('../controllers/events.controller');
    var authController = require('../controllers/auth.controller');
    var userController = require('../controllers/users.controller')

    app.route('/api/events')
        .get(eventController.list_all_events)
        .post(authController.verify_token, userController.verify_permission_ngo, eventController.create_event);

    app.route('/api/events/:eventId')
        .get(eventController.read_event)
        .put(authController.verify_token, eventController.check_if_owned, userController.verify_permission_ngo, eventController.update_event)
        .delete(authController.verify_token, eventController.check_if_owned, userController.verify_permission_ngo, eventController.delete_event);

    app.route('/api/events/:eventId/participants')
        .get(eventController.read_participants)
        .post(authController.verify_token, userController.verify_permission_volunteer, eventController.add_participant)
        .delete(authController.verify_token, userController.verify_permission_volunteer, eventController.delete_participant);

    app.route('/api/events/:eventId/posts')
        .get(eventController.read_posts)
        .post(authController.verify_token, eventController.check_if_owned, userController.verify_permission_ngo, eventController.add_post);

    app.route('/api/events/:eventId/posts/:postId')
        .delete(authController.verify_token, eventController.check_if_owned, userController.verify_permission_volunteer, eventController.delete_post);

};
