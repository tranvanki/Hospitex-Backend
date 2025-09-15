// API/controllers/staffController.js
const Staffs = require('../models/Staffs');
const Staff = require('../models/Staffs');
//Read
const getAllStaff = async (req, res) => {
  try {
    const filter = {};//mpty object to build MongoDB query 
    //dynamic filtering
    if (req.query.role) {
      filter.role = req.query.role; // e.g., 'doctor' or 'admin'
    }
  
    const staff = await Staff.find(filter);
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//Create new staff(admin rights)
const createStaff = async (req, res) => {
  const newStaff = new Staff(req.body);
  try {
    const savedStaff = await newStaff.save();
    res.status(201).json(savedStaff);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//Update
const updateStaff = async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStaff) return res.status(404).json({ message: 'Staff not found' });
    res.json(updatedStaff);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//Delete
const deleteStaffById = async (req, res) => {
  try {
    const staffId = req.params.id; // ✅ Staff ID from URL parameter
    console.log('=== DELETE STAFF ===');
    console.log('Staff ID to delete:', staffId);
    console.log('Requesting user:', req.user);
    
    // ✅ Only admin can delete staff
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Only admins can delete staff' });
    }
    
    // ✅ Prevent admin from deleting themselves
    if (req.user._id.toString() === staffId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    // ✅ Check if staff exists (use consistent model name)
    const staff = await Staff.findById(staffId); // Use Staff, not Staffs
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    
    // ✅ Check if staff has assigned patients (IMPORTANT!)
    const Patient = require('../models/Patient');
    const assignedPatients = await Patient.find({ staff_id: staffId });
    
    if (assignedPatients.length > 0) {
      return res.status(400).json({ 
        message: `Cannot delete staff. They have ${assignedPatients.length} assigned patient(s). Please reassign patients first.`,
        patientCount: assignedPatients.length,
        patients: assignedPatients.map(p => ({ 
          _id: p._id, 
          patient_name: p.patient_name,
          patient_id: p.patient_id 
        }))
      });
    }
    
    // ✅ Delete the staff
    const deletedStaff = await Staff.findByIdAndDelete(staffId);
    if (!deletedStaff) {
      return res.status(404).json({ message: 'Staff not found during deletion' });
    }
    
    console.log('Staff deleted successfully:', deletedStaff.staff_name);
    
    // ✅ Return useful response with deleted staff info
    res.json({ 
      message: `Staff ${deletedStaff.staff_name} deleted successfully`,
      deletedStaff: {
        _id: deletedStaff._id,
        staff_name: deletedStaff.staff_name,
        staff_id: deletedStaff.staff_id,
        role: deletedStaff.role,
        email: deletedStaff.email
      }
    });
    
  } catch (err) {
    console.error('Delete staff error:', err);
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaffById,};