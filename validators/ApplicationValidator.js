import { z } from "zod";

const JobApplication = z.object({
    skills: z
        .array(z.string())
        .min(1, { message: "Skills are required" }),

    experience: z
        .number()
        .min(1, { message: "Experience is required" }),

    coverLetter: z
        .string()
        .min(1, { message: "Cover Letter is required" })
        .trim(),

    resume: z
        .string()
        .min(1, { message: "Resume is required" }),
});

export default JobApplication;