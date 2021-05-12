const BonusCode = require('../models/BonusCode');
const configController = require('./configController');
const functions = require('../tools/functions');
const { resolveContent } = require('nodemailer/lib/shared');

exports.createBonusCode = function() {
    return new Promise((resolve, reject) => {

        const dateNow = new Date();
        const tillDate = new Date(dateNow.setMonth(dateNow.getMonth()+1));
       

        const newBonusCode = new BonusCode({
            percent: 2,
            validTill: tillDate,
            code: functions.bonusCodeGen()
        })

        newBonusCode.save()
        .then(bonusCode => {
            resolve(bonusCode);
        })
        .catch(err => {
            reject(err);
        })

    })
}


exports.checkBonusCode = function(code) {
    return new Promise((resolve, reject) => {
        BonusCode.findOne({ code: code })
            .then(bonusCode => {

               


                if(bonusCode){
                    const dateNow = new Date();
                    if(bonusCode.validTill > dateNow && bonusCode.isUsed == false){
                        const data = {
                            status: true,
                            percent: bonusCode.percent
                        }

                       

                        resolve(data);
                    }else{
                        const data = {
                            status: false
                        }

                       

                        resolve(data)
                    }
                }else{
                    const data = {
                        status: false
                    }

                    

                    resolve(data)
                }
                



            })
            .catch(err => {
                const data = {
                    status: false
                }

        

                reject(data)
            })
    })
}


exports.useBonusCode = function(code){
    return new Promise((resolve, reject) => {
        BonusCode.findOne({ code: code })
            .then(bonusCode => {

                if(bonusCode){
                    bonusCode.isUsed = true;
                    bonusCode.save()
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    })
                }else{
                    resolve("ok");
                }

                


            })
            .catch(err => {
                reject(err);
            })
    })
}