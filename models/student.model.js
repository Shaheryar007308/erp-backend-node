const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Student name is required'] 
    },
    rollNo: { 
        type: String, 
        required: [true, 'Roll number is required'], 
        unique: true // Prevents duplicate student entries
    },
    session: { 
        type: String, 
        required: [true, 'Session is required'] // e.g., "2023-2027"
    },
    currentSemester: { 
        type: Number, 
        required: [true, 'Current semester is required'] // e.g., 4
    },
    cnic: { 
        type: String, 
        required: [true, 'CNIC is required'], 
        unique: true 
    },
    department: { 
        type: String, 
        enum: ['CS', 'IT', 'SE'], // Strict restriction to your 3 ERP departments
        required: [true, 'Department is required'] 
    },
    photoUrl: { 
        type: String, 
        required: [true, 'Student profile photo path is required'] 
    }
}, { 
    timestamps: true // Automatically generates createdAt and updatedAt tracking
});

module.exports = mongoose.model('Student', studentSchema);
