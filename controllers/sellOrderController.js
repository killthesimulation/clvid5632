const { resolveContent } = require('nodemailer/lib/shared');
const configController = require('../controllers/configController');
const SellOrder = require('../models/SellOrder');
const SellCap = require('../models/SellCap');
const walletController = require('../controllers/walletController');
const Clover = require('../models/Clover');
const Wallet = require('../models/Wallet');
const transactionController = require('../controllers/transactionController')


exports.createSellOrder = function(clvId, ownerId, amount){
    return new Promise((resolve, reject) => {
        newSellOrder = new SellOrder({
            clvId,
            ownerId,
            amount
        });

        newSellOrder.save()
            .then(result => {
                this.createSellCap(clvId)
                    .then(info => {
                        resolve(result);
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

exports.getClvInSellOrders = function(userId) {
    return new Promise((resolve, reject) => {
        SellOrder.find({ownerId : userId, active: true}).select('clvId')
            .then(result => {
                let idsArray = [];
                result.forEach(item => {
                    idsArray.push(item.clvId);
                })
                resolve(idsArray);
            })
            .catch(err => {
                reject(err);
            })
    })
}

exports.getSellOrders = function(userId) {
    return new Promise((resolve, reject) => {


        configController.configGetPrice()
            .then(price => {
                SellOrder.find({ownerId: userId, active: true})
                    .then(result => {


                        this.getQueueNumber()
                            .then(queueNumberArray => {


                                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                                let sellOrdersArray = [];
                                
                                result.forEach(item => {
                                    const sellOrderItem = {
                                        amount: item.amount,
                                        date: `${item.dateCreated.getDate()} ${monthNames[item.dateCreated.getMonth()]} ${item.dateCreated.getFullYear()}`,
                                        usAmount: item.amount * price,
                                        number: queueNumberArray.map(function (item) { return item.id; }).indexOf(item._id.toString()) + 1,
                                        id: item._id
                                    }
        
                                    sellOrdersArray.push(sellOrderItem);
                                })
        
                           
        
                                resolve(sellOrdersArray);


                            })
                            .catch(err => {
                                reject(err);
                            })




                       









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

exports.getActiveSellOrders = function() {
    return new Promise((resolve, reject) => {
        SellOrder.find({active: true})
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            })
    })
}

exports.getActiveSellOrdersById = function(orderId) {
    return new Promise((resolve, reject) => {
        SellOrder.find({active: true, _id:orderId})
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            })
    })
}



exports.getSellCap = function() {
    return new Promise((resolve, reject) => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        SellCap.find({month: currentMonth, year: currentYear}).select('clvId')
            .then(result => {
                let idsArray = [];
                result.forEach(item => {
                    idsArray.push(item.clvId);
                })

                resolve(idsArray);

            })
            .catch(err => {
                reject(err);
            })
    })
}


exports.deleteSellCap = function(clv) {
    return new Promise((resolve, reject) => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        SellCap.deleteOne({clvId: clv, month: currentMonth, year: currentYear}).select('clvId')
            .then(result => {
               
                resolve(result);


            })
            .catch(err => {
                reject(err);
            })
    })
}


exports.createSellCap = function(clvId) {
    return new Promise((resolve, reject) => {

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        newSellCap = new SellCap({
            clvId,
            month: currentMonth,
            year: currentYear
        })

        newSellCap.save()
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err)
            })
    })
}


exports.sortSellOrdersByIndex = function(sellOrders){
    return new Promise((resolve, reject) => {
        let sellOrdersArray = sellOrders;
        sellOrdersArray.sort((a, b) => {   
            return  b.index - a.index || new Date(a.date) - new Date(b.date);
        });
        resolve(sellOrdersArray);
    })
}




exports.getQueueNumber = function() {
    return new Promise((resolve, reject) => {
        walletController.getAllWallets()
            .then(wallets=> {
                this.getActiveSellOrders()
                    .then(sellOrders => {


                        let sellOrdersArray = [];

                        sellOrders.forEach(item => {


                            const walletItem = wallets.filter(wallets => {return wallets._id == item.ownerId});
                            const index = walletItem[0].reputationIndex;

                        

                            const sellOrderItem = {
                                id: item._id.toString(),
                                clvId: item.clvId,
                                ownerId: item.ownerId,
                                amount: item.amount,
                                date: item.dateCreated,
                                index: index
                            }

                           
                            sellOrdersArray.push(sellOrderItem);

                        })





                        this.sortSellOrdersByIndex(sellOrdersArray)
                            .then(result => {
                          

                              

                              

                                resolve(result);
                            })
                            .catch(err => {
                                reject(err);
                            })


                       


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


exports.getCurrentSellOrder = function() {
    return new Promise((resolve, reject) => {
        walletController.getAllWallets()
            .then(wallets=> {
                this.getActiveSellOrders()
                    .then(sellOrders => {


                        let sellOrdersArray = [];

                        sellOrders.forEach(item => {


                            const walletItem = wallets.filter(wallets => {return wallets._id == item.ownerId});
                            const index = walletItem[0].reputationIndex;

                        

                            const sellOrderItem = {
                                id: item._id.toString(),
                                clvId: item.clvId,
                                ownerId: item.ownerId,
                                amount: item.amount,
                                date: item.dateCreated,
                                index: index
                            }

                           
                            sellOrdersArray.push(sellOrderItem);

                        })





                        this.sortSellOrdersByIndex(sellOrdersArray)
                            .then(result => {
                          

                                resolve(result[0]);
                            })
                            .catch(err => {
                                reject(err);
                            })


                       


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


exports.closeSellOrder = function(sellOrderId){
    return new Promise((resolve, reject) => {
        SellOrder.findOne({_id: sellOrderId})
            .then(sellOrder => {
                sellOrder.active = false;
                var currentDate = new Date(); //use your date here
                currentDate.toLocaleDateString('en-US'); // "en-US" gives date in US Format - mm/dd/yy
                sellOrder.closeDate = currentDate;
                sellOrder.save()
                    .then(result => {
                        this.deleteSellCap(sellOrder.clvId)
                            .then(finalRes => {
                                resolve(finalRes);
                            })
                       
                    })
            })
    })
}


exports.partCloseSellOrder = function(sellOrderId, amount){
    return new Promise((resolve, reject) => {
        SellOrder.findOne({_id: sellOrderId})
            .then(sellOrder => {
                sellOrder.amount = sellOrder.amount - amount;

                sellOrder.save()
                    .then(result => {
                        Clover.findOne({_id: result.clvId})
                            .then(cloverResult => {
                                cloverResult.amount = cloverResult.amount - amount;

                                cloverResult.save()
                                    .then(cloverUpdated => {


                                        Wallet.findOne({_id: cloverUpdated.owner})
                                            .then(wallet => {

                                                configController.configGetPrice()
                                                    .then(price => {
                                                        wallet.usdWallet = wallet.usdWallet + amount * price;
                                                        wallet.save()
                                                            .then(finalResult => {

                                                                transactionController.createTransactionSell(wallet, amount, 'Marketplace', cloverResult.type)
                                                                    .then(final => {
                                                                        resolve(finalResult);
                                                                    })
                                                                
                                                            })
                                                    })

                                               


                                                
                                            })

                                        
                                    })
                            })
                    })
            })
    })
}

exports.fullCloseSellOrder = function(sellOrderId, amount){
    return new Promise((resolve, reject) => {
        this.closeSellOrder(sellOrderId)
            .then(res1 => {
                Clover.findOne({_id:res1.clvId})
                    .then(clvItem => {
                        clvItem.amount = clvItem.amount - res1.amount;
                        clvItem.save()
                            .then(updatedClv => {
                                configController.configGetPrice()
                                    .then(price => {
                                        Wallet.findOne({_id: res1.ownerId})
                                            .then(wallet => {
                                                wallet.usdWallet = wallet.usdWallet + (res1.amount * price);

                                                wallet.save()
                                                    .then(result => {

                                                        transactionController.createTransactionSell(wallet, res1.amount, 'Marketplace', clvItem.type)
                                                            .then(final => {
                                                                const leftToClose = amount - res1.amount;
                                                                resolve(leftToClose);
                                                            })

                                                    })
                                            })
                                    })
                            })
                    })
                    
            })
    })
}




exports.cycleCloseSellOrders = function(amount){
    return new Promise((resolve, reject) => {
        let leftToSell = amount;

       



            console.log('doing');

            this.getCurrentSellOrder()
            .then(currentSellOrder => {



                if(currentSellOrder){


                    if(leftToSell < currentSellOrder.amount){

                        this.partCloseSellOrder(currentSellOrder.id, leftToSell)
                                .then(res => {
                                    leftToSell = 0;
                                    console.log('Closed partly', `left ${leftToSell}`);
                                    resolve(leftToSell);
                                })
    
                    }else{
    
                        this.fullCloseSellOrder(currentSellOrder.id, leftToSell)
                                .then(res => {
                                    leftToSell = res;
                                    console.log('Closed fully', `left ${leftToSell}`);
                                    resolve(leftToSell);
                                   
                                })
    
                    }


                }else{
                    resolve(0);
                }


         







            })

    })
}




exports.executeSellOrder = function(amount) {
   
        this.cycleCloseSellOrders(amount)
            .then(result => {
                if(result > 0){
                    this.executeSellOrder(result);
                }else{
                    console.log('all done')
                }
            })

}


exports.getAllSellOrders = function() {
    return new Promise((resolve, reject) => {
        SellOrder.find()
            .then(sellOrders => {
                resolve(sellOrders);
            })
    })
}