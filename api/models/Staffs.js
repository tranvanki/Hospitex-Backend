const mongoose  =  require("mongoose")



const staffSchema = new mongoose.Schema({
    staff_id: { type: String, required: true },
    staff_name: {type: String, required:true},
    email:{type: String, required:true, unique:true},
        date_of_birth: {type: Date, required:true},
    password: {type: String, required:true},
        

    department: {type: String, required:true},
    specialization: {type: String, required:true},
    shift_time: {type: String, enum:['Morning','Afternoon','Night'], required:true},
    role :{type: String, enum:['doctor','admin'],required:true}
})


module.exports = mongoose.model('Staffs', staffSchema);
