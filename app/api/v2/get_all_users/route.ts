import { verifyToken } from "@/lib/api/utils";
import dbConnect from "@/lib/dbconnection";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/api/models/user";
import { TOP_ACCESS_USER_ROLES } from "@/lib/utils";

export async function GET(request: NextRequest) {
    try {
        // Connect to the database
        await dbConnect();

        // Verify token and get user data from the token
        const { user, error } = await verifyToken(request);

        if (error) {
            return NextResponse.json({ error }, { status: 401 });
        }

        // Ensure only admins can fetch all users
        if (!user || !TOP_ACCESS_USER_ROLES.includes(user.role)) {
            return NextResponse.json(
                { error: "Access denied. Admins only." },
                { status: 403 }
            );
        }

        // Fetch all users
        let users = await User.find({}, "id userId role");
        //filetr out the superadmin
        users = users.filter((user) => user.role !== "superadmin");

        return NextResponse.json(users, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || error },
            { status: 500 }
        );
    }
}
