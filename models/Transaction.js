const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const { Types: { Long } } = mongoose;


const TransactionSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: ''
    },
    userIdHash: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    },
    usd: {
        type: Number,
        default: 0
    },
    clv: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    lock: {
        type: Date,
        default: Date.now
    },
    paid: {
        type: String,
        default: ''
    },
    from: {
        type: String,
        default: 'Clover Country'
    },
    info: {
        type: String,
        default: 'Processing'
    }

})

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;