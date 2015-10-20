module.exports = {
    host: 'localhost',
    port: 8000,
    secret: 'iloveacuniversity',
    tokenExpiration: 60 * 24,
    issuer: 'ACUniversity',
    mongo: {
    	// Test database
        uri: 'mongodb://labadmin:labpass@ds061787.mongolab.com:61787/acuniversity_test1',

        // Production database
        //uri: 'mongodb://admin:root@ds047692.mongolab.com:47692/acuniversity',

        // Local database
        //uri: 'localhost:27017/acuniversity',
        options: {
            db: {
                safe: true
            }
        }
    }
};