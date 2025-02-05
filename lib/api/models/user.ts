import { IUser } from "@/interfaces/interfaces";
import { THIRD_LEVEL_ACCESS_USER_ROLES } from "@/lib/utils";
import mongoose from "mongoose";

// Define the User schema
const userSchema = new mongoose.Schema<IUser>(
    {
        userId: {
            type: String,
            required: true,
            unique: true, // note lowercase 'unique'
        },
        accessToken: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: [...THIRD_LEVEL_ACCESS_USER_ROLES], // allowed values
            default: "user", // default role
        },
    },
    { timestamps: true }
);

// Create the User model
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
