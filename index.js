import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ErrorHandler from "./handlers/ErrorHandlers.js";
import connectToMongodb from "./database/Connection.js";
import AuthRoute from "./routes/User.js";
import CompanyRoute from "./routes/Company.js";
import JobRoute from "./routes/Job.js";
import ApplicationRoute from "./routes/Application.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
connectToMongodb();

app.get('/', (req, res) => res.send('Hello World'));
app.use('/api/user', AuthRoute);
app.use('/api/company', CompanyRoute);
app.use('/api/job', JobRoute);
app.use('/api/application', ApplicationRoute);

app.use(ErrorHandler);
app.listen(port, () => console.log(`Server connected to port ${port}`));