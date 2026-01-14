import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const { username, password } = await request.json();

        const user = await User.findOne({ username, password });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        return NextResponse.json({
            user: {
                _id: user._id,
                username: user.username,
                friends: user.friends,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
