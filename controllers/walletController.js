const Wallet = require('../models/Wallet');
const Clover = require('../models/Clover');
const request = require('request');
const functions = require('../tools/functions');
const bcrypt = require('bcryptjs');
const PartyReferralCode = require('../models/PartyReferralCode');
const configController = require('../controllers/configController');
const geoip = require('geoip-lite');
const phoneCodes = require('../tools/phoneCodes.json');










exports.addContactToCrm = function (wallet) {
    

        var options = {
            'method': 'POST',
            'url': 'https://newaccount1620692280912.freshdesk.com/api/v2/contacts',
            'headers': {
              'Authorization': 'Basic QlJPZG5vdnBtRzhoUHE4ZGNsbTpY',
              'Cookie': '_x_w=1'
            },
            'formData': {
              'name': wallet.firstName + ' ' + wallet.lastName,
              'email': wallet.email,
              'phone': wallet.phone,
              'job_title':`${wallet.codeReferral}`,
              'description': wallet.gender,
            }
          };

          console.log(options);
          request(options, function (error, response) {
            if (error) {console.log(error)};
            console.log(response.body);
          });
        

}



exports.createWallet = function(req, res) {

    return new Promise((resolve, reject) => {





    const { firstName, lastName, gender, password, password2 } = req.body;

    const ip = req.header('x-forwarded-for');

    //const ip = '46.185.13.14';


    const referral = req.body['referral'].toUpperCase();
    const email = req.body['email'].toLowerCase();
    const phone = req.body['phone'].replace(/\s/g, '');
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




    //Check fields

    if (!firstName || !lastName || !email || phone.length < 6 || !password || !password2 || !gender) {
        errors.push({ msg: 'Please fill in all fields' })
    }

    //Check password match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' })
    }

    //Check pass length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }


    if (errors.length > 0) {
        res.render('create', {
            errors,
            firstName,
            lastName,
            email,
            phone,
            referral,
            password,
            password2,
            gender
        });
        reject("No success");
    } else {
        //Validation pass
        Wallet.findOne({ $or:[ {email: email}, {phone: phone} ]})
            .then(wallet => {
                if (wallet) {
                    //Wallet exists
                    errors.push({ msg: 'Email or Phone number is already registered' });
                    res.render('create', {
                        errors,
                        firstName,
                        lastName,
                        email,
                        phone,
                        referral,
                        password,
                        password2,
                        gender
                    });
                    reject("No success");
                } else {


                    Wallet.findOne({ip: ip})
                        .then(wallet => {
                            if(wallet){
                                errors.push({ msg: "Sorry, you can't create an account" });
                                res.render('create', {
                                    errors,
                                });
                                reject("No success");
                            }else{

                                
                    const newWallet = new Wallet({
                        firstName,
                        lastName,
                        email,
                        phone,
                        codeReferral: functions.referralGen(),
                        referralSource: referral,
                        password,
                        gender,
                        ip
                    });

                    //Hash password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newWallet.password, salt, (err, hash) => {
                            if (err) throw err;
                            //Set password to hashed
                            newWallet.password = hash;
                            newWallet.save()
                                .then(wallet => {


                                                    this.addContactToCrm(wallet)
                                                   
                                                        req.flash('success_msg', 'You are now registered and can log in');
                                                        res.redirect('/wallet/login');
                                                        resolve(wallet);
                                                   

                                                  

                                  
                                           
                                    
                                })
                                .catch(err => console.log(err));
                        }))





                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })







                }
            });
    }


})

}


exports.findWallet = function (id) {
    return new Promise((resolve, reject) => {
        Wallet.findOne({ _id: id })
            .then(wallet => {
                resolve(wallet);
            })
            .catch(err => {
                reject(err);
            })
    })
}



exports.findReferralAmount = function (code) {
    return new Promise((resolve, reject) => {
        Wallet.find({ referralSource: code })
            .then(wallets => {
                const data = {
                    amount: wallets.length,
                    referrals: wallets
                }
                resolve(data);
            })
            .catch(err => {
                reject(err);
            })
    })
}


exports.findPartyReferralAmount = function (code) {
    return new Promise((resolve, reject) => {

        let referralCodeArray = []

        PartyReferralCode.find({ "users.referralCode" : code})
            .then(partyReferralCode => {
              

                if(partyReferralCode.length > 0){

                


                partyReferralCode.forEach(item => {
                    referralCodeArray.push(item.codeReferral);

                    if(referralCodeArray.length === partyReferralCode.length){
                        Wallet.find( { referralSource: { $in: referralCodeArray } } )
                            .then(wallets => {
                                const data = {
                                    amount: wallets.length,
                                    referrals: wallets
                                }
                                resolve(data);
                            })
                            .catch(err => {
                                reject(err);
                            })
                    }
                })


            }else{
                const data = {
                    amount: 0,
                    referrals: []
                }
                resolve(data);
            }


                
            })
            .catch(err => {
                reject(err);
            })
    })
}


exports.getWalletsAmount = function () {
    return new Promise((resolve, reject) => {
        Wallet.find({})
            .then(wallets => {
                resolve(wallets.length);
            })
            .catch(err => {
                reject(err);
            })
    })
}

exports.getAllWallets = function () {
    return new Promise((resolve, reject) => {
        Wallet.find({}).sort({_id: -1})
            .then(wallets => {
                resolve(wallets);
            })
            .catch(err => {
                reject(err);
            })
    })
}

exports.getAllWalletsMaster = function (order) {
    return new Promise((resolve, reject) => {

        


        if(order == 'name'){


            Wallet.find({}).sort({firstName: 1})
            .then(wallets => {
                resolve(wallets);
            })
            .catch(err => {
                reject(err);
            })




        }








        if(order == 'date' || !order) {


            Wallet.find({}).sort({date: 1})
            .then(wallets => {
                resolve(wallets);
            })
            .catch(err => {
                reject(err);
            })


        }



        if(order == 'date2'){


            Wallet.find({}).sort({date: -1})
            .then(wallets => {
                resolve(wallets);
            })
            .catch(err => {
                reject(err);
            })


        }

      
    }) 
}



exports.setUsdBonus = function (id, amount) {
    return new Promise((resolve, reject) => {
        Wallet.findOneAndUpdate({  _id: id }, {$set:{usdBonus: amount}}, {new: true})
            .then(wallet => {
                resolve(wallet);
            })
            .catch(err => {
                reject(err);
            })
    })
}

exports.addCashback = function (id, amount) {
    return new Promise((resolve, reject) => {
        Wallet.findOne({ _id: id })
            .then(wallet => {
                const usdBalance = wallet.usdBonus;
                wallet.usdBonus = Number(usdBalance) + Number(amount);
                wallet.save()
                    .then(wallet => {
                        resolve(wallet);
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
            .catch(err => {
                reject(err);
            })
    })
}

exports.addUsdToWallet = function (id, amount) {
    return new Promise((resolve, reject) => {
        Wallet.findOne({_id: id})
            .then(wallet => {
                const usdBalance = wallet.usdWallet;
                wallet.usdWallet = Number(usdBalance) + Number(amount);
                wallet.save()
                    .then(wallet => {
                        resolve(wallet);
                    })
                    .catch(err => {
                        reject(err);
                    })
            })

    })
}

exports.getFemalePercent = function () {
    return new Promise((resolve, reject) => {
        Wallet.find({})
            .then(wallets => {
                Wallet.find({ gender: 'female'})
                    .then(femaleWallets => {
                        const percent = (((femaleWallets.length / wallets.length) * 100) + 3.8).toFixed(1);
                        resolve(percent);
                    })
            })
            .catch(err => {
                reject(err);
            })
    })
}

exports.getUserGeoInfo = function (req) {
    return new Promise((resolve, reject) => {
    const ip = req.header('x-forwarded-for');

        
    //const ip = '46.185.13.14';

  


        if(ip){
            const geo = geoip.lookup(ip);
            const country = geo.country;
            let dialCode;

            phoneCodes.forEach((item) => {
                if(item.code === country){
                    dialCode = item.dial_code
                }
            })

            const data = {
                ip,
                country,
                dialCode
            }

            resolve(data);
           
        }else{
            reject("Error defining IP Adress");
        }
    })
}

exports.updateWalletPassword = function(email, password){
    return new Promise((resolve, reject) => {
        Wallet.findOneAndUpdate({  email: email }, {$set:{password: password}}, {new: true})
            .then(wallet => {
                resolve(wallet);
            })
            .catch(err => {
                reject(err);
            })
    })
}

exports.getWalletUsdBalance = function(id) {
    return new Promise((resolve, reject) => {
        Wallet.findOne({_id: id})
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(err);
            })
    })
}

exports.getWalletIndex = function(id) {
    return new Promise((resolve, reject) => {
        Wallet.findOne({_id: id})
            .then(result => {
                resolve(result.reputationIndex);
            })
            .catch(err => {
                reject(err);
            })
    })
}


exports.changeWalletIndex = function(id, amount) {
    return new Promise((resolve, reject) => {
        Wallet.findOne({_id: id})
            .then(result => {
                result.reputationIndex = amount;
                result.save()
                    .then(resultFinal => {
                        resolve(resultFinal)
                    })
            })
            .catch(err => {
                reject(err);
            })
    })
}


exports.getPersonalLockDownPeriod = function(id) {
    return new Promise((resolve, reject) => {
        Wallet.findOne({_id: id})
            .then(result => {
                if(result.restrictionLockPeriod >= 0){
                    resolve(result.restrictionLockPeriod);
                }else if(result.restrictionLockPeriod == ''){
                    configController.configGetDefaultPremiumLockdown()
                        .then(lockdown => {
                            resolve(lockdown);
                        })
                        .catch(err => {
                            reject(err);
                        })
                }
            })
            .catch(err => {
                reject(err);
            })
    })
}


exports.setPersonalLockDownPeriod = function(id, amount) {
    return new Promise((resolve, reject) => {
        Wallet.findOne({_id: id})
            .then(result => {
                result.restrictionLockPeriod = amount;
                console.log(result);
                result.save()
                    .then(res2 => {
                        resolve("success");
                    })
            })
            .catch(err => {
                reject(err);
            })
    })
}


exports.setPersonalLockDownPeriodFree = function(id, amount) {
    return new Promise((resolve, reject) => {
        Wallet.findOne({_id: id})
            .then(result => {
                result.restrictionLockPeriodFree = amount;
                console.log(result);
                result.save()
                    .then(res2 => {
                        resolve("success");
                    })
            })
            .catch(err => {
                reject(err);
            })
    })
}


exports.getPersonalLockDownPeriodFree = function(id) {
    return new Promise((resolve, reject) => {
        Wallet.findOne({_id: id})
            .then(result => {
                if(result.restrictionLockPeriodFree >= 0){
                    resolve(result.restrictionLockPeriodFree);
                }else if(result.restrictionLockPeriodFree == ''){
                    configController.configGetDefaultFreeLockdown()
                        .then(lockdown => {
                            resolve(lockdown);
                        })
                        .catch(err => {
                            reject(err);
                        })
                }
                
            })
            .catch(err => {
                reject(err);
            })
    })
}

exports.getPersonalRestrictionPercentSellPerMounth = function (id) {
    return new Promise((resolve, reject) => {
        Wallet.findOne({_id: id})
            .then(result => {
                if(result.restrictionPercentSellPerMounth){
                    resolve(result.restrictionPercentSellPerMounth);
                }else{
                    configController.configGetDefaultSellRestriction()
                        .then(restriction => {
                             resolve(restriction)
                        })
                        .catch(err => {
                            reject(err);
                        })
                }
            })
            .catch(err => {
                reject(err);
            })
    })
}
 



exports.setPersonalRestrictionPercentSellPerMonth = function(id, amount) {
    return new Promise((resolve, reject) => {
        Wallet.findOne({_id: id})
            .then(result => {
                result.restrictionPercentSellPerMounth = amount;
                console.log(result);
                result.save()
                    .then(res2 => {
                        resolve("success");
                    })
            })
            .catch(err => {
                reject(err);
            })
    })
}