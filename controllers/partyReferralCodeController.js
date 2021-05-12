const PartyReferralCode = require('../models/PartyReferralCode')
const bonusCapController = require('./bonusCapController');
const functions = require('../tools/functions');

exports.createPartyReferralCode = function (data){

    return new Promise((resolve, reject) => {
        
        const codeReferral = functions.partyReferralGen();

        const newPartyReferralCode = new PartyReferralCode({
            codeReferral,
            users: data
        })

        newPartyReferralCode.save()
            .then(partyReferralCode => {
                resolve(partyReferralCode);
            })
            .catch(err => {
                reject(err);
            })


    })
}


exports.getPartyReferralCodeAmount = function (){

    return new Promise((resolve, reject) => {
        
      PartyReferralCode.find({})
        .then(partyReferralCode => {
            resolve(partyReferralCode.length);
        })
        .catch(err => {
            reject(err);
        })


    })
}

exports.getPartyReferralCode = function (){

    return new Promise((resolve, reject) => {
        
      PartyReferralCode.find({}).sort('-_id')
        .then(partyReferralCode => {
            resolve(partyReferralCode);
        })
        .catch(err => {
            reject(err);
        })


    })
}

exports.findByCodePartyReferralCode = function(codeReferral) {
    return new Promise((resolve, reject) => {
        PartyReferralCode.findOne({codeReferral: codeReferral})
            .then(partyReferralCode => {
                bonusCapController.adminFindBonusCap(partyReferralCode.codeReferral)
                    .then(bonusCap => {
                        const data = {
                            partyReferralCode,
                            bonusCap
                        }

                        resolve(data);
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