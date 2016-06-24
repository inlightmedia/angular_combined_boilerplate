// Create a new Express application.
var app = require('express')();
var cors = require('cors');

app.use(cors());

var users = require('./routes/users');

app.use('/api/users', users);

var port = 3001;
app.listen(port);
console.log('API server now listening on port: ' + port);