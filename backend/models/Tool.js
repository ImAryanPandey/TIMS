import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    total_qty: { type: Number, required: true },
    available_qty: { type: Number, required: true }
}, { timestamps: true });

const Tool = mongoose.model('Tool', toolSchema);
export default Tool;