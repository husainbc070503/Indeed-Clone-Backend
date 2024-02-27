import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["software development", "product based", "service based"],
        default: "software development"
    },

    strength: {
        type: Number,
        required: true,
    },

    address: {
        type: String,
        required: true
    }

}, { timestamps: true });

const Company = mongoose.model('company', CompanySchema);
export default Company;