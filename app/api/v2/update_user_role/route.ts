import { verifyToken } from "@/lib/api/utils";
import dbConnect from "@/lib/dbconnection";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/api/models/user";
import { TOP_ACCESS_USER_ROLES } from "@/lib/utils";

export async function PUT(request: NextRequest) {
    try {
        // Connect to the database
        await dbConnect();

        // Verify token and get user data from the token
        const { user, error } = await verifyToken(request);
        if (error) {
            return NextResponse.json({ error }, { status: 401 });
        }

        // Ensure only users with top-level access can update user roles
        if (!user || !TOP_ACCESS_USER_ROLES.includes(user.role)) {
            return NextResponse.json(
                { error: "Access denied. Admins only." },
                { status: 403 }
            );
        }

        // Parse the request body for _id and new role
        const { _id, role } = await request.json();

        // Attempt to update the user role
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { role },
            { new: true, select: "id userId role" }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || error },
            { status: 500 }
        );
    }
}
