const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;


const PartyReferralCodeSchema = new mongoose.Schema({
    codeReferral: {
        type: String,
        default: ''
    },
    users: {
        type: Array
    }  
})

const PartyReferralCode = mongoose.model('PartyReferralCode', PartyReferralCodeSchema);

module.exports = PartyReferralCode;