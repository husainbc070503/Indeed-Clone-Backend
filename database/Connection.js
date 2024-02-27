import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const url = process.env.MONGODB_URL;

const connectToMongodb = async () => {
    mongoose.set('strictQuery', false);
    try {
        await mongoose.connect(url, () => console.log('Connected to MongoDB Database Successfully!!'));
    } catch (error) {
        console.log(error.message);
    }
}

export default connectToMongodb;