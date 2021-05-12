const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Wallet = require('../models/Wallet');
const functions = require('../tools/functions');
const Transaction = require('../models/Transaction');
const Config = require('../models/Config');
const PartyReferralCode = require('../models/PartyReferralCode');
const request = require('request');




//Controllers
const cloverController = require('../controllers/cloverController');
const configController = require('../controllers/configController');
const walletController = require('../controllers/walletController');
const transactionController = require('../controllers/transactionController');
const bonusCapController = require('../controllers/bonusCapController');
const partyReferralCodeController = require('../controllers/partyReferralCodeController');
const bonusCodeController = require('../controllers/bonusCodeController');
const marketplaceController = require('../controllers/marketplaceController');
const sellOrderController = require('../controllers/sellOrderController');
const withdrawRequestController = require('../controllers/withdrawRequestController');



//Pages
router.get('/', (req, res) => res.render('index'));

router.get('/mission', (req, res) => res.render('mission'));

router.get('/citizenship', (req, res) => {
    configController.configGetPrice()
        .then(price => {
            res.render('citizenship', {
                price10: (10 * price).toFixed(4),
                price50: (50 * price).toFixed(4),
                price250: (250 * price).toFixed(4),
                price1000: (1000 * price).toFixed(4),
            })
        })
});

router.get('/statistics', (req, res) => {
    res.redirect('/marketplace');
})

router.get('/marketplace', (req, res) => {
    cloverController.getClvAmount()
        .then(clvAmount => {
            walletController.getWalletsAmount()
                .then(walletsAmmount => {
                    configController.configGetPrice()
                        .then(price => {
                            transactionController.getTransactionsAmount()
                                .then(transactionsAmount => {




                                    walletController.getFemalePercent()
                                        .then(percent => {




                                            configController.getPriceChange()
                                                .then(priceChange =>{

                                                    const marketCap = (100000000000 * price).toFixed(0);
                                                    const formatedMarketCap = functions.numberWithSpaces(marketCap);
                                                    const formatedClvSold = functions.numberWithSpaces(clvAmount.toFixed(0));
                
                                                  
                
                                                    res.render('statistics', {
                                                        citizens: walletsAmmount + 57,
                                                        marketCap: formatedMarketCap,
                                                        clvSold: formatedClvSold,
                                                        operationsAmount: transactionsAmount+95,
                                                        price: price,
                                                        female: percent,
                                                        priceChange: priceChange
                                                    });

                                                })
                                                .catch(err => {
                                                    console.log(err);
                                                })






                                     





        
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            res.redirect('/');
                                        })


                                



                                })
                                .catch(err => {
                                    console.log(err);
                                    res.redirect('/');
                                })
                        })
                        .catch(err => {
                            console.log(err);
                            res.redirect('/');
                        })
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/');
                })
        })
        .catch(err => {
            console.log(err);
            res.redirect('/');
        })
})

router.get('/faq', (req, res) => res.render('faq'));

router.get('/contact', (req, res) => res.render('contact'));

router.post('/contact', (req, res) => {
    const { firstName, lastName, email, message } = req.body;
    const captcha = req.body['g-recaptcha-response'];
    let errors = [];

       //Check captcha
    if (captcha === undefined || captcha === '' || captcha === null) {
        errors.push({ msg: 'Please complete the Captcha' });
    }


        //Secret key
        const secretKey = process.env.CAPTCHA;
        //reCaptcha verify URL
        const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;
        //Make request to verify
        request(verifyUrl, (err, response, body) => {
            body = JSON.parse(body);
    
            if (body.success !== undefined && !body.success) {
                errors.push({ msg: 'Please complete the Captcha' })
            }
    
    
        })


        if (!firstName || !email || !message) {
            errors.push({ msg: 'Please fill in all fields' })
        }



        if (errors.length > 0) {
            res.render('contact', {
                errors,
                firstName,
                lastName,
                email,
                message
            });
        }else{
            const data = {
                firstName,
                lastName,
                email,
                message
            }
            configController.sendContactMessage(data)
                .then(result => {
                    console.log(result);
                    req.flash('success_msg', 'Your message has been submitted!');
                    res.redirect('/contact');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/contact');
                })
                
        }

})


router.get('/dashboard', ensureAuthenticated, (req, res) => {
    cloverController.getPremiumClv(req.user.id)
        .then(premiumClv => {
            cloverController.getReferralClv(req.user.id)
                .then(referralClv => {
                    configController.configGetPrice()
                        .then(price => {
                            cloverController.getFreeClv(req.user.id)
                                .then(freeClv => {

                               
                                    cloverController.getClvAmount()
                                        .then(amount => {




                                            cloverController.getAllClvForDashboard(req.user.id) 
                                                .then(allClv => {

                                                    
                                                let premiumClvAmount;
                                                let clvTotal;
                                                let usdTotal;


                                                if(req.user.id === '5f5f0dc069ed595ce6e15928'){
                                                    const clvLeft = 100000000000 - amount;
                                                    premiumClvAmount = 100000000000 - amount;
                                                    clvTotal = premiumClvAmount;
                                                    usdTotal = clvLeft * price;
                                                }else{
                                                    premiumClvAmount = premiumClv.amount;
                                                    clvTotal = (Number(premiumClv.amount) + Number(freeClv.amount)).toFixed(4);
                                                    usdTotal = (Number(premiumClv.usd) + Number(freeClv.usd) + Number(req.user.usdBonus)).toFixed(4);
                                                }

                                                
                                            
                                        
                                                res.render('dashboard', {
                                                    layout: 'dashboardLayout',
                                                    price,
                                                    clvTotal,
                                                    usdTotal,
                                                    email: req.user.email,
                                                    firstName: req.user.firstName,
                                                    lastName: req.user.lastName,
                                                    usdWallet: req.user.usdWallet,
                                                    premiumClvAmount,
                                                    freeClv: freeClv.clv,
                                                    freeClvAmount: freeClv.amount - referralClv.amount,
                                                    usdBonus: req.user.usdBonus,
                                                    referralClvAmount: (referralClv.amount).toFixed(4),
                                                    premiumClv: premiumClv.clv,
                                                    referralClv: referralClv.clv,
                                                    allClv: allClv.clv
                                                })

                                                })
                                                .catch(err => {
                                                    console.log(err);
                                                    res.redirect('/dashboard')
                                                })















                                        })
                                        .catch(err => {
                                            console.log(err);
                                            res.redirect('/dashboard')
                                        })


                        })
                        .catch(err => {
                            console.log(err);
                            res.redirect('/dashboard')
                        })
                        
                    })


                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/dashboard')
                })

        })
        .catch(err => {
            console.log(err);
            res.redirect('/dashboard')
        })
})

router.get('/exchange', ensureAuthenticated, (req, res) => {
    configController.configGetPrice()
        .then(price => {
            res.render('exchange', {
                layout: 'dashboardLayout',
                walletId: req.user.id,
                price10: (price * 10).toFixed(4),
                price50: (price * 50).toFixed(4),
                price250: (price * 250).toFixed(4),
                price1000: (price * 1000).toFixed(4)
            })
        })
})

router.get('/transactions', ensureAuthenticated, (req, res) => {
    transactionController.findTransactions(req.user.id)
        .then(transactions => {
            res.render('transactions', {
                layout: 'dashboardLayout',
                transactions
            })
        })

})

router.get('/referral', ensureAuthenticated, (req, res) => {
    walletController.findReferralAmount(req.user.codeReferral)
        .then(referrals => {
            configController.configGetPercent()
                .then(percent => {
                    cloverController.getReferralClv(req.user.id)
                        .then(clv => {

                         

                            walletController.findPartyReferralAmount(req.user.codeReferral)
                                .then(partyReferrals => {

                                 

                                    res.render('referral', {
                                        layout: 'dashboardLayout',
                                        clvAmount: (clv.amount).toFixed(4),
                                        usdAmount: clv.usd,
                                        percent: percent * 100,
                                        amount: referrals.amount + partyReferrals.amount,
                                        referrals: referrals.referrals,
                                        partyReferrals: partyReferrals.referrals,
                                        code: req.user.codeReferral,
                                        referralClv: clv.clv,
                                        link: 'https://clovercountry.org/wallet/create/?referral=' + req.user.codeReferral,
                                    })

                                })
                                .catch(err => {
                                    console.log(err);
                                })




                           



                        })
                        .catch(err => {
                            console.log(err);
                            res.redirect('/dashboard')
                        })


                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/dashboard')
                })

        })
        .catch(err => {
            console.log(err);
            res.redirect('/dashboard')
        });

})



//MARKETPLACE V1.0

router.get('/marketplace/buy', ensureAuthenticated, (req, res) => {

    configController.configGetDefaultBonus()
        .then(defaultBonus => {

            configController.configGetPrice()
                .then(price => {
                    res.render('marketplaceBuy', {
                        layout: 'dashboardLayout',
                        defaultBonus,
                        price
                    })
                })
                .catch(err => {
                    console.log(err);
                })


            



        })
        .catch(err => {
            console.log(err);
        })

    
    
})


router.post('/marketplace/checkBonusCode', ensureAuthenticated, (req, res) => {

    const { code } = req.body;

    const codeFormated = code.toUpperCase();

    bonusCodeController.checkBonusCode(codeFormated)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        })
})


router.post('/marketplace/payment', ensureAuthenticated, (req, res) => {
    const userId = req.user.id;
    const clvAmount = req.body.formTotalClv;
    const bonusClvAmount = req.body.formTotalBonusClv;
    const bonusCodeRaw = req.body.bonusCode;
    const bonusCode = bonusCodeRaw.toUpperCase();


    const donationPercent1 = req.body.formPercent1;
    const donationPercent2 = req.body.formPercent2;
    const donationPercent3 = req.body.formPercent3;
    const donationPercent4 = req.body.formPercent4;
    const donationPercent5 = req.body.formPercent5;
    const donationPercent6 = req.body.formPercent6;

    marketplaceController.proceedPayment(res, userId, clvAmount, bonusClvAmount, bonusCode, donationPercent1, donationPercent2, donationPercent3, donationPercent4, donationPercent5, donationPercent6);

})

router.get('/marketplace/payment/cancel', ensureAuthenticated, (req, res) => {
    res.redirect('/marketplace/buy');
})

router.get('/marketplace/payment/success', ensureAuthenticated, (req, res) => {


    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const userId = req.query.userId;
    const clvAmount = req.query.clvAmount;
    const bonusClvAmount = req.query.bonusClvAmount;
    const usdAmount = req.query.usdAmount;
    const bonusCode = req.query.bonusCode;
    

    const donationPercent1 = req.query.donationPercent1;
    const donationPercent2 = req.query.donationPercent2;
    const donationPercent3 = req.query.donationPercent3;
    const donationPercent4 = req.query.donationPercent4;
    const donationPercent5 = req.query.donationPercent5;
    const donationPercent6 = req.query.donationPercent6;

    marketplaceController.paymentSuccessful(res, payerId, paymentId, userId, clvAmount, bonusClvAmount, usdAmount, bonusCode, donationPercent1, donationPercent2, donationPercent3, donationPercent4, donationPercent5, donationPercent6)


})



router.get('/marketplace/sell', ensureAuthenticated, (req, res) => {

 
            configController.configGetPrice()
                .then(price => {


                    cloverController.getPremiumClvForMarketPlace(req.user.id)
                        .then(clv => {

                            cloverController.getFreeClvForMarketPlace(req.user.id)
                                .then(freeClv => {
                                    sellOrderController.getSellOrders(req.user.id)
                                    .then(sellOrders => {
                                        let totalToSell = 0;
    
                                        clv.forEach(item => {
                                            totalToSell = totalToSell + item.availableToSell;
                                        })

                                        freeClv.forEach(item => {
                                            totalToSell = totalToSell + item.availableToSell;
                                        })
            
                                  
                                        walletController.getPersonalRestrictionPercentSellPerMounth(req.user.id)
                                            .then(restriction => {
                                                res.render('marketplaceSell', {
                                                    layout: 'dashboardLayout',
                                                    price,
                                                    clv,
                                                    freeClv,
                                                    totalToSell,
                                                    sellOrders,
                                                    restriction
                                                })
                                            })
            
                                        
            
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                                })

                    


                           

                           




                        })
                        .catch(err => {
                            console.log(err);
                        })

                    



                })
                .catch(err => {
                    console.log(err);
                })


})


router.post('/marketplace/createSellOrder', ensureAuthenticated, (req, res) => {
    const { clvId, clvAmount } = req.body;
    const ownerId = req.user.id;

    sellOrderController.createSellOrder(clvId, ownerId, clvAmount)
        .then(result => {
            res.render('marketplaceSellSuccess', {
                layout: 'dashboardLayout',
            })
        })
        .catch(err => {
            console.log(err);
            res.redirect('/marketplace/sell')
        })

})

router.get('/marketplace/withdrawal', ensureAuthenticated, (req, res) => {
    walletController.getWalletUsdBalance(req.user.id)
        .then(wallet => {
            res.render('marketplaceWithdrowal', {
                wallet,
                layout: 'dashboardLayout',
            })
        })
        .catch(err => {
            console.log(err);
        })
    
})

router.post('/marketplace/createWithdrawRequest', ensureAuthenticated, (req, res) => {
    const { amount, info } = req.body;
    withdrawRequestController.createWithdrawRequest(req.user.id, amount, info)
        .then(result => {
            console.log(result);
            
            res.render('marketplaceWithdrowalSuccess', {
                layout: 'dashboardLayout'
            })

        })
        .catch(err => {
            console.log(err);
        })
})


router.get('/test', ensureAuthenticated, (req,res) => {
    res.render('marketplaceSellSuccess', {
        layout: 'dashboardLayout',
    })
})
 
module.exports = router;
