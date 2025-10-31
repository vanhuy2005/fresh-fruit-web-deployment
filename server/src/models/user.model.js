import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        age: {
            type: Number,
        },
        address: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        avatar: {
            type: String,
        },
    }, 
    { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export default User;
