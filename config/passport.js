const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load Wallet model
const Wallet = require('../models/Wallet');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            // Match Wallet
            const emailFormated = email.toLowerCase();
            Wallet.findOne({email: emailFormated})
                .then(wallet => {
                    if(!wallet){
                        return done(null, false, {message: 'That email is not registered'});
                    }

                    //Match password
                    bcrypt.compare(password, wallet.password, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch){
                            return done(null, wallet);
                        }else{
                            return done(null, false, { message: 'Password incorrect' });
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );


    passport.serializeUser((wallet, done) => {
        done(null, wallet.id);
      });
    
      passport.deserializeUser((id, done) => {
        Wallet.findById(id, (err, wallet) => {
          done(err, wallet);
        });
      });

}