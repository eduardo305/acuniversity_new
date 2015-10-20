var config      = require('../../config');

var express     = require('express');
var nodemailer  = require('nodemailer');
var apiRoutes 	= express.Router();

module.exports = function(app, User, Course) {

	// Fetch all (full) users
	apiRoutes.get('/users', isLoggedIn, function(req, res) {

		User.find().select('-password').populate('classrooms approvals').exec(function(err, docs) {
			var options = {
	          path: 'classrooms.course approvals.course',
	          model: 'Course'
	        }

	        if (err) throw err;

	        User.populate(docs, options, function(err, users) {
	          res.json({ success: true, users: users });
	        });

		});
	});

	// Fetch user by it's email account
	apiRoutes.get('/users/:email', isLoggedIn, function(req, res) {

		User.find({email: req.params.email + '@avenuecode.com'}).select('-password').populate('classrooms approvals').exec(function(err, docs) {
			var options = {
	          path: 'classrooms.course approvals.course',
	          model: 'Course'
	        }

	        if (err) throw err;

	        User.populate(docs, options, function(err, user) {
	          res.json({ success: true, user: user });
	        });
		});
	});

	// Fetch a user's certificates by e-mail user
	// The e-mail needs to be sent without the domain (@avenuecode.com)
	apiRoutes.get('/users/certificates/:email', isLoggedIn, function(req, res) {

		User.find({email: req.params.email + '@avenuecode.com'}).populate('approvals').select('-classrooms -admin -__v -_id -name -email -password').exec(function(err, docs) {

			var options = {
	          path: 'approvals.course',
	          model: 'Course'
	        }

	        if (err) throw err;

	        User.populate(docs, options, function(err, certificates) {
	        	res.json({success: true, certificates: certificates});
	        });
		});

	});

	// Approve a student by updating his approval array with the new
	// classroom/course he got approval
	apiRoutes.put('/users/approvals/:email', isLoggedIn, function(req, res) {
		User.findOne({
			email: req.params.email + '@avenuecode.com'
		}, function(err, user) {
			if (err) throw err;

			if (!user) {
				res.json({success: false, message: 'user not found...'});
			} else {
				if (user.approvals.toString().indexOf(req.body.classroomid) === -1) {
					user.approvals.push(req.body.classroomid);

					user.save(function(err) {
						if (err) throw err;

						res.json({success: true, user: user});
					});

				} else {
					res.json({success: false, message: 'user already has this certificate'});
				}
			}
		}).select('-password');
	});

	// Fetch all students from a specific classroom
	apiRoutes.get('/students/:classroomid', function(req, res) {
	  User.find({classrooms: req.params.classroomid}, function(err, users) {
	    res.json(users);
	  }).select('-admin -password');
	});

	// Register/Unregister in a course
	apiRoutes.put('/register/:email', isLoggedIn, function(req, res) {
	  User.findOne({
	    email: req.params.email + '@avenuecode.com'
	  }, function(err, user) {
	    if (err) throw err;

	    if (!user) {
	      res.json({ success: false, message: 'Register failed. User not found.' });
	    } else {

	      if (user.classrooms.toString().indexOf(req.body.classrooms) === -1) {
	        user.classrooms.push(req.body.classrooms);

	        user.save(function(err) {
	            if (err) throw err;

	            user.password = '';
	            console.log('Registered successfully');
	            res.json({ success: true, user: user });
	        });
	      } else {
	        res.json({ success: false, message: 'You are already registered!' });
	      } 
	      
	    }
	  });
	});

	// Register/Unregister in a course
	apiRoutes.put('/quit/:email', isLoggedIn, function(req, res) {
	  User.findOne({
	    email: req.params.email + '@avenuecode.com'
	  }, function(err, user) {
	    var elementIndex = -1;

	    if (err) throw err;

	    if (!user) {
	      res.json({ success: false, message: 'Register failed. User not found.' });
	    } else {
	      if (user.classrooms.toString().indexOf(req.body.classrooms) !== -1) {

	        user.classrooms.splice(user.classrooms.indexOf(req.body.classrooms), 1);

	        user.save(function(err) {
	            if (err) throw err;

	            User.findOne({_id: user._id}).populate('classrooms').exec(function (err, docs) {
	              var options = {
	                path: 'classrooms.course',
	                model: 'Course'
	              }

	              Course.populate(docs, options, function(err, courses) {
	                res.json({success: true, user: courses});  
	              });

	            });
	        });

	      } else {
	        res.json({ success: false, message: 'You are not registered!' });
	      } 
	      
	    }
	  });
	});

	apiRoutes.get('/isAuthenticated', isLoggedIn, function(req, res) {
		return res.json({isLoggedIn: req.user !== undefined, user: req.user});
	});

	app.use('/api', apiRoutes);
};

// route middleware to make sure a user is logged in
var isLoggedIn = function(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
	    return next();

	// if they aren't redirect them to the home page
	//res.redirect('/');
	res.json({ success: false, message: 'User is not authenticated.' });
};