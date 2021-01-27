const mongoose = require('mongoose')
const User = require('../models/user')

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    items: {
        type: Object,
        required:true
    },
    paymentType: {
        type:String,
        default: 'COD',
        required: true
    },
    status: {
        type:String,
        default: 'order_placed',
        required: true
    },
    phone: {
        type: Number,
        required:true
    },
    address: {
        type: String,
        required:true
    }

},{timestamps:true}) 

const Order = mongoose.model('Order',orderSchema)
module.exports = Order