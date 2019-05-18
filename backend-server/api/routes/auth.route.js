'use strict';

module.exports = function(app) {
    var authController = require('../controllers/auth.controller');

    app.route('/api/auth/register')
        .post(authController.register_user);

    app.route('/api/auth/login')
        .post(authController.login)

    app.route('/api/auth/me')
        .get(authController.verify_token, authController.get_my_user);
};
