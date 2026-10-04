const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name :{
            type: String,
            required: true
        } , 
        email:{
            type: String , 
            required: true , 
            unique: true
        } , 
        password: { 
        type: String, 
        required: true 
    }, 

    role:{
        type: String , 
        enum:['ERP_ADMIN' , 'DEPT_ADMIN'] , 
        required: true
    } , 

    departement :{
        type: String ,
        enum:['CS', 'IT', 'SE', 'NONE'] ,
        required: true
    } 
    } , 

    {
        timestamps: true
    }
    
);

module.exports = mongoose.model('User' , userSchema);