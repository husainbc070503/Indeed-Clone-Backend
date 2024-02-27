import { Router } from "express";
import AuthenticatedUser from "../middlewares/AuthenticatedUser.js";
import Job from "../models/Job.js";
import PostJob from "../validators/JobValidator.js";
import ValidateInput from "../middlewares/ValidInput.js";
const router = Router();

router.post('/postJob', AuthenticatedUser, ValidateInput(PostJob), async (req, res) => {
    try {
        var job = await Job.create({ ...req.body, user: req.user._id });
        job = await Job.findById(job._id).populate('user').populate('company');
        res.status(200).json({ success: true, job });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/editJobPost/:id', AuthenticatedUser, async (req, res) => {
    try {
        var job = await Job.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
            .populate('user', '-password')
            .populate('company');

        job = await Job.populate(job, {
            path: 'applications',
            select: '-password'
        });

        res.status(200).json({ success: true, job });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.delete('/deleteJobPost/:id', AuthenticatedUser, async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get('/jobs', AuthenticatedUser, async (req, res) => {
    try {
        var jobs = await Job.find()
            .populate('user', '-password')
            .populate('company')

        jobs = await Job.populate(jobs, {
            path: 'applications',
            select: '-password'
        });

        res.status(200).json({ success: true, jobs });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

export default router;