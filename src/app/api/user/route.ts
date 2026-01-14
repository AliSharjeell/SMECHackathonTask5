import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "UserId required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Populate friends to get usernames
        const user = await User.findById(userId).populate("friends", "username");

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
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
        console.error("Get User error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
