'use strict';
module.exports = function(app) {
    var usersList = require('../controllers/users.controller.js');
    var authController = require('../controllers/auth.controller');

    app.route('/api/users')
        .get(usersList.list_all_users)
        .post(usersList.create_user);

    app.route('/api/users/:userId')
        .get(usersList.read_user)
        .put(usersList.update_user)
        .delete(usersList.delete_user);
};
