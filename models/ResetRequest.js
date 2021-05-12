const mongoose = require('mongoose');


const ResetRequestSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    requestId: {
        type: String,
        required: true
    },
})

const ResetRequest = mongoose.model('ResetRequest', ResetRequestSchema);

module.exports = ResetRequest;