var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    User = require('./api/models/users.model'),
    bodyParser = require('body-parser');

// mongos instance url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/backend-server-db');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var auth_users = require('./api/routes/auth.route');
var route_users = require('./api/routes/users.route');
auth_users(app);
route_users(app);

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('Backend server started on: ' + port);
