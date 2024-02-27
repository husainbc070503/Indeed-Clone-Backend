import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ['recruiter', 'job seeker'],
        default: 'seeker'
    },

    profilePic: {
        type: String,
        default: 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=',
        required: true
    },

    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job'
    }]

}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password'))
        return next();

    try {
        const salt = await bcryptjs.genSalt(10);
        const secPassword = await bcryptjs.hash(user.password, salt);
        user.password = secPassword;
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.validatePassword = async function (password) {
    try {
        const res = await bcryptjs.compare(password, this.password);
        return res;
    } catch (error) {
        console.log(error.message);
    }
}

UserSchema.methods.generateToken = async function () {
    try {
        return jwt.sign(
            {
                userId: this._id.toString(),
                email: this.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "10d"
            }
        )
    } catch (error) {
        console.log(error);
    }
}

const User = mongoose.model('user', UserSchema);
export default User;