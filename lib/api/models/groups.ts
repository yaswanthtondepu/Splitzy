import { IGroup } from "@/interfaces/interfaces";
import mongoose from "mongoose";

// Define the user schema
const groupsSchema = new mongoose.Schema<IGroup>({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    groups: [],
});

// Create the user model
const Group = mongoose.model("Group", groupsSchema);

// Export the model
export default Group;
