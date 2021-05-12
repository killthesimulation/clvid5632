const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcryptjs');
const functions = require('../tools/functions');

const { ensureAuthenticated } = require('../config/auth');
const request = require('request');




//Controllers connect
const walletController = require('../controllers/walletController');
const cloverController = require('../controllers/cloverController');
const transactionController = require('../controllers/transactionController');
const configController = require('../controllers/configController');
const resetRequestController = require('../controllers/resetRequestController');



//Models connect
const Wallet = require('../models/Wallet');
const ResetRequest = require('../models/ResetRequest');






//Login page
router.get('/login', (req, res) => res.render('login'));



//Create page
router.get('/create', (req, res) => {

    walletController.getUserGeoInfo(req)
        .then(geo => {
            console.log(geo);
            if (req.query.referral) {
                const referral = req.query.referral;
                res.render('create', {
                    referral,
                    phone: geo.dialCode
                })
            } else {
                res.render('create', {
                    phone: geo.dialCode
                });
            }
        })
        .catch(err => {
            console.log(err);
        })

});


//Create handle

router.post('/create', (req, res) => {
    walletController.createWallet(req, res)
        .then(wallet => {
            cloverController.giveSignUpReferralBonus(wallet._id, wallet.referralSource, wallet.codeReferral)
                .then(result => {
                    console.log(result);
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })
})


//Login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/wallet/login',
        failureFlash: true
    })(req, res, next);
});

//Logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/wallet/login');
})


router.get('/forgot', (req, res) => {
    res.render('forgot');
})


router.post('/forgot', (req, res) => {
    const { email } = req.body;
    Wallet.findOne({ email: email })
        .then(wallet => {
            if (wallet) {
                const requestId = functions.resetPasswordGenerate();

                resetRequestController.createResetRequest(requestId, email)
                    .then(resetRequest => {

                        resetRequestController.sendResetRequest(requestId, email)
                            .then(message => {
                                req.flash('success_msg', 'Please check your email, follow the link and change your password');
                                res.redirect('/wallet/forgot');
                            })
                            .catch(err => {
                                req.flash('error_msg', "Something went wrong");
                                res.redirect('/wallet/forgot');
                            })

                    })
                    .catch(err => {
                        req.flash('error_msg', "Something went wrong");
                        res.redirect('/wallet/forgot');
                    })



            } else {
                req.flash('error_msg', "This email doesn't exist");
                res.redirect('/wallet/forgot');
            }
        })
})


router.get('/reset', (req, res) => {
    const requestId = req.query.password;
    res.render('reset', {
        requestId
    })
})



router.post('/reset', (req, res) => {
    const { requestId, password, password2 } = req.body;
    resetRequestController.findResetRequest(requestId)
        .then(resetRequest => {

            //Check password match
            if (password !== password2) {
                req.flash('error_msg', "Passwords do not match.");
                res.redirect(req.get('referer'));
            } else if( password.length < 6){
                req.flash('error_msg', "Password should be at least 6 characters.");
                res.redirect(req.get('referer'));
            } else {
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        walletController.updateWalletPassword(resetRequest.email, hash)
                            .then(wallet => {
                                req.flash('success_msg', 'You have successfully changed your password');
                                res.redirect('/wallet/login');
                            })
                            .catch(err => {
                                req.flash('error_msg', "Something went wrong");
                                res.redirect('/wallet/forgot');
                            })

                    })
                )


            }
        })
        .catch(err => {
            console.log(err);
        })


})












module.exports = router;
