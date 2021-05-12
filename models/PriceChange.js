const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;


const PriceChangeSchema = new mongoose.Schema({
    price: {
        type: String,
        default: ''
    },
    date: {
        type: String,
        default: ''
    },
    time: {
        type: String,
        default: ''
    }
})

const PriceChange = mongoose.model('PriceChange', PriceChangeSchema);

module.exports = PriceChange;