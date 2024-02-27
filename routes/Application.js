import { Router } from "express";
import AuthenticatedUser from "../middlewares/AuthenticatedUser.js";
import ValidateInput from "../middlewares/ValidInput.js";
import JobApplication from "../validators/ApplicationValidator.js";
import Application from "../models/Application.js";
import nodemailer from "nodemailer";
const router = Router();

const sendMailToApplier = async (email, title) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: true,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD
        },
        tls: { rejectUnauthorized: false }
    });

    const options = {
        from: process.env.USER,
        to: email,
        subject: `Indeed Clone - Application to Job ${title}`,
        html: `<h4>Your application was sent to the HR. Get updated as per your resume and prepare well for interview. <br>All the best 👍💯 <br>Thank You!</h4>`
    }

    await new Promise((resolve, reject) => {
        transporter.sendMail(options, (err, info) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log('Email Sent Successfully.');
                resolve(info);
            }
        });
    });
}

const sendMailToPoster = async (email, title, username) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: true,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD
        },
        tls: { rejectUnauthorized: false }
    });

    const options = {
        from: process.env.USER,
        to: email,
        subject: `Indeed Clone - Application to Job ${title}`,
        html: `<h4>${username} applied to the recent job post titled ${title}. Please login to the site and view the application. <br>Thank You!</h4>`
    }

    await new Promise((resolve, reject) => {
        transporter.sendMail(options, (err, info) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log('Email Sent Successfully.');
                resolve(info);
            }
        });
    });
}

router.post('/applyToJob/:id', ValidateInput(JobApplication), AuthenticatedUser, async (req, res) => {
    try {
        var application = await Application.create({ ...req.body, job: req.params.id, user: req.user._id })
        application = await Application.findById(application._id)
            .populate('user')
            .populate('job');

        application = await Application.populate(application, {
            path: 'job',
            populate: {
                path: 'user',
                select: '-password'
            }
        });

        sendMailToApplier(application.user.email, application.job.title)
        sendMailToPoster(application.job.user.email, application.job.title, application.user.name)

        res.status(200).json({ success: true, application });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get('/applications', AuthenticatedUser, async (req, res) => {
    try {
        var applications = await Application.find()
            .populate('job')
            .populate('user');

        applications = await Application.populate(applications, {
            path: 'job',
            populate: [{
                path: 'user',
                select: '-password'
            }, {
                path: 'company'
            }]
        });

        res.status(200).json({ success: true, applications });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

export default router;