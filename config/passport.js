const Users=require('../models/users');
const passport = require('passport');
const LocalStrategy=require('passport-local').Strategy;
const bcrypt = require('bcrypt')

const customFields = {
    usernameField: 'username',
    passwordField: 'pass'
}

const verifyCallback=(username,password,done)=>{
    Users.findOne({username:username})
    .then((user)=>{
        if(!user){
            return done(null,false);
        }
        bcrypt.compare(password,user.pass).then((authorized)=>{
            if(authorized){
                return done(null,user);
            }
            else{
                return done(null,false);
            }
        })
    })
    .catch((err)=>{
        done(err);
    })
}

const strategy=new LocalStrategy(customFields,verifyCallback);

passport.use(strategy)

passport.serializeUser((user,done)=>{
    done(null,user.id);
})

passport.deserializeUser((userId,done)=>{
    Users.findById(userId)
    .then((user)=>{
        done(null,user);
    })
    .catch((err)=> done(err));
})