const { text } = require('express');
const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;


const CloverSchema = new mongoose.Schema({
    amount: {
        type: Number,
        default: 0
    },
    initialAmount: {
        type: Number,
        default: 0
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateLock: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: String,
        default: ''
    },
    type:{
        type: String,
        default: ''
    },
    subType:{
        type: String,
        default: ''
    },
    source:{
        type: String,
        default: 'Processing...'
    }

  
})

const Clover = mongoose.model('Clover', CloverSchema);

module.exports = Clover;