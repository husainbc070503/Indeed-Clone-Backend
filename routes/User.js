import { Router } from "express";
import ValidateInput from "../middlewares/ValidInput.js";
import { Login, PasswordChange, Register, SendOtp } from "../validators/AuthValidator.js";
import User from "../models/User.js";
import AuthenticatedUser from "../middlewares/AuthenticatedUser.js";
import Otp from "../models/Otp.js";
import nodemailer from "nodemailer";
import bcryptjs from 'bcryptjs';
const router = Router();

const sendMail = async (email, message) => {
    const transport = nodemailer.createTransport({
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
        from: process.env.user,
        to: email,
        subject: 'Indeed Clone Mail Service System',
        html: message
    }

    await new Promise((resolve, reject) => {
        transport.sendMail(options, (err, info) => {
            if (err) {
                reject(err);
                console.log(err.message);
            } else {
                console.log('Email sent successfully!');
                resolve(info);
            }
        });
    });
}

router.post('/register', ValidateInput(Register), async (req, res) => {
    try {
        var user = await User.findOne({ email: req.body.email })
        if (user)
            return res.status(400).json({ success: false, message: 'User already exists' });

        user = await User.create(req.body);
        res.status(200).json({ success: true, user });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.post('/login', ValidateInput(Login), async (req, res) => {
    try {
        var user = await User.findOne({ email: req.body.email })
        if (!user || !await user.validatePassword(req.body.password))
            return res.status(400).json({ success: false, message: 'Invalid Credentails' });

        const token = await user.generateToken();
        console.log(token);

        return res.status(200).json({ success: true, user: { token, user } });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/bookmark/:id', AuthenticatedUser, async (req, res) => {
    try {
        var user = await User.findByIdAndUpdate(req.user._id, { $push: { bookmarks: req.params.id } }, { new: true }).populate('bookmarks');
        user = await User.populate(user, { path: 'bookmarks', populate: 'company' })
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/removeBookmark/:id', AuthenticatedUser, async (req, res) => {
    try {
        var user = await User.findByIdAndUpdate(req.user._id, { $pull: { bookmarks: req.params.id } }, { new: true }).populate('bookmarks');
        user = await User.populate(user, { path: 'bookmarks', populate: 'company' });
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get('/bookmarks', AuthenticatedUser, async (req, res) => {
    try {
        var data = await User.findById(req.user._id).populate('bookmarks');
        data = await User.populate(data, { path: 'bookmarks', populate: 'company' });
        res.status(200).json({ success: true, bookmarks: data.bookmarks });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/updateProfile', AuthenticatedUser, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, { ...req.body }, { new: true }).populate('bookmarks');
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.post('/sendOtp', ValidateInput(SendOtp), async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ success: false, message: 'Unfetched user. Please register' });

        const otp = await Otp.create({
            email,
            otp: Math.floor(Math.random() * 9000) + 1000,
            expiresIn: new Date().getTime() * 5 * 60 * 1000
        });

        sendMail(email, `<h4>Your OTP for updation of your password is ${otp.otp}. It is valid for only 5 mins. Please do not share it with anyone. <br /> Thank You!</h4>`);

        res.status(200).json({ success: true, otp });

    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
});

router.put('/updatePassword', ValidateInput(PasswordChange), async (req, res) => {
    try {
        const { otp, email, password } = req.body;
        const validOtp = await Otp.findOne({ otp, email });

        if (validOtp) {
            const timeDiff = validOtp.expiresIn - new Date().getTime();
            if (timeDiff < 0)
                return res.status(400).json({ success: false, message: "OTP expired" });

            const salt = await bcryptjs.genSalt(10);
            const secPassword = await bcryptjs.hash(password, salt);

            const user = await User.findOneAndUpdate({ email }, { password: secPassword }, { new: true });

            sendMail(email, "<h4>Your password for the Indeed Clone has been updated. Please login and verify. <br> If it wasn't you then please contact us immediately. Thank you</h4>");

            res.status(200).json({ success: true, user });

        } else {
            return res.status(400).json({ success: false, message: "Invalid OTP" })
        }

    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
})

export default router;