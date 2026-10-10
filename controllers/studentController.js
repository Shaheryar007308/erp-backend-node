// TOP OF FILE: Capitalize "Student" so it matches your code execution hooks below perfectly
const Student = require('../models/student.model');

// 1. CREATE a new Student
exports.createStudent = async (req, res) => {
    try {
        const { name, rollNo, session, currentSemester, cnic, department } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "Please upload a student profile picture image file." });
        }

        // Successfully matches capital "Student" reference now
        const existingStudent = await Student.findOne({ rollNo });
        if (existingStudent) {
            return res.status(400).json({ error: `A student with Roll No ${rollNo} already exists.` });
        }

        const newStudent = new Student({
            name,
            rollNo,
            session,
            currentSemester,
            cnic,
            department,
            photoUrl: req.file.path 
        });

        await newStudent.save();
        return res.status(201).json({ message: "Student record created successfully!", student: newStudent });
    } catch (err) {
        return res.status(500).json({ error: "Failed to create student: " + err.message });
    }
};

// 2. Get all students
exports.getAllStudents = async (req, res) => {
    try {
        let std;
        if (req.user.role === 'DEPT_ADMIN') {
            std = await Student.find({ department: req.user.department });
        } else {
            std = await Student.find();
        }
        return res.status(200).json({ message: 'Students retrieved successfully', students: std });
    } catch (err) {
        return res.status(500).json({ message: 'Error retrieving students', error: err.message });
    }
};

// 3. Get a single student
exports.getStudent = async (req, res) => {
    try {
        const std = await Student.findById(req.params.id);
        if (!std) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (req.user.role === 'DEPT_ADMIN') {
            if (std.department !== req.user.department) {
                return res.status(403).json({ message: 'Access forbidden. You do not have permission to access this student' });
            }
        }

        return res.status(200).json({ message: 'Student retrieved successfully', student: std });
    } catch (err) {
        return res.status(500).json({ message: 'Error retrieving student', error: err.message });
    }
};

// 4. Update a student
exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const std = await Student.findById(id);
        if (!std) {
            return res.status(404).json({ message: 'Student not found' });
        }
        if (req.user.role === 'DEPT_ADMIN' && req.body.department && req.body.department !== req.user.department) {
            return res.status(403).json({ error: "You cannot transfer a student out of your assigned department." });
        }

        const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        return res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
    } catch (err) {
        return res.status(500).json({ message: 'Error updating student', error: err.message });
    }
};

// 5. Delete a student
exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Changed inner variable name to 'studentRecord' to prevent collision with 'Student' model import
        const studentRecord = await Student.findById(id);
        if (!studentRecord) {
            return res.status(404).json({ message: 'Student not found' });
        }
        if (req.user.role === 'DEPT_ADMIN' && studentRecord.department !== req.user.department) {
            return res.status(403).json({ error: "You cannot delete a student from another department." });
        }
        
        await Student.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Student deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Error deleting student', error: err.message });
    }
};
