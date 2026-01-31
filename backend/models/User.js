import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true, maxLength: 10 },
    password: { 
        type: String, 
        required: true,
        validator: function(v){
            return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(v);
        },
        message: props => `Password is not valid! Must contain letters, numbers, and a special char.`
    },
    picture: { type: String },
    role: { 
        type: String, 
        enum: ['Admin', 'Mechanic'], 
        default: 'Mechanic',
        required: true 
    },
    level: { 
        type: String, 
        enum: ['Expert', 'Medium', 'New Recruit', 'Trainee'],
        required: function() { return this.role === 'Mechanic'; } 
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;