var express = require('express');
var router = express.Router();
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('../db');
var path = require('path');
var flash = require('connect-flash');
var bodyParser = require('body-parser');

// ======================================================= //
//				PASSPORTJS AUTHENTICATION SETUP
// ======================================================= //

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy({
        passReqToCallback: true
    },
    function(req, username, password, cb) {
        db.users.findByUsername(username, function(err, user) {

            if (err) {
                return cb(err);
            }
            if (!user) {
                return cb(null, false, req.flash('message', 'User Not found.'));
            }
            if (user.password != password) {
                return cb(null, false, req.flash('message', 'Password Incorrect.'));
            }

            return cb(null, user);
        });
    }));

passport.use('signup', new Strategy({
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, cb) {

        db.users.findByUsername(username, function(err, user) {
            if (err) {
                console.log('Error in registration: ' + err);
                return cb(err);
            }
            if (user) {
                console.log('User already exists with username: ' + username);
                return cb(null, false, req.flash('message', 'User Already Exists'));
            } else {

				// if there is no user with that username
                // create the user
                var newUser = {};

                // set the user's local credentials

				newUser.id = db.users.getNextId();
				newUser.username = req.body.username;
                // newUser.password = createHash(password);
				newUser.password = password;
				newUser.displayName = req.body.displayName;
				newUser.email = req.body.email;
				newUser.admin = (req.body.admin === 'true'); // This converts 'true' to true AND 'false' to false

				console.log(newUser);

				db.users.addNewUser(newUser, function(err, user){
					if (err) {
		                console.log('Error in registration: ' + err);
		                return cb(err);
		            } else {
						console.log(user);
						console.log('User ID: ' + user.id + ' successfuly registered');
						return cb(null, user);
					}
				});
            }
        });
    }));

// The addOtherUser function is called by app.post to '/adduser' which receives the add new user form submission
// It adds the user but does no authentication of the user, thus it does not use passport
// The signup post call both registers and authenticates but this was not ideal if a signed in user was creating another user with less privelage
var addOtherUser = function(req, res, cb) {

	var username = req.body.username;
	var password = req.body.password;

	db.users.findByUsername(username, function(err, user) {
		if (err) {
	        console.log('Error in registration: ' + err);
	        return cb('Error Adding New User!');
	    }
	    if (user) {
	        console.log('User already exists with username: ' + username);
	        return cb('User Already Exists!', null);
	    } else {

			// if there is no user with that username
	        // create the user
	        var newUser = {};

	        // set the user's local credentials

			newUser.id = db.users.getNextId();
			newUser.username = username;
	        // newUser.password = createHash(password);
			newUser.password = password;
			newUser.displayName = req.body.displayName;
			newUser.email = req.body.email;
			// This converts 'true' to true AND 'false' to false and assigns it to new user's admin status
			newUser.admin = (req.body.admin === 'true');

			console.log(newUser);

			db.users.addNewUser(newUser, function(err, user){
				if (err) {
	                console.log('Error in registration: ' + err);
	                return cb('Error: System was not able to add new user!');
	            } else {
					console.log(user);
					console.log('User ID: ' + user.id + ' successfuly registered');
					return cb(null, user);
				}
			});
	    }
	});
};


/////// THESE ARE NOT USED CURRENTLY ////////////
// Generates hash using bCrypt
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

var validPassword = function(password) {
	return bcrypt.compareSync(password, users.password); // compare the password entered to the one on databse for the username
};
/////////////////////////////////////////////////


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    db.users.findById(id, function(err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});

// Database Interaction Code
// var db = require('../db');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
router.use(require('morgan')('combined'));
router.use(require('cookie-parser')());

// parse application/x-www-form-urlencoded
router.use(require('body-parser').urlencoded({
    extended: true
}));

// parse application/json
router.use(bodyParser.json())

router.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
router.use(flash());
// Initialize Passport and restore authentication state, if any, from the
// session.
router.use(passport.initialize());
router.use(passport.session());

// GET - Find All Users
router.get('/',
	require('connect-ensure-login').ensureLoggedIn(),
	function (req, res) {
		var loggedInUser = req.user;
		console.log(loggedInUser);
		db.users.getAllUsers(function (err, users) {
			if (err) {
				res.send(err);
			} else {
				res.json(users);
			}
		});
	});

router.get('/login', function (req, res) {
	console.log('sdfsdfsdfsdf');
	if (req.user) {
		console.log(req.user);
		res.send('Hi, ' + req.user.username);
	} else {
		console.log('No User');
	}
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        // failureRedirect: '/login/failure',
        failureFlash: true
    }),
    function(res, req) {

		// if (typeof user === 'undefined') {
        // 	console.log('fgdfgdfg');
        // 	res.redirect('/');
        // }
    });

router.get('/logout', function(req, res) {
        req.logout();
		req.session.destroy();
		console.log('XXXXXXXXX');
        // res.json({'message': 'You are logged out'});
		res.redirect('/');
    });

router.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res) {

    });

// GET - Find User by Id
router.get('/:id',
	require('connect-ensure-login').ensureLoggedIn(),
	function (req, res) {
		db.users.findById(req.params.id, function (err, user) {
			if (err) {
				res.send(err);
			} else {
				res.json(user);
			}
		});
	});

router.get('/username/:username',
	require('connect-ensure-login').ensureLoggedIn(),
	function (req, res) {
		db.users.findByUsername(req.params.username, function (err, user) {
			if (err) {
				res.send(err);
			} else {
				res.json(user);
			}
		});
	});

// POST - Add New User
router.post('/',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res, next){
		var user = req.body;
		console.log(user);
		console.log(req.body);

		db.users.addNewUser(user, function(err, user){
			if (err) {
				res.send(err);
			}
			res.json(user);
		});
	});

// PUT - Update User By Id
router.put('/:id',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res){
		var id = req.params.id;
		var user = req.body;
		console.log(user.username + id);
		db.users.updateUserById(id, user, function(err, user){
			if (err) {
				res.send(err);
			}
			res.json(user);
		});
	});

// DELETE Remove User by Id
router.delete('/:id',
	require('connect-ensure-login').ensureLoggedIn(),
	function (req, res) {
		var id = req.params.id;
		db.users.removeUser(id, function (err, user) {
			if (err) {
				res.send(err);
			}
			res.json(user);
		});
	});

module.exports = router;
