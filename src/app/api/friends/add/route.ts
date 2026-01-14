import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const { userId, friendId } = await request.json();

        if (!userId || !friendId) {
            return NextResponse.json(
                { error: "UserId and FriendId are required" },
                { status: 400 }
            );
        }

        if (userId === friendId) {
            return NextResponse.json(
                { error: "Cannot add yourself as a friend" },
                { status: 400 }
            );
        }

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return NextResponse.json(
                { error: "User or Friend not found" },
                { status: 404 }
            );
        }

        if (user.friends.includes(friendId)) {
            return NextResponse.json(
                { error: "Already friends" },
                { status: 400 }
            );
        }

        if (!user.friends.includes(friendId)) {
            user.friends.push(friendId);
            await user.save();
        }

        if (!friend.friends.includes(userId)) {
            friend.friends.push(userId);
            await friend.save();
        }

        return NextResponse.json({
            message: "Friend added successfully",
            friends: user.friends,
        });
    } catch (error) {
        console.error("Add Friend error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
