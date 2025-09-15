const MedicalRecord = require('../models/MedicRecord');
const Patient = require('../models/Patient');

// Get ALL medical records 
const getAllRecords = async (req, res) => {
    try {
        let records;
        
        if (req.user.role === 'admin') {
            // Admin can see all records
            records = await MedicalRecord.find()
                .populate('patient_id', 'patient_name')
                .sort({ visit_date: -1 });
        } else {
            // Doctor can only see records of their patients
            const patients = await Patient.find({ staff_id: req.user.id });
            const patientIds = patients.map(p => p._id);
            
            records = await MedicalRecord.find({ patient_id: { $in: patientIds } })
                .populate('patient_id', 'patient_name')
                .sort({ visit_date: -1 });
        }
        // Add patient_name for frontend
        const recordsWithPatientName = records.map(record => ({
            ...record.toObject(),
            patient_name: record.patient_id?.patient_name || 'Unknown'
        }));
        
        res.json(recordsWithPatientName);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get medical records for a specific patient
const getRecordsByPatientId = async (req, res) => {
    try {
        const patientId = req.params.patientId;
        // Verify patient exists
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        // Check permission 
        if (req.user.role !== 'admin' && patient.staff_id.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'You do not have access to this patient\'s data' });
        }
        
        // Fetch medical records for this patient
        const medicalRecords = await MedicalRecord.find({ patient_id: patientId }).sort({ visit_date: -1 });
        res.json(medicalRecords);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create medical record
const createRecord = async (req, res) => {
    try {
        console.log('=== BACKEND CREATE RECORD ===');
        console.log('Request body:', req.body);
        console.log('User from token:', req.user);

        const { patient_id, visit_date, diagnosis, prescription, notes } = req.body;

        if (!patient_id) {
            return res.status(400).json({ message: 'patient_id is required' });
        }
            if (!diagnosis) {
        return res.status(400).json({ message: 'diagnosis is required' });
        }
        if (!prescription) {
        return res.status(400).json({ message: 'prescription is required' });
        }
        // Verify patient exists
        const patient = await Patient.findById(patient_id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        // Check permissions
        if (req.user.role !== 'admin' && patient.staff_id.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        // Create new record
        const newRecord = new MedicalRecord({
            visit_date,
            diagnosis,
            prescription,
            notes,
            patient_id,
            staff_id: req.user.id
        });
        
        const savedRecord = await newRecord.save();
        console.log('Saved record:', savedRecord);
         // Populate and return
        await savedRecord.populate('patient_id', 'patient_name patient_id');
        await savedRecord.populate('staff_id', 'staff_name');
    
        res.status(201).json(savedRecord);
    } catch (err) {
        console.error('Backend create error:', err);
        res.status(400).json({ message: err.message });
    }
};
// Update medical record
const updateRecord = async (req, res) => {
    try {
        const recordId = req.params.id;
        
        // Find record first
        const record = await MedicalRecord.findById(recordId);
        if (!record) {
            return res.status(404).json({ message: 'Medical record not found' });
        }
        
        // Check permission BEFORE updating
        const patient = await Patient.findById(record.patient_id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        if (req.user.role !== 'admin' && patient.staff_id.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'You do not have access to this patient\'s data' });
        }
        // Now update
        const updatedRecord = await MedicalRecord.findByIdAndUpdate(recordId, req.body, { new: true });
        res.json(updatedRecord);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete medical record
const deleteRecord = async (req, res) => {
    try {
        const recordId = req.params.id;
        
        // Find record first
        const record = await MedicalRecord.findById(recordId);
        if (!record) {
            return res.status(404).json({ message: 'Medical record not found' });
        }
        
        // Check permission BEFORE deleting
        const patient = await Patient.findById(record.patient_id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        
        if (req.user.role !== 'admin' && patient.staff_id.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'You do not have access to this patient\'s data' });
        }
        
        // Now delete
        await MedicalRecord.findByIdAndDelete(recordId);
        res.json({ message: 'Medical record deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//total Medic Record
const totalMedicRecord = async (req, res) => {
    try{
        const count = await MedicalRecord.countDocuments();
        res.json({ totalMedicRecord: count });
    }catch (err) {
        res.status(500).json({ message: err.message });
    }
};  
module.exports = {
    getAllRecords,           
    getRecordsByPatientId,   
    createRecord,            
    updateRecord,            
    deleteRecord,
    totalMedicRecord
        
};

//const MedicalRecord = require('../models/MedicRecord');
//const patient = require('../models/Patient');
//