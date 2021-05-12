const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const functions = require('../tools/functions');
const xlsxExport = require('../tools/xlsxExport');
const sendEmail = require('../tools/sendEmail')



const Wallet = require('../models/Wallet');


const walletController = require('../controllers/walletController');
const cloverController = require('../controllers/cloverController');
const transactionController = require('../controllers/transactionController');
const configController = require('../controllers/configController');
const bonusCapController = require('../controllers/bonusCapController');
const partyReferralCodeController = require('../controllers/partyReferralCodeController');
const sellOrderController = require('../controllers/sellOrderController');
const withdrawRequestController = require('../controllers/withdrawRequestController');



router.get('/', ensureAuthenticated, (req, res) => {
    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {
        res.redirect('/admin/dashboard');
    }else{
        res.redirect('https://clovercountry.org/');
    }
})


router.get('/dashboard', ensureAuthenticated, (req, res) => {

    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {

    walletController.getWalletsAmount()
        .then(walletsAmount => {
            cloverController.getPremiumClvAmount()
                .then(premiumClvAmount => {

                    cloverController.getReferralClvAmount()
                        .then(referralClvAmount => {
                            transactionController.getTransactionsAmount()
                                .then(transactionsAmount => {

                                    configController.configGetPrice()
                                        .then(clvPrice => {

                                            configController.configGetPercent()
                                                .then(referralPercent => {
                                                    configController.configGetPercent2()
                                                        .then(referralPercent2 => {


                                                         cloverController.getFreeClvAmount()
                                                            .then(freeClvAmount => {


                                                                configController.configGetPercent3()
                                                                .then(referralPercent3 => {



                                                                    configController.configGetDefaultBonusCap()
                                                                        .then(defaultBonusCap => {


                                                                            partyReferralCodeController.getPartyReferralCodeAmount()
                                                                                .then(partyReferralCodeAmount => {




                                                                                    configController.configGetDefaultBonus()
                                                                                        .then(defaultBonus => {


                                                                                            const clvLeft = 100000000000 - (freeClvAmount + premiumClvAmount);

                                                                                            const clvLeftFormated = functions.numberWithSpacesFloat(clvLeft.toFixed(4));
                                                                                            const premiumClvAmountFormated = functions.numberWithSpacesFloat(premiumClvAmount.toFixed(4));
                                                                                            const freeClvAmountFormated = functions.numberWithSpacesFloat(freeClvAmount.toFixed(4));
                                                                                            const referralClvAmountFormated = functions.numberWithSpacesFloat(referralClvAmount.toFixed(4));
                            
                                                                                            res.render('adminDashboard', {
                                                                                                layout: 'adminLayout',
                                                                                                walletsAmount,
                                                                                                premiumClvAmount: premiumClvAmountFormated,
                                                                                                freeClvAmount: freeClvAmountFormated,
                                                                                                referralClvAmount: referralClvAmountFormated,
                                                                                                clvLeft: clvLeftFormated,
                                                                                                clvPrice,
                                                                                                referralPercent: referralPercent * 100,
                                                                                                referralPercent2: referralPercent2 * 100,
                                                                                                referralPercent3: referralPercent3 * 100,
                                                                                                transactionsAmount,
                                                                                                defaultBonusCap,
                                                                                                partyReferralCodeAmount,
                                                                                                defaultBonus
                                                                                            })
        



                                                                                        })


                                                                                








                                                                                })
                                                                                .catch(err => {
                                                                                    console.log(err)
                                                                                })



                                                                        






                                                                        })
                                                                        .catch(err => {
                                                                            console.log(err)
                                                                        })


                                                                







                                                            })
                                                            .catch(err => {
                                                                console.log(err)
                                                            })



                                                            })
                                                            .catch(err => {
                                                                console.log(err)
                                                            })

                                                    
                                                        })
                                                        .catch(err => {
                                                            console.log(err)
                                                        })
                                                })
                                                .catch(err => {
                                                    console.log(err)
                                                })
                                        })
                                        .catch(err => {
                                            console.log(err)
                                        })
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                        })
                        .catch(err => {
                            console.log(err)
                        })

                
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
        })

    }else{
        res.redirect('https://clovercountry.org/');
    }

});

router.post('/updateClvPrice', ensureAuthenticated, (req, res) => {

    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {

    const { price } = req.body;
    configController.configUpdatePrice(price)
        .then(config => {
            res.redirect('/admin/clovercontrols')
        })
        .catch(err => {
            console.log(err)
        })

    }else{
        res.redirect('https://clovercountry.org/');
    }

})

router.post('/updateReferralPercent', ensureAuthenticated, (req, res) => {

    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {

    const { percent } = req.body;
    configController.configUpdatePercent(percent)
        .then(config => {
            res.redirect('/admin/dashboard')
        })
        .catch(err => {
            console.log(err)
        })

    }else{
        res.redirect('https://clovercountry.org/');
    }

})

router.post('/updateReferralPercent2', ensureAuthenticated, (req, res) => {

    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {


    const { percent } = req.body;
    configController.configUpdatePercent2(percent)
        .then(config => {
            res.redirect('/admin/dashboard')
        })
        .catch(err => {
            console.log(err)
        })

    }else{
        res.redirect('https://clovercountry.org/');
    }

})

router.post('/updateReferralPercent3', ensureAuthenticated, (req, res) => {

    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {


    const { percent } = req.body;
    configController.configUpdatePercent3(percent)
        .then(config => {
            res.redirect('/admin/dashboard')
        })
        .catch(err => {
            console.log(err)
        })

    }else{
        res.redirect('https://clovercountry.org/');
    }

})

router.post('/changeBonusCap', ensureAuthenticated, (req, res) => {

    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {

        const codeReferral = req.query.codeReferral;
        const { amount } = req.body;

        bonusCapController.changeBonusCapLimit(codeReferral, amount)
            .then(bonusCap => {
                res.redirect(req.get('referer'));
            })
            .catch(err => {
                console.log(err);
            })

    }else{
        res.redirect('https://clovercountry.org/');
    }

})

router.post('/updateDefaultBonusCap', ensureAuthenticated, (req, res) => {
    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {

      
        const { amount } = req.body;

        configController.configUpdateDefaultBonusCap(amount)
            .then(config => {
                res.redirect(req.get('referer'));
            })
            .catch(err => {
                console.log(err);
            })
      
    }else{
        res.redirect('https://clovercountry.org/');
    }
})


router.get('/partyReferralCodes', ensureAuthenticated, (req, res) => {
    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {

      


        walletController.getAllWallets()
        .then(wallets => {


            partyReferralCodeController.getPartyReferralCode()
                .then(partyReferralCode => {
                    res.render('adminPartyReferralCodes', {
                        layout: 'adminLayout',
                        wallets,
                        partyReferralCode
                    })
                })
                .catch(err => {
                    console.log(err);
                })



            




        })
        .catch(err => {
            console.log(err)
        })




        
      
    }else{
        res.redirect('https://clovercountry.org/');
    }
})

router.post('/createPartyReferralCode', ensureAuthenticated, (req, res) => {
    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {

      
        const { user1, user2, user3, user4, user5, id1, id2, id3, id4, id5, per1, per2, per3, per4, per5 } = req.body;
       

        const referralCodes = [id1, id2, id3, id4, id5];
        const percents = [per1, per2, per3, per4, per5];

        let userAmount;

        if(user1 === 'on'){
            userAmount = 1;
        }
        
        if(user2 === 'on'){
            userAmount = 2;
        }
        
        if(user3 === 'on'){
            userAmount = 3;
        }
        
        if(user4 === 'on'){
            userAmount = 4;
        }
        
        if(user5 === 'on'){
            userAmount = 5;
        }



        let data = [];
        let i;
        for (i = 0; i < userAmount; i++) {
            const item = {
                referralCode: referralCodes[i],
                percent: Number(percents[i])
            }
            data.push(item);
        }
    

        partyReferralCodeController.createPartyReferralCode(data)
            .then(partyReferralCode => {
                res.redirect('/admin/partyReferralCodes')
            })
            .catch(err => {
                console.log(err);
            })

        
      
    }else{
        res.redirect('https://clovercountry.org/');
    }
})

router.get('/viewPartyReferralCode', ensureAuthenticated, (req, res) => {
    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {

        const codeReferral = req.query.codeReferral;

        partyReferralCodeController.findByCodePartyReferralCode(codeReferral)
            .then(data => {

                res.render('adminPartyReferralCodePage', {
                    layout: 'adminLayout',
                    partyReferralCode: data.partyReferralCode,
                    bonusCap: data.bonusCap
                })

            })
            .catch(err => {
                console.log(err);
            })
    
    }else{
        res.redirect('https://clovercountry.org/');
    }
})


router.get('/citizensOld', ensureAuthenticated, (req, res) => {


    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {


    walletController.getAllWallets()
        .then(wallets => {
            res.render('adminCitizens', {
                layout: 'adminLayout',
                wallets
            })
        })
        .catch(err => {
            console.log(err)
        })

    }else{
        res.redirect('https://clovercountry.org/');
    }


})

router.get('/citizen', ensureAuthenticated, (req, res) => {


    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {


    const id = req.query.id;
    walletController.findWallet(id)
        .then(wallet => {
            cloverController.getPremiumClv(id)
                .then(premiumClv => {
                    cloverController.getReferralClv(id)
                        .then(referralClv => {

                            cloverController.getFreeClv(id)
                                .then(freeClv => {



                                    walletController.getWalletIndex(id)
                                        .then(index => {
                                            bonusCapController.adminFindBonusCap(wallet.codeReferral)
                                            .then(bonusCap => {
                                                res.render('adminNewCitizenPage', {
                                                    layout: 'adminNewLayout',
                                                    wallet,
                                                    bonusCap,
                                                    index,
                                                    premiumClv: premiumClv.amount,
                                                    referralClv: referralClv.amount,
                                                    freeClv: freeClv.amount
                                                })
                                            })
                                            .catch(err => {
                                                console.log(err)
                                            })
    
    
                                        })
                                        

                                   
                                




                            })
                            .catch(err => {
                                console.log(err)
                            })

                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
        })


    }else{
        res.redirect('https://clovercountry.org/');
    }


})

router.post('/addPremiumClv', ensureAuthenticated, (req, res) => {

    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {


    const id = req.query.id;
    const { amount } = req.body;


    Wallet.findOne({_id: id})
        .then(wallet => {
            cloverController.mintPremiumClv(wallet._id, amount, wallet, 'None', 'Premium')
                .then(clv => {
                    res.redirect(req.get('referer'));
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err);
        })

    

    }else{
        res.redirect('https://clovercountry.org/');
    }

})

router.post('/addFreeClv', ensureAuthenticated, (req, res) => {


    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {



    const id = req.query.id;
    const { amount } = req.body;


    Wallet.findOne({_id: id})
        .then(wallet => {
            cloverController.mintFreeClv(wallet._id, amount, wallet, 'None', 'Bonus')
                .then(clv => {
                    res.redirect(req.get('referer'));
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err);
        })

   



    }else{
        res.redirect('https://clovercountry.org/');
    }

})

router.post('/updateUsdBonus', ensureAuthenticated, (req, res) => {

    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {


    const id = req.query.id;
    const { amount } = req.body;

    walletController.setUsdBonus(id, amount)
        .then(wallet => {
            res.redirect(req.get('referer'));
        })
        .catch(err => {
            console.log(err)
        })
    }else{
        res.redirect('https://clovercountry.org/');
    }

})

router.post('/addCashback', ensureAuthenticated, (req, res) => {
    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {


        const id = req.query.id;
        const { amount } = req.body;
    
        walletController.addCashback(id, amount)
            .then(wallet => {
                res.redirect(req.get('referer'));
            })
            .catch(err => {
                console.log(err)
            })
        }else{
            res.redirect('https://clovercountry.org/');
        }
})

router.get('/transactionsOld', ensureAuthenticated, (req, res) => {


    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {

    transactionController.getAllTransactions()
        .then(transactions => {
            res.render('adminTransactions', {
                layout: 'adminLayout',
                transactions
            })
        })
        .catch(err => {
            console.log(err)
        })

    }else{
        res.redirect('https://clovercountry.org/');
    }


})





router.post('/updateDefaultBuyBonus', ensureAuthenticated, (req, res) => {


    
    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {

        const { amount } = req.body;

      configController.configSetDefaultBonus(amount)
        .then(result => {
            res.redirect('/admin/clovercontrols');
        })
    
        }else{
            res.redirect('https://clovercountry.org/');
        }


})

router.post('/changeReputationIndex', ensureAuthenticated, (req, res) => {



    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {


        const { id, amount } = req.body;
        walletController.changeWalletIndex(id, amount)
            .then(result => {
                res.redirect(req.get('referer'));
            })
       

        }else{
            res.redirect('https://clovercountry.org/');
        }








 
 })



 router.post('/setPersonalLockDownPeriod', ensureAuthenticated, (req, res) => {
    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {


        const { id, amount } = req.body;
        walletController.setPersonalLockDownPeriod(id, amount)
            .then(result => {
                res.redirect(req.get('referer'));
            })
       

        }else{
            res.redirect('https://clovercountry.org/');
        }
 })


 router.post('/setPersonalLockDownPeriodFree', ensureAuthenticated, (req, res) => {
    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {


        const { id, amount } = req.body;
        walletController.setPersonalLockDownPeriodFree(id, amount)
            .then(result => {
                res.redirect(req.get('referer'));
            })
       

        }else{
            res.redirect('https://clovercountry.org/');
        }
 })


 router.post('/setPersonalRestriction', ensureAuthenticated, (req, res) => {
    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {


        const { id, amount } = req.body;
        walletController.setPersonalRestrictionPercentSellPerMonth(id, amount)
            .then(result => {
                res.redirect(req.get('referer'));
            })
       

        }else{
            res.redirect('https://clovercountry.org/');
        }
 })

 


 router.get('/sellOrders', ensureAuthenticated, (req, res) => {
    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {


        sellOrderController.getAllSellOrders()
            .then(sellOrders => {
                res.render('adminNewSellOrders', {
                    layout: 'adminNewLayout',
                    sellOrders
                })
            })

        }else{
            res.redirect('https://clovercountry.org/');
        }
 })




 router.get('/withdrawRequests', ensureAuthenticated, (req, res) => {
    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {


        withdrawRequestController.getAllWithdrawRequests()
            .then(requests => {
                res.render('adminNewWithdrawRequests', {
                    layout: 'adminNewLayout',
                    requests
                })
            })

        }else{
            res.redirect('https://clovercountry.org/');
        }
 })



 
//NEW ADMIN PANEL




router.get('/clovercontrols', ensureAuthenticated, (req, res) => {
    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {


        configController.configGetPrice()
            .then(clvPrice => {



                configController.configGetDefaultBonus()
                    .then(defaultBonus => {


                        configController.configGetDefaultPremiumLockdown()
                            .then(defaultPremiumLockdown => {


                                configController.configGetDefaultFreeLockdown()
                                    .then(defaultFreeLockdown => {


                                        configController.configGetDefaultSellRestriction()
                                            .then(defaultSellRestriction => {



                                                configController.configGetDefaultBonusCap()
                                                .then(defaultBonusCap => {


                                                    configController.configGetPercent()
                                                        .then(referralPercent => {

                                                            configController.configGetPercent2()
                                                                .then(referralPercent2 => {


                                                                    configController.configGetPercent3()
                                                                        
                                                                    .then(referralPercent3 => {




                                                                        res.render('adminNewCloverControls', {
                                                                            layout: 'adminNewLayout',
                                                                            clvPrice,
                                                                            defaultBonus,
                                                                            defaultPremiumLockdown,
                                                                            defaultFreeLockdown,
                                                                            defaultSellRestriction,
                                                                            defaultBonusCap,
                                                                            referralPercent,
                                                                            referralPercent2,
                                                                            referralPercent3

                                                                        })



                                                                                
                                                                    })

                                                                    
                                                                })

                                                            
                                                        })


                                                    




                                                })




                                                






                                            })



                                        





                                    })


                            })



                        






                    })


            


            })




        


    }else{
        res.redirect('https://clovercountry.org/');
    }
})











 router.get('/main', ensureAuthenticated, (req, res) => {
    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {

        res.render('adminNewMainPage', {
            layout: 'adminNewLayout',
        })
    

        }else{
            res.redirect('https://clovercountry.org/');
        }
 })



 router.get('/info', ensureAuthenticated, (req, res) => {
    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {


        cloverController.adminGetClvInformation()
            .then(data => {
                res.render('adminNewInfoPage', {
                    layout: 'adminNewLayout',
                    data
                })
            })
        }else{
            res.redirect('https://clovercountry.org/');
        }
 })


 router.get('/citizens', ensureAuthenticated, (req, res) => {
    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {

        const order = req.query.order;

        walletController.getAllWalletsMaster(order)
            .then(citizens => {


                walletController.getFemalePercent()
                    .then(femalePercent => {
                        res.render('adminNewCitizensPage', {
                            layout: 'adminNewLayout',
                            citizens,
                            femalePercent
                        })
                    })

                



            })

    }else{

        res.redirect('https://clovercountry.org/');

    }
 })



 router.get('/transactions', ensureAuthenticated, (req, res) => {


    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {

    transactionController.getAllTransactions()
        .then(transactions => {
            res.render('adminNewTransactions', {
                layout: 'adminNewLayout',
                transactions
            })
        })
        .catch(err => {
            console.log(err)
        })

    }else{
        res.redirect('https://clovercountry.org/');
    }


})



 router.get('/citizenOld', ensureAuthenticated, (req, res) => {


    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {


    const id = req.query.id;
    walletController.findWallet(id)
        .then(wallet => {
            cloverController.getPremiumClv(id)
                .then(premiumClv => {
                    cloverController.getReferralClv(id)
                        .then(referralClv => {

                            cloverController.getFreeClv(id)
                                .then(freeClv => {



                                    walletController.getWalletIndex(id)
                                        .then(index => {
                                            bonusCapController.adminFindBonusCap(wallet.codeReferral)
                                            .then(bonusCap => {
                                                res.render('adminNewCitizenPage', {
                                                    layout: 'adminNewLayout',
                                                    wallet,
                                                    bonusCap,
                                                    index,
                                                    premiumClv: functions.numberWithSpacesFloat(premiumClv.amount),
                                                    referralClv: functions.numberWithSpacesFloat(referralClv.amount),
                                                    freeClv: functions.numberWithSpacesFloat(freeClv.amount)
                                                })
                                            })
                                            .catch(err => {
                                                console.log(err)
                                            })
    
    
                                        })
                                        

                                   
                                




                            })
                            .catch(err => {
                                console.log(err)
                            })

                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
        })


    }else{
        res.redirect('https://clovercountry.org/');
    }


})




router.post('/updateDefaultPremiumLockup', ensureAuthenticated, (req, res) => {

    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {

        const { amount } = req.body;
       
        configController.configUpdateDefaultPremiumLockup(amount)
            .then(result => {
                res.redirect('/admin/clovercontrols');
            })


    }else{
           

        res.redirect('https://clovercountry.org/');


    }

})



router.post('/updateDefaultFreeLockup', ensureAuthenticated, (req, res) => {

    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {

        const { amount } = req.body;
       
        configController.configUpdateDefaultFreeLockup(amount)
            .then(result => {
                res.redirect('/admin/clovercontrols');
            })


    }else{
           

        res.redirect('https://clovercountry.org/');


    }

})




router.post('/updateDefaultSellRestriction', ensureAuthenticated, (req, res) => {

    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {

        const { amount } = req.body;
       
        configController.configUpdateDefaultSellRestriction(amount)
            .then(result => {
                res.redirect('/admin/clovercontrols');
            })


    }else{
           

        res.redirect('https://clovercountry.org/');


    }

})



router.get('/exportCitizens', ensureAuthenticated, (req, res) => {


    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {


        walletController.getAllWalletsMaster('date')
            .then(citizens => {

                const workSheetColumnNames = [
                    'id',
                    'first name',
                    'last name',
                    'gender',
                    'email',
                    'phone',
                    'join date'
                ]


                const datetime = new Date();
                const shortDate = 'citizens_' + datetime.getDate() + '.' + (datetime.getMonth() + 1) + '.' + datetime.getFullYear() + '.xlsx';

                const workSheetName = 'Citizens';
                const filePath = `./tools/outputFiles/${shortDate}`;

                xlsxExport.exportCitizensToExcel(citizens, workSheetColumnNames, workSheetName, filePath )
               

                sendEmail.sendEmailExcel(shortDate)
                    .then(result => {
                        console.log(result);
                        res.redirect('/admin/citizens')
                    })

                


            })
      

    }else{
        res.redirect('https://clovercountry.org/');
    }


})


router.get('/exportTransactions', ensureAuthenticated, (req, res) => {


    if(req.user.id === process.env.ADMIN1 || req.user.id === process.env.ADMIN2 || req.user.id === process.env.ADMIN3) {


        transactionController.getAllTransactions()
            .then(transactions => {

                const workSheetColumnNames = [
                    'id',
                    'buy/sell',
                    'first name',
                    'last name',
                    'email',
                    'clv amount',
                    'US$ amount',
                    'price US$',
                    'date'

                ]


                const datetime = new Date();
                const shortDate = 'transactions_' + datetime.getDate() + '.' + (datetime.getMonth() + 1) + '.' + datetime.getFullYear() + '.xlsx';

                const workSheetName = 'Citizens';
                const filePath = `./tools/outputFiles/${shortDate}`;

                xlsxExport.exportTransactionsToExcel(transactions, workSheetColumnNames, workSheetName, filePath )
               

                sendEmail.sendEmailExcel(shortDate)
                    .then(result => {
                        console.log(result);
                        res.redirect('/admin/transactions')
                    })

                


            })
      

    }else{
        res.redirect('https://clovercountry.org/');
    }


})


module.exports = router;