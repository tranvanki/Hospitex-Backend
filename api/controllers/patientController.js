const Patient = require('../models/Patient');
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staffs');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const SECRET = process.env.JWT_SECRET;

// Get all patients - for admins
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get MY patients - for doctors to see only their assigned patients
const getMyPatients = async (req, res) => {
  try {
    // Find patients assigned to the logged-in doctor (staff)
    const patients = await Patient.find({ staff_id: req.user.id });
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patientData = await Patient.findById(req.params.id);
    if (!patientData) return res.status(404).json({ message: 'Patient not found' });
    res.status(200).json(patientData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createPatient = async (req, res) => {
  try {
    // Assign the logged-in doctor's id to staff_id
    const newPatient = new Patient({
      ...req.body,
      staff_id: req.user.id
    });
    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPatient) return res.status(404).json({ message: 'Patient not found' });
    res.status(200).json(updatedPatient);   
  }
  catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deletePatientById = async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    if (!deletedPatient) return res.status(404).json({ message: 'Patient not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchPatients = async (req, res) => {
  const { name } = req.query;
  try {
    const patients = await Patient.find({ name: new RegExp(name, 'i') });
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Export all functions
module.exports = {
  getAllPatients,
  getMyPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatientById,
  searchPatients
};