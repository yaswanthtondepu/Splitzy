import { NextResponse } from "next/server";
import mongoose from "mongoose";
mongoose
    .connect(process.env.DB_URI ? process.env.DB_URI : " ", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

export async function GET() {
    const data = { msg: "Hello World" };

    return NextResponse.json({ data });
}
