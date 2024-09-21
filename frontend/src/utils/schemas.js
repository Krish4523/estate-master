import { z } from "zod";

export const SignUpSchema = z
  .object({
    name: z.string().min(3, {
      message: "Name must be at least 3 characters.",
    }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .max(20, {
        message: "Password must be max 20 characters long.",
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,20}$/,
        "Password must include one small letter, one uppercase letter and one number"
      ),
    confPassword: z.string(),
    phone: z
      .string()
      .length(10, { message: "Phone number must be of 10 digits." }),
    role: z.enum["customer", "agent"]
  })
  .refine((data) => data.password === data.confPassword, {
    path: ["confPassword"], // targeting the confPassword field for error message
    message: "Passwords don't match",
  });

export const LoginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, { message: "This field is required." })
    .refine(
      (value) => {
        const isEmail = z.string().email().safeParse(value).success;
        const isPhoneNumber = /^[0-9]{10}$/.test(value);
        return isEmail || isPhoneNumber;
      },
      {
        message: "Must be a valid email or a 10-digit phone number.",
      }
    ),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const PropertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  property_type: z.enum(["residential", "commercial", "industrial"]),
  price: z.coerce.number().positive("Price must be positive"),
  local_address: z.string().min(1, "Local address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.coerce
    .number()
    .min(100000, "Invalid PIN code")
    .max(999999, "Invalid PIN code"),
  sqft: z.coerce.number().positive("Area must be a positive number"),
  bedrooms: z.coerce.number().positive("Bedrooms must be a positive number"),
  parking: z.coerce.number().min(0, "Parking spaces cannot be negative"),
  images: z.array(z.instanceof(File))
    .min(1, "Please upload at least 1 image")
    .max(5, "Please upload at least 4 images"),
  agent: z.coerce.number().positive("Please select an agent"),
  document_name: z.string().optional(),
  nearby_places: z
    .array(
      z.object({
        name: z.string().min(1, "Place name is required"),
        distance: z.coerce.number().positive("Distance must be positive"),
        place_type: z.string().min(1, "Place type is required"),
      })
    )
    .min(1, "Please add at least one nearby place")
    .max(3, "Please add upto 3 nearby places"),
});

export const editProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  avatar: z.instanceof(File).optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password cannot be the same as the current password",
    path: ["newPassword"], // This will point the error to newPassword field
  });