const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    vehicleName: { type: String, required: true },
    vehicleImage:[{ type: String }], // Path to store the vehicle image
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
