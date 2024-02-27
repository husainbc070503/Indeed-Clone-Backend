import { z } from "zod";

const AddCompany = z.object({
    name: z
        .string()
        .min(1, { message: "Name is required" }),

    description: z
        .string()
        .min(1, { message: "Description is required" })
        .trim(),

    type: z
        .string()
        .min(1, { message: "Type is required" }),

    strength: z
        .number()
        .min(1, { message: "Strength is required" }),

    address: z
        .string()
        .min(1, { message: "Address is required" })
        .trim(),
});

export default AddCompany;