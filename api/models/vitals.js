const mongoose = require('mongoose');
const vitalsSchema = new mongoose.Schema({
    timestamp : { type: Date, default: Date.now },
    temperature: { type: Number, required: true },
    blood_pressure: { type: String, required: true },
    pulse : { type: Number, required: true },
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    resp_rate : { type: Number, required: true }
});
const Vitals = mongoose.model('Vitals', vitalsSchema);

module.exports = Vitals;