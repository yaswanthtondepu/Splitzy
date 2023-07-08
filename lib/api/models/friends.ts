import { IFriend } from "@/interfaces/interfaces";
import mongoose from "mongoose";

// Define the user schema
const friendsSchema = new mongoose.Schema<IFriend>({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    friends: [],
});

// Create the user model
const Friend =
    mongoose.models.Friend || mongoose.model("Friend", friendsSchema);

// Export the model
export default Friend;
