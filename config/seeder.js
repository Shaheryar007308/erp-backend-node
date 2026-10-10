const User = require('../models/users.model.js');
const bcrypt = require('bcrypt');

const seedMasterAdmin = async () => {
    try {
        // Check if ANY ERP_ADMIN already exists in the database
        const adminExists = await User.findOne({ role: 'ERP_ADMIN' });
        
        if (!adminExists) {
            console.log('🌱 No ERP_ADMIN found.');
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('masterPassword123', salt); // Default password

            const masterAdmin = new User({
                name: 'System Master Admin',
                email: 'masteradmin@erp.com',
                password: hashedPassword,
                role: 'ERP_ADMIN',
                department: 'NONE'
            });

            await masterAdmin.save();
            console.log('✅ Master Admin seeded successfully! ');
        } else {
            console.log('🛡️ Master Admin record already exists. Seeder skipped.');
        }
    } catch (err) {
        console.error('❌ Error seeding master admin:', err.message);
    }
};

module.exports = seedMasterAdmin;
