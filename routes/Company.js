import { Router } from "express";
import AuthenticatedUser from "../middlewares/AuthenticatedUser.js";
import ValidateInput from "../middlewares/ValidInput.js";
import AddCompany from "../validators/CompanyValidator.js";
import Company from "../models/Company.js";
const router = Router();

router.post('/addCompany', AuthenticatedUser, ValidateInput(AddCompany), async (req, res) => {
    try {
        var company = await Company.create({ ...req.body, user: req.user._id })
        company = await Company.findById(company._id).populate('user');
        res.status(200).json({ success: true, company });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/editCompany/:id', AuthenticatedUser, async (req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true }).populate('user');
        res.status(200).json({ success: true, company });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.delete('/deleteCompany/:id', AuthenticatedUser, async (req, res) => {
    try {
        await Company.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get('/companies', AuthenticatedUser, async (req, res) => {
    try {
        const companies = await Company.find().populate('user');
        res.status(200).json({ success: true, companies });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

export default router;