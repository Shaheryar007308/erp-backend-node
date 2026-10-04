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

    if (!user) {
    return res.status(401).json({
        message: 'Unauthorized: Please log in first'
    });
}

    // Rule A: If they are the global ERP Admin, they can bypass this check entirely
    if (user.role === 'ERP_ADMIN') {
        return next();
    }

    // Rule B: If they are a Department Admin, they have strict restrictions
    if (user.role === 'DEPT_ADMIN') {
        // We will look at where the department value is coming from (either the URL params or the POST/PUT request body)
        const targetDepartment = req.body.department || req.params.department;

        if (!targetDepartment) {
            return res.status(400).json({ error: "Department context missing from request parameter or body payload." });
        }

        // Compare the admin's assigned department against the student's department target
        if (user.department.toUpperCase() === targetDepartment.toUpperCase()) {
            return next(); // Match! A CS Admin is modifying a CS student. Let them pass.
        } else {
            // Block them if a CS Admin tries to touch an IT or SE student record
            return res.status(403).json({ 
                error: `Access forbidden. You are the ${user.department} admin and cannot manipulate data in the ${targetDepartment} department.` 
            });
        }
    }

    return res.status(403).json({ error: "Access forbidden. Invalid user role context." });
};