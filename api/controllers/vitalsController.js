const Vitals = require('../models/vitals');
const Patient = require('../models/Patient');

// Create new vital for a patient
const createVital = async (req, res) => {
  try {
    console.log('=== CREATE VITAL ===');
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    
    // Extract patient_id from request body
    const { patient_id, temperature, blood_pressure, pulse, resp_rate } = req.body;
    
    // Validate required fields
    if (!patient_id || !temperature || !blood_pressure || !pulse || !resp_rate) {
      return res.status(400).json({ message: 'Missing required information' });
    }
    
    // Check if patient exists
    const patient = await Patient.findById(patient_id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    console.log('Found patient:', patient.patient_name);
    
    // Check access permission
    if (req.user.role !== 'admin' && patient.staff_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to add vitals for this patient' });
    }
    
    // Create new vital (store only necessary data, no population)
    const newVital = new Vitals({
      patient_id,
      temperature: Number(temperature),
      blood_pressure,
      pulse: Number(pulse),
      resp_rate: Number(resp_rate),
      timestamp: new Date()
    });
    
    const savedVital = await newVital.save();
    
    // ✅ SKIP POPULATE - Return only vital data
    console.log('Vital saved successfully:', savedVital._id);
    res.status(201).json(savedVital);
    
  } catch (err) {
    console.error('Create vital error:', err);
    res.status(400).json({ message: err.message });
  }
};

// Get ALL vitals
const getAllVitals = async (req, res) => {
  try {
    console.log('=== GET ALL VITALS ===');
    console.log('User role:', req.user.role);
    
    let vitals;
    
    if (req.user.role === 'admin') {
      // Admin can view all vitals
      vitals = await Vitals.find().sort({ timestamp: -1 });
    } else {
      // Doctor can only view vitals of assigned patients
      const patients = await Patient.find({ staff_id: req.user.id });
      const patientIds = patients.map(p => p._id);
      
      vitals = await Vitals.find({ patient_id: { $in: patientIds } })
        .sort({ timestamp: -1 });
    }
    
    // ✅ SKIP POPULATE - Frontend will fetch patient info if needed
    res.json(vitals);
    
  } catch (err) {
    console.error('Get all vitals error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get vitals for a specific patient
const getVitalsByPatientId = async (req, res) => {
  try {
    const patientMongoId = req.params.id;
    console.log('=== GET VITALS BY PATIENT ===');
    console.log('Patient ID:', patientMongoId);
    
    // Check if patient exists
    const patient = await Patient.findById(patientMongoId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Check access permission
    if (req.user.role !== 'admin' && patient.staff_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'You do not have permission to access this patient’s data' });
    }
    
    // Retrieve vitals for this patient
    const vitals = await Vitals.find({ patient_id: patientMongoId })
      .sort({ timestamp: -1 });
      
    // ✅ SKIP POPULATE - Return only vitals data
    res.json(vitals);
    
  } catch (err) {
    console.error('Get patient vitals error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Update vital
const updateVital = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('=== UPDATE VITAL ===');
    console.log('Vital ID:', id);
    
    // Find vital
    const vital = await Vitals.findById(id);
    if (!vital) {
      return res.status(404).json({ message: 'Vital not found' });
    }
    
    // Verify patient for permission check
    const patient = await Patient.findById(vital.patient_id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Check permission
    if (req.user.role !== 'admin' && patient.staff_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to edit this vital' });
    }
    
    // Update vital
    const updatedVital = await Vitals.findByIdAndUpdate(id, req.body, { new: true });
    
    // ✅ SKIP POPULATE
    res.json(updatedVital);
    
  } catch (err) {
    console.error('Update vital error:', err);
    res.status(400).json({ message: err.message });
  }
};

// Delete vital
const deleteVital = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('=== DELETE VITAL ===');
    console.log('Vital ID:', id);
    
    const vital = await Vitals.findById(id);
    if (!vital) {
      return res.status(404).json({ message: 'Vital not found' });
    }
    
    // Check permission via patient
    const patient = await Patient.findById(vital.patient_id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    if (req.user.role !== 'admin' && patient.staff_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this vital' });
    }
    
    await Vitals.findByIdAndDelete(id);
    res.json({ message: 'Vital deleted successfully' });
    
  } catch (err) {
    console.error('Delete vital error:', err);
    res.status(400).json({ message: err.message });
  }
};
//totalvital
const totalVital = async (req, res) => {
  try {
    const count = await Vitals.countDocuments();
    res.json({ totalVital: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  getAllVitals,           
  getVitalsByPatientId,
  createVital,
  updateVital,
  totalVital,
  deleteVital
};