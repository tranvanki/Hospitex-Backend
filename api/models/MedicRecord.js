const mongoose = require('mongoose');

const medicRecordSchema = new mongoose.Schema({
    visit_date: { type: Date, default: Date.now },
    diagnosis: { type: String, required: [true, 'Diagnosis is required'] },
    prescription: { type: String, required: [true, 'Prescription is required'] },
    notes: { type: String, required: [true, 'Notes are required'] },
    
    // ✅ FIX: Use ObjectId for references, not String
    patient_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Patient', 
        required: [true, 'Patient ID is required'] 
    },
    staff_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Staffs', 
        required: [true, 'Staff ID is required'] 
    }
}, {
    timestamps: true // ✅ Add timestamps for created/updated tracking
});

const MedicRecord = mongoose.model('MedicRecord', medicRecordSchema);
module.exports = MedicRecord;