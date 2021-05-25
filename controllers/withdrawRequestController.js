const { promiseImpl } = require('ejs')
const WithdrawRequest = require('../models/WithdrawRequest')
const Wallet = require('../models/Wallet')


exports.createWithdrawRequest = function(id, amount, info){
    return new Promise((resolve, reject) => {
        Wallet.findOne({_id: id})
            .then(wallet => {

                const newWithdrawalRequest = new WithdrawRequest({
                    firstName: wallet.firstName,
                    lastName: wallet.lastName,
                    email: wallet.email,
                    phone: wallet.phone,
                    usdAmount: amount,
                    info,
                    id
                })

                newWithdrawalRequest.save()
                    .then(result => {
                        Wallet.findOne({_id : id})
                            .then(walletResult => {
                                walletResult.usdWallet = walletResult.usdWallet - amount;
                                walletResult.save()
                                    .then(finalResult => {
                                        resolve(finalResult);
                                    })
                            })
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
    })
}

exports.getAllWithdrawRequests = function() {
    return new Promise((resolve, reject) => {
        WithdrawRequest.find()
            .then(result => {
                resolve(result);
            })
    })
}


exports.closeWithdrawRequest = function (id) {
    return new Promise((resolve, reject) => {
        WithdrawRequest.findOne({_id: id})
            .then(item =>{
                var currentDate = new Date(); //use your date here
                currentDate.toLocaleDateString('en-US'); 
                item.status = 'closed'
                item.closeDate = currentDate
                item.save()
                    .then(newItem => {
                        resolve('success');
                    })
            })
    })
}