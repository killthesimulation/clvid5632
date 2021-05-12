const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;


const BonusCodeSchema = new mongoose.Schema({
    percent: {
        type: Number,
        default: 0
    },
    validTill: {
        type: Date,
        default: Date.now
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    code: {
        type: String,
        default: ''
    }
})

const BonusCode = mongoose.model('BonusCode', BonusCodeSchema);

module.exports = BonusCode;