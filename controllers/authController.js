const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const passport = require('passport');

// register user
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;


            // Basic required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: 'Name, email, password and role are required'
            });
        }

    if (role === 'DEPT_ADMIN' && (!department || department === 'NONE')) {
      return res.status(400).json({ message: 'Department is required for DEPT_ADMIN role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
      department: role === 'ERP_ADMIN' ? 'NONE' : department
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error occurred while registering user' });
  }
};

// login request and session creation 

exports.loginAdmin = async(req , res , next) =>{

    passport.authenticate('local' , (err , user , info) =>{

         if (err) return res.status(500).json({ error: err.message });

        if (!user) return res.status(400).json({ error: info.message });

        // log user into session

        req.logIn(user , (err)=>{
            if(err) return res.status(500).json({ error: err.message });

            return res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    department: user.department
                }
            })
        })

    })(req , res , next);
}

//logout request and session destruction

// 3. Clear Session and Log Out (FIXED CALLBACK)
exports.logoutAdmin = (req, res) => {
    // Check if the user is even logged in first
    if (!req.isAuthenticated()) {
        return res.status(400).json({ error: "No active session found to log out from." });
    }

    // Call req.logout with a simple error handling callback function
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: "Logout failed: " + err.message });
        }
        
        // Destroys the express session token completely out of memory
        req.session.destroy((sessionErr) => {
            if (sessionErr) {
                return res.status(500).json({ error: "Failed to destroy login session." });
            }
            res.clearCookie('connect.sid'); // Clears the browser/postman cookie completely
            return res.status(200).json({ message: "Successfully logged out of active server session." });
        });
    });
};
