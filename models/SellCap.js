const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;


const SellCapSchema = new mongoose.Schema({
    clvId: {
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
    }
})

const SellCap = mongoose.model('SellCap', SellCapSchema);

module.exports = SellCap;