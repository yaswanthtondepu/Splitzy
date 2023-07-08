import User from "@/lib/api/models/user";
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
            console.log(user);
            const userresponse = await axios.get(
                "https://secure.splitwise.com/api/v3.0/get_current_user",
                {
                    headers: { Authorization: user.accessToken },
                }
            );
            const person = userresponse.data?.user;
            if (person) {
                return NextResponse.json(person, { status: 200 });
            } else {
                return NextResponse.json(
                    {
                        error: "Invalid Token",
                    },
                    { status: 401 }
                );
            }
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                error: error,
            },
            { status: 500 }
        );
    }
}
