const User = require('../models/users.model.js');
const bcrypt = require('bcrypt');

// 1. ERP_ADMIN creates a new Department Admin account
exports.createDeptAdmin = async (req, res) => {
    try {
        const { name, email, password, department } = req.body;

        if (!name || !email || !password || !department || department === 'NONE') {
            return res.status(400).json({ error: "Please provide name, email, password, and a specific department (CS, IT, SE)." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "An account with this email address already exists." });
        }

        const newDeptAdmin = new User({
            name,
            email,
            password,
            role: 'DEPT_ADMIN',
            department: department.toUpperCase()
        });

        const salt = await bcrypt.genSalt(10);
        newDeptAdmin.password = await bcrypt.hash(newDeptAdmin.password, salt);

        await newDeptAdmin.save();
        return res.status(201).json({ 
            message: `Department Admin for ${department} created successfully!`,
            admin: { id: newDeptAdmin._id, name: newDeptAdmin.name, email: newDeptAdmin.email, department: newDeptAdmin.department }
        });
    } catch (err) {
        return res.status(500).json({ error: "Failed to create department admin: " + err.message });
    }
};

// 2. ERP_ADMIN views all active Department Admins
exports.getAllDeptAdmins = async (req, res) => {
    try {
        // Fetch users who are DEPT_ADMINs, excluding their passwords from selection
        const admins = await User.find({ role: 'DEPT_ADMIN' }).select('-password');
        return res.status(200).json(admins);
    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch admins: " + err.message });
    }
};

// 3. ERP_ADMIN deletes a Department Admin (Appoints/Removes them)
exports.deleteDeptAdmin = async (req, res) => {
    try {
        const admin = await User.findById(req.params.id);
        if (!admin || admin.role !== 'DEPT_ADMIN') {
            return res.status(404).json({ error: "Department Admin account not found." });
        }

        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: `Admin ${admin.name} removed from managing ${admin.department} department.` });
    } catch (err) {
        return res.status(500).json({ error: "Failed to remove admin: " + err.message });
    }
};
