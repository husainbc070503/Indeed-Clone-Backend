import { z } from "zod";

const Register = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .min(1, { message: "Name is required" }),

    email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid Email Address" })
        .min(1, { message: "Email is required" }),

    password: z
        .string({ required_error: "Password is required" })
        .min(8, { message: "Password must be atleast 8 characters long!" })
        .refine((value) => /[a-z]/.test(value), { message: 'Password must contain atleast one lowercase alphabet.' })
        .refine((value) => /[A-Z]/.test(value), { message: 'Password must contain atleast one uppercase alphabet.' })
        .refine((value) => /[0-9]/.test(value), { message: 'Password must contain atleast one digit.' })
        .refine((value) => /[^a-zA-Z0-9]/.test(value), { message: 'Password must contain atleast one special character.' }),

    profilePic: z
        .string({ required_error: "Profile Pic is required" })
        .min(1, { message: "Profile Pic is required" }),

    role: z
        .string({ required_error: "Role is required" })
        .min(1, { message: "Role is required" })
});

const Login = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid Email Address" })
        .min(1, { message: "Name is required" }),

    password: z
        .string({ required_error: "Password is required" })
        .min(1, { message: "Password is required" })
});

const SendOtp = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid Email Address" })
        .min(1, { message: "Email is required" }),
});

const PasswordChange = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid Email Address" })
        .min(1, { message: "Email is required" }),

    password: z
        .string({ required_error: "Password is required" })
        .min(8, { message: "Password must be atleast 8 characters long!" })
        .refine((value) => /[a-z]/.test(value), { message: 'Password must contain atleast one lowercase alphabet.' })
        .refine((value) => /[A-Z]/.test(value), { message: 'Password must contain atleast one uppercase alphabet.' })
        .refine((value) => /[0-9]/.test(value), { message: 'Password must contain atleast one digit.' })
        .refine((value) => /[^a-zA-Z0-9]/.test(value), { message: 'Password must contain atleast one special character.' }),

    otp: z
        .string({ required_error: "OTP is required" })
        .min(1, { message: "OTP should not be empty" })
})

export { Register, Login, SendOtp, PasswordChange }; 