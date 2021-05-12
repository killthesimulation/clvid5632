const paypal = require('paypal-rest-sdk');
const configController = require('../controllers/configController');
const walletController = require('../controllers/walletController');
const cloverController = require('../controllers/cloverController');
const bonusCodeController = require('../controllers/bonusCodeController');
const sellOrderController = require('../controllers/sellOrderController');


paypal.configure({
    'mode': process.env.PAYPALMODE,
    'client_id': process.env.PAYPALID,
    'client_secret': process.env.PAYPALSECRET
});


exports.proceedPayment = function (res, userId, clvAmount, bonusClvAmount, bonusCode, donationPercent1, donationPercent2, donationPercent3, donationPercent4, donationPercent5, donationPercent6){

    configController.configGetPrice()
        .then(price => {

            const usdAmount = clvAmount * price;
            const usdAmountRounded = Math.round((usdAmount + Number.EPSILON) * 100) / 100;


            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": `${process.env.PRODURL}/marketplace/payment/success/?userId=${userId}&clvAmount=${clvAmount}&bonusClvAmount=${bonusClvAmount}&bonusCode=${bonusCode}&donationPercent1=${donationPercent1}&donationPercent2=${donationPercent2}&donationPercent3=${donationPercent3}&donationPercent4=${donationPercent4}&donationPercent5=${donationPercent5}&donationPercent6=${donationPercent6}&usdAmount=${usdAmount}`,
                    "cancel_url": `${process.env.PRODURL}/marketplace/payment/cancel`
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": `- Clover: ${clvAmount} CLV`,
                            "price": usdAmountRounded,
                            "currency": "USD",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total": usdAmountRounded
                    },
                    "description": "Clover Citizen Membership Subscription."
                }]
            };


            
            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    throw error;
                } else {
                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === 'approval_url') {
                            res.redirect(payment.links[i].href);
                        }
                    }
                }
            });



        })
        .catch(err => {
            console.log(err);
        })


}




exports.paymentSuccessful = function (res, payerId, paymentId, userId, clvAmount, bonusClvAmount, usdAmount, bonusCode, donationPercent1, donationPercent2, donationPercent3, donationPercent4, donationPercent5, donationPercent6) {
    return new Promise((resolve, reject) => {

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": usdAmount
                }
            }]
        };




        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                console.log(error.response);
                res.redirect('/marketplace/buy');
            } else {

                walletController.findWallet(userId)
                    .then(buyerWallet => {

                        cloverController.mintPremiumClv(userId, clvAmount, buyerWallet, 'PayPal', 'Premium')
                            .then(result => {

                                cloverController.ReferralClvMaster(buyerWallet.referralSource, clvAmount, buyerWallet.codeReferral)
                                    .then(result => {

                                        cloverController.addBonus(userId, bonusClvAmount, buyerWallet, 'None', 'Bonus')
                                            .then(result => {

                                                bonusCodeController.useBonusCode(bonusCode)
                                                    .then(result => {

                                                        cloverController.makeDonation(clvAmount, donationPercent1, donationPercent2, donationPercent3, donationPercent4, donationPercent5, donationPercent6);
                                                        sellOrderController.executeSellOrder(clvAmount);

                                                        res.render('marketplaceBuySuccess', {
                                                            layout: 'dashboardLayout',
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
                                    .catch(err => {
                                        console.log(err);
                                    })

                            })
                            .catch(err => {
                                console.log(err);
                            })

                    })
                    .catch(err => {
                        console.log(err);
                    })

                
            }
        })







    })
}

