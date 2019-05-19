'use strict';

module.exports = function(app) {
    var userController = require('../controllers/users.controller.js');
    var authController = require('../controllers/auth.controller');

    app.route('/api/users')
        .get(userController.list_all_users)
        .post(userController.create_user);

    app.route('/api/users/:userId')
        .get(userController.read_user)
        .put(authController.verify_token, userController.verify_permission_admin, userController.update_user)
        .delete(authController.verify_token, userController.verify_permission_admin, userController.delete_user);
};
