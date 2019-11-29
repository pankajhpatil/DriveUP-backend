const mongoose=require('mongoose');

const StudentSchema=new mongoose.Schema({

    Name: {
        type: String,
        required: true
    },
    Minor: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    Country: {
        type: String,
        required: true
    },
    PhoneNumber: {
        type: String,
        required: true
    },
    Gender: {
        type: String,
        required: true
    },
    City: {
        type: String,
        required: true
    },
    DOB: {
        type: String,
        required: true
    }
    
});

const Student=mongoose.model('Student',StudentSchema);

module.exports = Student;