const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;


const WalletSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        default: 'none'
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    dateBirth: {
        type: String,
        default: '--/--/----'
    },
    country: {
        type: String,
        default: ''
    },
    clvBalance: {
        type: Number,
        default: 0
    },
    usdBalance: {
        type: Number,
        default: 0
    },
    clvPremium: {
        type: Long,
        default: 0
    },
    clvFree: {
        type: Number,
        default: 0
    },
    usdBonus: {
        type: Number,
        default: 0
    },
    clvToSell: {
        type: Number,
        default: 0
    },
    lockDate: {
        type: Date,
        default: Date.now
    },
    clvReferral: {
        type: Number,
        default: 0
    },
    codeReferral: {
        type: String,
        default: ''
    },
    referralSource: {
        type: String,
        default: ''
    },
    ip: {
        type: String,
        default: ''
    },
    reputationIndex: {
        type: Number,
        default: 1
    },
    usdWallet: {
        type: Number,
        default: 0
    },
    restrictionPercentSellPerMounth: {
        type: Number
    },
    restrictionLockPeriod: {
        type: Number,
        default: -1
    },
    restrictionLockPeriodFree: {
        type: Number,
        default: -1
    }
})

const Wallet = mongoose.model('Wallet', WalletSchema);

module.exports = Wallet;