const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;


const WithdrawRequestSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    usdAmount: {
        type: Number,
        default: 0
    },
    info: {
        type: String,
        required: true
    },
    status:{
        type: String,
        default: 'opened'
    },
    closeDate:{
        type: String,
        default: '-'
    }
})

const WithdrawRequest = mongoose.model('WithdrawRequest', WithdrawRequestSchema);

module.exports = WithdrawRequest;