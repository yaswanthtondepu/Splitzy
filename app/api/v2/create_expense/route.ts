import { verifyToken } from "@/lib/api/utils";
import dbConnect from "@/lib/dbconnection";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const { user, error } = await verifyToken(request);

        if (error) {
            return NextResponse.json({ error }, { status: 401 });
        } else {
            const token = user.accessToken;
            const body = await request.json();

            if (!body.expense) {
                return NextResponse.json(
                    { error: "expense is required" },
                    { status: 400 }
                );
            }

            let result = await axios.get(
                "https://secure.splitwise.com/api/v3.0/create_expense",
                {
                    headers: { Authorization: token },
                    params: body.expense,
                }
            );

            if (Object.keys(result.data?.errors).length) {
                return NextResponse.json(
                    { error: result.data.errors.base },
                    { status: 400 }
                );
            }
            return NextResponse.json(result.data, { status: 200 });
        }
    } catch (error) {

        return NextResponse.json(
            {
                error: error,
            },
            { status: 500 }
        );
    }
}
