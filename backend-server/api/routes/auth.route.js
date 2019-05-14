'use strict';
module.exports = function(app) {
    var authController = require('../controllers/auth.controller');

    app.route('/api/auth/register')
        .post(authController.register_user);

    app.route('/api/auth/me')
        .get(authController.verifyToken, authController.get_user_id);

    app.route('/api/auth/login')
        .post(authController.login)
};
