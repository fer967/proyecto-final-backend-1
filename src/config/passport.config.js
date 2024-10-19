const passport = require("passport");
const jwt = require("passport-jwt"); 
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;
// adaptacion dotenv
const configObject = require("../config/config.js");
const {secret, tokenSecret} = configObject;

const initializePassport = () => {
    passport.use("current", new JWTStrategy({
        jwtFromRequest:ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey:secret
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }))
};

const cookieExtractor = (req) => {
    let token = null;
    if(req && req.cookies){
        token = req.cookies[tokenSecret]
    }
    return token;
};

module.exports = initializePassport;