import { verifyToken } from "@/lib/api/utils";
import dbConnect from "@/lib/dbconnection";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const { user, error } = await verifyToken(request);

        if (error) {
            return NextResponse.json({ error });
        } else {
            const { limit, offset } = await request.json();
            const response = await axios.get(
                `https://secure.splitwise.com/api/v3.0/get_expenses?limit=${limit}&offset=${offset}`,
                {
                    headers: { Authorization: user.accessToken },
                }
            );
            const expenses = response.data?.expenses;

            return NextResponse.json(expenses, { status: 200 });
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
