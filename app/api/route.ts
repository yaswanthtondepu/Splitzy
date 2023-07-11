import { NextResponse } from "next/server";
import mongoose, { ConnectOptions } from "mongoose";
mongoose
    .connect(process.env.DB_URI ? process.env.DB_URI : " ", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions)
    .catch((error) => {
        console.error("Error connecting to MongoDB:");
    });

export async function GET() {
    const data = { msg: "Hello World" };

    return NextResponse.json({ data });
}
