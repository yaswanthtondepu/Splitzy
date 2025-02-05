import { verifyToken } from "@/lib/api/utils";
import dbConnect from "@/lib/dbconnection";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Connect to the database
        await dbConnect();

        // Verify token and get user data from the token
        const { user, error } = await verifyToken(request);

        if (error) {
            return NextResponse.json({ error }, { status: 401 });
        }

        if (user) {
            return NextResponse.json({ role: user.role }, { status: 200 });
        }
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || error },
            { status: 500 }
        );
    }
}
