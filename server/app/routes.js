/*// app/routes.js

module.exports = function(app, passport, express, path, User, Course, Comment, Class) {
    app.use(express.static(path.join(__dirname, '../../')));

    // route for home page
    app.get('/', function(req, res) {
        res.sendFile('index.html', { root: path.join(__dirname, '../../') })
    });

    // route for login form
    // route for processing the login form
    // route for signup form
    // route for processing the signup form

    app.get('/login', function(req, res) {
        res.sendFile('index.html', {root: 'public/templates'}); // load the index.ejs file
    });

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    // API ROUTES -------------------
    // get an instance of the router for api routes
    var apiRoutes = express.Router();

    // Fetch one specific user/student
    apiRoutes.get('/users/:userid', function(req, res) {
      User.find({_id: req.params.userid}).populate('classrooms').exec(function(err, docs) {
        var options = {
          path: 'classrooms.course',
          model: 'Course'
        }

        if (err) throw err;

        User.populate(docs, options, function(err, users) {
          res.json(users);
        });
      });
    });

    // Fetch all courses
    apiRoutes.get('/courses', isLoggedIn, function(req, res) {
      Course.find({}, function(err, courses) {
        res.json({success: true, courses: courses, user: req.user});
      }).sort({ 'insertdate': 'desc' }).populate('hosts', '-password -admin -courses').populate('classes');
    });

    // Fetch one specific course
    apiRoutes.get('/courses/:courseid', function(req, res) {
      Course.find({_id: req.params.courseid}, function(err, course) {
        res.json({success: true, course: course});
      }).populate('hosts', '-password -admin -courses -classrooms').populate('classes').populate('comments');
    });

    // Fetch all comments from a specific course
    apiRoutes.get('/comments/:courseid', function(req, res) {
      Comment.find({course: req.params.courseid}, function(err, comments) {
        res.json(comments);
      }).sort({date: 'desc'}).select('-user');
    });

    // Post a comment to a specific course
    apiRoutes.post('/comments/:courseid', function(req, res) {
      Course.findOne({
        _id: req.params.courseid
      }, function(err, course) {
        if (err) throw err;

        if (!course) {
          res.json({ success: false, message: 'Comment failed. Course not found.' });
        } else {
          var comment = new Comment({
            comment: req.body.comment,
            user: req.body.user,
            course: req.params.courseid
          });

          comment.save(function(err) {
            if (err) throw err;

            res.json({success: true, comment: comment});
          });
        }
      });
    });

    // Fetch all students from a specific classroom
    apiRoutes.get('/students/:classroomid', function(req, res) {
      User.find({classrooms: req.params.classroomid}, function(err, users) {
        res.json(users);
      }).select('-admin -password');
    });

    // Register/Unregister in a course
    apiRoutes.put('/register/:userid', isLoggedIn, function(req, res) {
      User.findOne({
        _id: req.params.userid
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
    apiRoutes.put('/quit/:userid', isLoggedIn, function(req, res) {
      User.findOne({
        _id: req.params.userid
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
                    res.json({status: 'success', user: courses});  
                  });

                });
            });

          } else {
            res.json({ success: false, message: 'You are not registered!' });
          } 
          
        }
      });
    });

    apiRoutes.put('/classrooms/availability/:classroomid', function(req, res) {
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
          console.log('Classroom not found');
        }
      });
    });

    apiRoutes.get('/nav', isLoggedIn, function(req, res) {
        res.json({success: true, nav: ['All Courses', 'My Courses', 'Logout'], user: req.user });
    });

    app.use('/api', apiRoutes);


    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/',
                failureFlash: true
        }));

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    //res.redirect('/');
    res.json({ success: false, message: 'User is not authentiated.' });
}*/