const BonusCap = require('../models/BonusCap')
const configController = require('./configController');

exports.createBonusCap = function(codeReferral) {
    return new Promise((resolve, reject) => {

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        configController.configGetDefaultBonusCap()
            .then(defaultCap => {
                const newBonusCap = new BonusCap({
                    codeReferral,
                    capLimit: defaultCap,
                    month: currentMonth,
                    year: currentYear
                });
        
                newBonusCap.save()
                    .then(bonusCap => {
                        resolve(bonusCap);
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

exports.findBonusCap = function(codeReferral) {
    return new Promise((resolve, reject) => {

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        BonusCap.findOne({ codeReferral:codeReferral, month: currentMonth, year: currentYear })
            .then(bonusCap => {
                resolve(bonusCap);
            })
            .catch(err => {
                reject(err);
            })
    })
}

exports.checkBonusCap = function(codeReferral) {
    return new Promise((resolve, reject) => {
        this.findBonusCap(codeReferral)
            .then(bonusCap => {
                if(bonusCap){

                    const limit = bonusCap.capLimit;
                    const value = bonusCap.capValue;

                    if(value < limit){
                        resolve(true);
                    }else{
                        resolve(false);
                    }

                }else{
                    this.createBonusCap(codeReferral)
                        .then(newBonusCap => {
                            resolve(true);
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

exports.adminFindBonusCap = function(codeReferral) {
    return new Promise((resolve, reject) => {
        this.findBonusCap(codeReferral)
            .then(bonusCap => {
                if(bonusCap){

                    resolve(bonusCap);

                }else{
                    this.createBonusCap(codeReferral)
                        .then(newBonusCap => {
                            resolve(newBonusCap);
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

exports.increaseBonusCapValue = function(codeReferral){
    return new Promise((resolve, reject) => {

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        BonusCap.findOne({ codeReferral:codeReferral, month: currentMonth, year: currentYear })
            .then(bonusCap => {
                bonusCap.capValue = bonusCap.capValue + 1;
                bonusCap.save()
                    .then(bonusCap => {
                        resolve(bonusCap);
                    })
            })
            .catch(err => {
                reject(err);
            })

    })
}

exports.changeBonusCapLimit = function(codeReferral, amount) {
    return new Promise((resolve, reject) => {

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        BonusCap.findOne({ codeReferral:codeReferral, month: currentMonth, year: currentYear })
            .then(bonusCap => {
                bonusCap.capLimit = amount;
                bonusCap.save()
                    .then(bonusCap => {
                        resolve(bonusCap);
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