const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = mongoose.model('User');
// authenticate user using passport local strategy
passport.use(new LocalStrategy(
    { usernameField: 'email'} , 
    async(email , password , done) =>{
        try{
            const user =  await User.findOne({email});
            if(!user){
                return done(null, false, { message: 'This email is not registered.' });
            }

            const isMatch = await bcrypt.compare(password , user.password);
            if(!isMatch){
                return done(null , false , { message: 'Invalid password.' });
            } else{
                return done(null , user);
            }
        } catch (error) {
            return done(error);
        }
    }
));
// serialize user into session means store user id in session

passport.serializeUser(function(user , done){
    done(null , user.id);
}) ; 

// deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
                if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});