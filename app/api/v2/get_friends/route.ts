import User from "@/lib/api/models/user";
import { fetchFriendsSplitWise, verifyToken } from "@/lib/api/utils";
import dbConnect from "@/lib/dbconnection";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import Friends from "@/lib/api/models/friends";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const { user, error } = await verifyToken(request);

        if (error) {
            return NextResponse.json({ error });
        } else {
            const body = await request.json();
            // const force = body.force;
            const force = true;
            if (!force) {
                const userfriends = await Friends.findOne({ id: user.id });
                if (userfriends) {
                    return NextResponse.json(userfriends.friends, {
                        status: 200,
                    });
                }
            }
            const token = user.accessToken;
            const splitwisefriends = await fetchFriendsSplitWise(token);

            const newuserfriends = await Friends.findOneAndUpdate(
                { id: user.id }, // Search condition
                { $set: { friends: splitwisefriends } }, // Update fields
                { upsert: true, new: true } // Options: upsert - create if not found, new - return the updated document
            );

            return NextResponse.json(newuserfriends.friends, { status: 200 });
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
