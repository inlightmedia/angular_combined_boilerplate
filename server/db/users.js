var ForerunnerDB = require("forerunnerdb");

var fdb = new ForerunnerDB(),
    db = fdb.db("test");
var users = db.collection("users", {
    primaryKey: "id"
});

// db.persist.addStep(new db.shared.plugins.FdbCompress());
//
// db.persist.addStep(new db.shared.plugins.FdbCrypto({
//     pass: "testing"
// }));

db.persist.dataDir("./configData");

users.load(function(err) {
    if (!err) {
        var name = users.find({
            username: {
                $exists: true
            }
        });
        if (typeof name[0] !== 'undefined') {
            console.log('Database contains data.');
        } else {
            console.log('Database is empty: Inserting admin user data.');
            users.insert({
                id: 1,
                username: 'admin',
                password: 'admin',
                displayName: 'Admin',
                email: 'admin@admin.admin',
                admin: true
            });

            users.save(function(err) {
                if (!err) {
                    console.log('Changes saved to file.');
                }
            });
        }
        console.log('Database Loaded!');
    }
});

exports.findById = function(id, cb) {
    process.nextTick(function() {
        var result = users.find({
            id: id
        });
        var user = result[0];
        if (user) {
            cb(null, user);
        } else {
            cb(new Error('User ' + id + ' does not exist'));
        }
    });
}

exports.findByUsername = function(username, cb) {
    process.nextTick(function() {
        var result = users.find({
            username: username
        });
        var user = result[0];

        if (typeof user !== 'undefined') {
            return cb(null, user);
        } else {
            // return cb(null, null);
            //return cb(new Error('User ' + username + ' does not exist'))
        }
        return cb(null, null);
    });
}

exports.getNextId = function(){
	// Finds the largest id in the database, adds one, then returns the new number.
	var id = users.find({

	},{
		$orderBy: {
			id: -1
		},
		$limit: 1
	});
	var incId = id[0].id + 1;
	// console.log(typeof incId, incId, typeof id, 'NUMBER OF ID: ', id[0].id);
	return incId;
}

exports.addNewUser = function(user, cb) {
    process.nextTick(function() {
        if (user) {
			users.insert({
				id: user.id,
				username: user.username,
	            password: user.password,
	            displayName: user.displayName,
	            email: user.email,
				// Converts String 'true' to Boolean true before saving to database.
	            admin: (user.admin === 'true')
	        });

			// save the user
	        users.save(function(err) {
	            if (!err) {
	                console.log('Changes saved to file.');
	            }
	        });
            return cb(null, user);
        } else {
            return cb(new Error('User data not valid.'));
        }
    });
}

exports.updateUserById = function (id, user, cb) {
	process.nextTick(function () {
			var updatedUserData = users.updateById(id, {
				username: user.username,
				password: user.password,
				displayName: user.displayName,
				email: user.email,
				admin: user.admin
			});
			console.log(updatedUserData);
			if(typeof updatedUserData !== 'undefined') {
				users.save(function(err) {
		            if (!err) {
		                console.log('Changes saved to file.');
		            }
		        });
				return cb(null, updatedUserData);
			} else {
				return cb('Could not update user.', null);
			}
	});
}

exports.removeUser = function (id, cb) {
	process.nextTick(function () {
			var removedUser = users.remove({id});
			if (removedUser) {
				users.save(function(err) {
		            if (!err) {
		                console.log('Changes saved to file.');
		            }
		        });
				cb(null, removedUser);
			} else {
				cb('Could not remove user.', null);
			}

	});
}

exports.getAllUsers = function(cb) {
    process.nextTick(function() {
			var allUsers = users.find({},{
				username: 1,
				displayName: 1,
				admin: 1,
				email: 1
			});

			if (typeof allUsers ===  'undefined')
				return cb(new Error('Could not get users.'));

			return cb(null, allUsers);
    });
}
