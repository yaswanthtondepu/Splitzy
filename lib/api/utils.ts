import { IUser, Person } from "@/interfaces/interfaces";
import crypto from "crypto";
const jwt = require("jsonwebtoken");
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/api/models/user";

export const generateJwtToken = (user: Person) => {
    const payload = {
        id: user.id,
        name: user.name,
    };
    const encryptedPayload = {
        payloadData: encryptData(JSON.stringify(payload)),
    };

    return jwt.sign(encryptedPayload, process.env.JWT_SECRET);
};

// Encryption function
export function encryptData(data: any) {
    const algo = process.env.CIPHER_ALGO ? process.env.CIPHER_ALGO : " ";
    const key = process.env.CIPHER_KEY ? process.env.CIPHER_KEY : " ";
    const iv = process.env.CIPHER_IV ? process.env.CIPHER_IV : " ";
    const cipher = crypto.createCipheriv(algo, Buffer.from(key, "hex"), iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
}

// Decryption function
export function decryptData(encryptedData: string) {
    const algo = process.env.CIPHER_ALGO ? process.env.CIPHER_ALGO : " ";
    const key = process.env.CIPHER_KEY ? process.env.CIPHER_KEY : " ";
    const iv = process.env.CIPHER_IV ? process.env.CIPHER_IV : " ";
    const decipher = crypto.createDecipheriv(algo, Buffer.from(key, "hex"), iv);
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

export const fetchGroupsSplitWise = async (accessToken: string) => {
    let result;

    // try {
    result = await axios.get(
        "https://secure.splitwise.com/api/v3.0/get_groups",
        {
            headers: { Authorization: accessToken },
        }
    );
    // } catch (error) {
    //     return res
    //         .status(401)
    //         .json({ error: "unauthorized: access token is invalid" });
    // }

    const groups: any = [];

    if (result.data?.groups) {
        result.data.groups.map((group: any) => {
            groups.push({
                id: group.id,
                name: group.name,
                // group.members.
                members: group.members.map((member: any) => {
                    return {
                        id: member.id,
                        name:
                            member.first_name +
                            " " +
                            (member.last_name
                                ? member.last_name.slice(0, 1)
                                : ""),
                    };
                }),
            });
        });
    }
    //sort ans based on name
    groups.sort((a: any, b: any) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
    });
    return groups;
};

export const fetchFriendsSplitWise = async (accessToken: string) => {
    let result = await axios.get(
        "https://secure.splitwise.com/api/v3.0/get_friends",
        {
            headers: { Authorization: accessToken },
        }
    );
    const ans: any = [];
    if (result.data?.friends) {
        result.data.friends.map((friend: any) => {
            ans.push({
                id: friend.id,
                name:
                    friend.first_name +
                    " " +
                    (friend.last_name ? friend.last_name : ""),
                // (friend.last_name ? friend.last_name.slice(0, 1) : ""),

                image: friend.picture?.large,
            });
        });
    }
    ans.sort((a: any, b: any) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
    });
    return ans;
};

export async function verifyToken(request: NextRequest) {
    const expiryTime = 60 * 60 * 24 * 3;

    const token = request.headers.get("token");
    if (!token) {
        return { error: "unauthorized: no token" };
    }
    const decryptedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decryptedToken.iat + expiryTime < Math.floor(Date.now() / 1000)) {
        return { error: "Token expired" };
    }
    const decoded = decryptData(decryptedToken.payloadData);

    const user = await User.findOne({ userId: JSON.parse(decoded).id });

    console.log(decryptedToken.iat);
    if (decryptedToken.iat < Math.floor(user?.updatedAt.getTime() / 1000)) {
        return { error: "Token expired" };
    }
    return { user: user };
}
