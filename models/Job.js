import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    salary: {
        type: Number,
        required: true
    },

    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },

    joiningDate: {
        type: Date,
        default: Date.now()
    },

    experience: {
        type: Number,
        required: true
    },

    skillsRequired: [{
        type: String,
        required: true
    }],

    jobTypes: [{
        type: String,
        required: true
    }],

    jobPosted: {
        type: Date,
        default: Date.now()
    },

    educationEligibility: {
        type: String,
        required: true
    },

    responsibilities: {
        type: String,
        required: true
    }

}, { timestamps: true });

const Job = mongoose.model('job', JobSchema);
export default Job;