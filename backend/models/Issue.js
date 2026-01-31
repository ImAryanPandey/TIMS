import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
    mechanic: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    tool: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tool', 
        required: true 
    },
    qty_issued: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Issued', 'Returned'], 
        default: 'Issued' 
    },
}, { timestamps: true });

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;