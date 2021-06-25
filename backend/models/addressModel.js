var mongoose = require('mongoose');

var addressSchema = new mongoose.Schema({
    pinCode: {type: Number, required:true},
    address : String,
    locality : String,
    landMark : String,
    City: String,
    State: String,
    // Reference Field 
    userId : {required:true, type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    isDefaultAddress: Boolean,
    isDeleted : Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model('address', addressSchema);