const mongoose = require("mongoose");
const patientSchema = new mongoose.Schema({
    patient_name: { type: String, required: [true,'Patient name is required!'] },
    patient_id: { type: String, required: [true, 'Patient id is require!'], unique: true },
    phone_num: { type: String, required: [true, 'Phone number is required!'] },
    medical_history: { type: String, required: [true, 'Medical history is required!'] },
    discharge_status: { type: String, required: [true, 'Discharge status is required!'] },
    staff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Staffs', required: true }
})

const Patient = mongoose.model("Patient", patientSchema);
module.exports = mongoose.model("Patient", patientSchema);
