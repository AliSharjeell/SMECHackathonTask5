import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json(
                { error: "Username already exists" },
                { status: 400 }
            );
        }

        const user = await User.create({ username, password });

        return NextResponse.json({
            message: "User created",
            user: {
                _id: user._id,
                username: user.username,
            },
        });
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
