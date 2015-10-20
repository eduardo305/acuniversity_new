var express     = require('express');
var apiRoutes = express.Router();

module.exports = function(app, Course, Class) {

	// Fetch all courses
    apiRoutes.get('/courses', function(req, res) {
      Course.find({}, function(err, courses) {
        res.json({ success: true, courses: courses, user: req.user });
      }).sort({ 'insertdate': 'desc' }).populate('hosts', '-password -admin -courses -classrooms').populate('classes');
    });

    // Fetch one specific course
	apiRoutes.get('/courses/:courseid', function(req, res) {
	  Course.find({_id: req.params.courseid}, function(err, course) {
	    res.json({ success: true, course: course });
	  }).populate('hosts', '-password -admin -courses -classrooms').populate('classes').populate('comments');
	});

	apiRoutes.put('/classrooms/availability/:classroomid', isLoggedIn, function(req, res) {
	  Class.findOne({
	    _id: req.params.classroomid
	  }, function(err, classroom) {
	    if (err) throw err;

	    if (classroom) {
	      classroom.isFull = req.body.isFull;

	      classroom.save(function(err) {
	        if (err) throw err;

	        res.json({ success: true, classroom: classroom });
	      });
	    } else {
	    	res.json({ success: false });
	      	console.log('Classroom not found');
	    }
	  });
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
	res.json({ success: false, message: 'User is not authentiated.' });
};