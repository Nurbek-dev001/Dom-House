import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        index: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6
    },
    phone: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'agent'],
        default: 'user',
        index: true
    },
    profileImage: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: ''
    },
    // Reset token for password recovery
    resetToken: { 
        type: String 
    },
    resetTokenExpire: { 
        type: Date 
    },
    // Account status
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    // Properties owned by user
    properties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    }],
    // Appointment history
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    // Statistics
    totalAppointments: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    lastLogin: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Compound indexes
UserSchema.index({ email: 1, role: 1 });
UserSchema.index({ createdAt: -1, isActive: 1 });

const User = mongoose.model('User', UserSchema);

export default User;