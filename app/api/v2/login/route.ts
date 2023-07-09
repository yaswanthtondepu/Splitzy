import { generateJwtToken, verifyToken } from "@/lib/api/utils";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/api/models/user";
import dbConnect from "@/lib/dbconnection";

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        await dbConnect();
        const body = await request.json();
        console.log("authorization "+body.authorizationCode);
        
        const tokenresponse = await axios.post(
            "https://secure.splitwise.com/oauth/token",
            {
                client_id: process.env.SPLITWISE_CONSUMER_KEY,
                client_secret: process.env.SPLITWISE_CONSUMER_SECRET,
                redirect_uri: process.env.SPLITWISE_REDIRECT_URI,
                grant_type: "authorization_code",
                code: body.authorizationCode,
            }
        );

        console.log(tokenresponse.data);
        

        const splitwisebearer = "Bearer " + tokenresponse.data?.access_token;
        const userresponse = await axios.get(
            "https://secure.splitwise.com/api/v3.0/get_current_user",
            {
                headers: { Authorization: splitwisebearer },
            }
        );

        const user = userresponse.data?.user;
        if (user) {
            await User.findOneAndUpdate(
                { userId: user.id }, // Search condition
                { $set: { accessToken: splitwisebearer } }, // Update fields
                { upsert: true, new: true } // Options: upsert - create if not found, new - return the updated document
            );
            return NextResponse.json({ token: generateJwtToken(user) });
        } else {
            throw new Error("unauthorized: access token is invalid");
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
