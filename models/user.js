const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email!"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password!"]
    },
    idStudent: {
        type: String,
        default: 'Admin'
    },
    classUser: {
        type: String,
        default: 'Admin'
    },
    birthday: {
        type: String,
        default: 'Admin'
    },
    gender: {
        type: String,
        default: 'Other'
    },
    address: {
        type: String,
        default: 'Admin'
    },
    role: {
        type: Number,
        default: 0 // 0 = user, 1 = admin
    },
    status: {
        type: Boolean,
        default: true 
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Users", userSchema)