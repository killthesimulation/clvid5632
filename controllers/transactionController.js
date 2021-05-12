const Transaction = require('../models/Transaction');
const configController = require('../controllers/configController');


exports.createTransaction = function(wallet, amount, paid, type) {
    return new Promise((resolve, reject) => {

        configController.configGetPrice()
            .then(price => {
                const usdTotal = Number(price) * Number(amount);

                const newTransaction = new Transaction({
                    userId: wallet.codeReferral,
                    userIdHash: wallet._id,
                    type: '',
                    firstName: wallet.firstName,
                    lastName: wallet.lastName,
                    email: wallet.email,
                    usd: usdTotal,
                    clv: amount,
                    price: price,
                    paid: paid,
                    info: type,
                });

                newTransaction.save()
                    .then(transaction => {
                        resolve(transaction);
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
    })
}



exports.createTransactionSell = function(wallet, amount, paid, type) {
    return new Promise((resolve, reject) => {

        configController.configGetPrice()
            .then(price => {
                const usdTotal = Number(price) * Number(amount);

                const newTransaction = new Transaction({
                    userId: wallet.codeReferral,
                    userIdHash: wallet._id,
                    type: 'Sell',
                    firstName: wallet.firstName,
                    lastName: wallet.lastName,
                    email: wallet.email,
                    usd: usdTotal,
                    clv: amount,
                    price: price,
                    paid: paid,
                    info: type,
                });

                newTransaction.save()
                    .then(transaction => {
                        resolve(transaction);
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
    })
}




exports.getTransactionsAmount = function() {
    return new Promise((resolve, reject) => {
        Transaction.find({})
            .then(transactions => {
                resolve(transactions.length);
            })
            .catch(err => {
                reject(err);
            })
    })
}

exports.findTransactions = function (id) {
    return new Promise((resolve, reject) => {
        Transaction.find({ userIdHash: id }).sort('-date')
            .then(transactions => {
                let transactionsFormated = [];
                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                transactions.forEach(item => {
                    const date = item.date;
                    const dateFormated = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getYear() + 1900}`;
                    const transactionItem = {
                        userId: item.userId,
                        walletId: item.userIdHash,
                        type: item.type,
                        firstName: item.firstName,
                        lastName: item.lastName,
                        date: dateFormated,
                        clv: item.clv,
                        price: item.price.toFixed(4),
                        usd: item.usd.toFixed(4),
                        paid: item.paid,
                        from: item.from,
                        info: item.info
                    }
                    transactionsFormated.push(transactionItem);
                });
                resolve(transactionsFormated);
            })
            .catch(err => {
                reject(err);
            })
    })
}

exports.getAllTransactions = function () {
    return new Promise((resolve, reject) => {
        Transaction.find({}).sort({_id: -1})
            .then(transactions => {
                resolve(transactions);
            })
            .catch(err => {
                reject(err);
            })
    })
}
