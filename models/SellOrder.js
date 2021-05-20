const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;


const SellOrderSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        default: Date.now
    },
    clvId: {
        type: String,
        default: ''
    },
    ownerId: {
        type: String,
        default: ''
    },
    amount: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    },
    closeDate :{
        type: String,
        default: '-'
    }
})

const SellOrder = mongoose.model('SellOrder', SellOrderSchema);

module.exports = SellOrder;