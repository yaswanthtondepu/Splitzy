import { IUser } from "@/interfaces/interfaces";
import mongoose from "mongoose";

// Define the User schema
const userSchema = new mongoose.Schema<IUser>(
    {
        userId: {
            type: String,
            required: true,
            Unique: true,
        },
        accessToken: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// Create the User model
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
