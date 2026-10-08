const student= require('../models/student.model');

// Create a new student

exports.createStudent = async (req , res) =>{

try{
    const { name, rollNo, session, currentSemester, cnic, department, photoUrl } = req.body;

    const existingStudent = await student.findOne({ rollNo });
    if(existingStudent){
        return res.status(400).json({ message: `Student already exists with this ${rollNo} roll number` });
    }
 const newStudent = new student({
     name,
     rollNo,
     session,
     currentSemester,
     cnic,
     department,
     photoUrl
 });
 
 await newStudent.save();
 res.status(201).json({ message: 'Student created successfully', student: newStudent });
    
} catch(err){
    res.status(500).json({ message: 'Error creating student', error: err });

}
}


// Get all students

exports.getAllStudents = async (req , res) =>{
    try{
        let std;
        if(req.user.role === 'DEPT_ADMIN'){
            std = await student.find({ department: req.user.department });
        } else{
            std = await student.find();
        }
        res.status(200).json({ message: 'Students retrieved successfully', students: std });
    }catch(err){
        res.status(500).json({ message: 'Error retrieving students', error: err });
    }
}


// Get a single student
exports.getStudent = async (req , res) =>{
    try{
        const std = await student.findById(req.params.id);
                if(!student){
            return res.status(404).json({ message: 'Student not found' });
        }

        if(req.user.role === 'DEPT_ADMIN'){
            if(std.department !== req.user.department){
                return res.status(403).json({ message: 'Access forbidden. You do not have permission to access this student' });
            }
        } else if(req.user.role === 'ERP_ADMIN'){
            // ERP Admin can access any student, no additional checks needed
        }

        res.status(200).json({ message: 'Student retrieved successfully', student: std });
    }catch(err){
        res.status(500).json({ message: 'Error retrieving student', error: err });
    }
}

//Update a student

exports.updateStudent =async (req , res)=>{
    try{
        const {id} = req.params;
        const std = await student.findById(id);
        if(!std){
            return res.status(404).json({ message: 'Student not found' });
        } 
         if (req.user.role === 'DEPT_ADMIN' && req.body.department && req.body.department !== req.user.department) {
            return res.status(403).json({ error: "You cannot transfer a student out of your assigned department." });
         }

         const newStudent = await student.findByIdAndUpdate(id , req.body , {new : true , runValidators: true});
         res.status(200).json({ message: 'Student updated successfully', student: newStudent });
    }catch(err){
        res.status(500).json({ message: 'Error updating student', error: err });
    }
} 

// Delete a student

exports.deleteStudent = async (req , res) =>{
   try{
     const {id} = req.params;
     const student = await student.findById(id);
     if(!student){
        return res.status(404).json({ message: 'Student not found' });
     } 
     if (req.user.role === 'DEPT_ADMIN' && student.department !== req.user.department) {
        return res.status(403).json({ error: "You cannot delete a student from another department." });
     }
     await student.findByIdAndDelete(id);
     res.status(200).json({ message: 'Student deleted successfully' });
   }catch(err){
       res.status(500).json({ message: 'Error deleting student', error: err });
   }
    
}