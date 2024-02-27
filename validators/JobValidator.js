import { z } from "zod";

const PostJob = z.object({
    title: z
        .string()
        .min(1, { message: "Title is required" }),

    description: z
        .string()
        .min(1, { message: "Description is required" })
        .trim(),

    salary: z
        .number()
        .min(1, { message: "Salary is required" }),

    joiningDate: z
        .string(),

    jobPosted: z
        .string(),

    experience: z
        .number()
        .min(1, { message: "Experience is required" }),

    skillsRequired: z
        .array(z.string())
        .min(1, { message: 'Skills is required' }),

    jobTypes: z
        .array(z.string())
        .min(1, { message: 'Job Types are required' }),

    educationEligibility: z
        .string()
        .min(1, { message: "Education Eligibility is required" })
        .trim(),

    responsibilities: z
        .string()
        .min(1, { message: 'Responsibilities are required' })
        .trim(),

    company: z
        .string()
        .min(1, { message: 'Company is required' })
});

export default PostJob;