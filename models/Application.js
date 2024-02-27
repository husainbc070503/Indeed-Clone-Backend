import mongoose, { mongo } from "mongoose";

const ApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job'
    },

    skills: [{
        type: String,
        required: true
    }],

    experience: {
        type: Number,
        required: true
    },

    coverLetter: {
        type: String,
        required: true,
    },

    resume: {
        type: String,
        required: true
    }

});

const Application = mongoose.model('application', ApplicationSchema);
export default Application;