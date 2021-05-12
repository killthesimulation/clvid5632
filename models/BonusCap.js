const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;


const BonusCapSchema = new mongoose.Schema({
    codeReferral: {
        type: String,
        default: ''
    },
    month: {
        type: Number,
        default: 0
    },
    year: {
        type: Number,
        default: 0
    },
    capLimit: {
        type: Number,
        default: 0
    },
    capValue: {
        type: Number,
        default: 0
    }
  
})

const BonusCap = mongoose.model('BonusCap', BonusCapSchema);

module.exports = BonusCap;