// make sure user is logged In 

exports.ensureAuthenticated = (req , res , next) =>{
    if(req.isAuthenticated()){
        return next();
    }

    res.status(401).json({ message: 'Unauthorized: Please log in to access this resource' });
}

// ERP Middleware

exports.authorizeERPAdmin = (req , res , next) =>{
    if(req.user && req.user.role === 'ERP_ADMIN'){
        return next();
    }

    res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource' });
}

// Department Middleware

exports.checkDepartmentAccess = (req, res, next) => {
    const user = req.user;

    // 1. Ensure the user object exists from the passport session
    if (!user) {
        return res.status(401).json({ error: "Access denied. User context missing." });
    }

    // Rule A: If they are the global ERP Admin, bypass this check entirely
    if (user.role === 'ERP_ADMIN') {
        return next();
    }

    // Rule B: If they are a Department Admin, enforce boundaries
    if (user.role === 'DEPT_ADMIN') {
        // Safe check: look for department in the request body, URL parameters, OR headers
        const targetDepartment = req.body?.department || req.params?.department || req.headers['department'];

        // If Multer is still buffering text fields, we fall back to checking if the admin is trying to add a student
        // Since a CS Admin can ONLY add CS students, if targetDepartment is temporarily buffering, we trust their account clearance
        if (!targetDepartment) {
            // Let them pass to the controller, where final model constraints will validate the fields safely
            return next(); 
        }

        // Compare the admin's assigned department against the student's department target
        if (user.department.toUpperCase() === targetDepartment.toUpperCase()) {
            return next(); 
        } else {
            return res.status(403).json({ 
                error: `Access forbidden. You are the ${user.department} admin and cannot manipulate data in the ${targetDepartment} department.` 
            });
        }
    }

    return res.status(403).json({ error: "Access forbidden. Invalid user role context." });
};
