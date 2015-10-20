// config/passport.js

// load all the things we need
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User       = require('../app/models/user');

// load the auth variables
var configAuth = require('../oauth');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))
    // code for facebook (use('facebook', new FacebookStrategy))
    // code for twitter (use('twitter', new TwitterStrategy))

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {

                    if (profile._json.domain === 'avenuecode.com') {
                        User.findOne({ 'email': profile.emails[0].value}, function(err, localUser) {
                            var user;
                            if (err) {
                                return done(err);
                            }

                            if (localUser) {
                                user = localUser;

                                // set all of the relevant information
                                user.google.id    = profile.id;
                                user.google.token = token;
                                user.google.name  = profile.displayName;
                                user.google.email = profile.emails[0].value; // pull the first email
                                user.google.picture = profile.photos ? profile.photos[0].value.replace('?sz=50', '?sz=100') : undefined;


                            } else {
                                console.log(profile);
                                // if the user isnt in our database, create a new user
                                user          = new User();

                                user.name = profile.displayName;
                                user.email = profile.emails[0].value;
                                user.admin = false;

                                // set all of the relevant information
                                user.google.id    = profile.id;
                                user.google.token = token;
                                user.google.name  = profile.displayName;
                                user.google.email = profile.emails[0].value; // pull the first email
                                user.google.picture = profile.photos ? profile.photos[0].value.replace('?sz=50', '?sz=100') : undefined;
                            }

                            // save the user
                            user.save(function(err) {
                                if (err) {
                                    throw err;
                                }
                                return done(null, user);
                            });
                        });
                    } else {
                        done(new Error('You need to have a Avenue Code Gmail account. Please contact the admin sector'));
                        //done(null, false, { message: 'You need to have a Avenue Code Gmail account. Please contact the admin sector'});
                    }

                }
            });
        });

    }));

};
