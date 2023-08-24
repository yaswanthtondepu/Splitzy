import { fetchGroupsSplitWise, verifyToken } from "@/lib/api/utils";
import dbConnect from "@/lib/dbconnection";
import { NextRequest, NextResponse } from "next/server";
import Group from "@/lib/api/models/groups";

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
                const usergroups = await Group.findOne({ id: user.id });
                if (usergroups) {
                    return NextResponse.json(usergroups.groups, {
                        status: 200,
                    });
                }
            }
            const token = user.accessToken;
            const splitwisegroups = await fetchGroupsSplitWise(token);
            const newusergroups = await Group.findOneAndUpdate(
                { id: user.id }, // Search condition
                { $set: { groups: splitwisegroups } }, // Update fields
                { upsert: true, new: true } // Options: upsert - create if not found, new - return the updated document
            );

            return NextResponse.json(newusergroups.groups, { status: 200 });
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
