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

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return NextResponse.json(
                { error: "User or Friend not found" },
                { status: 404 }
            );
        }

        user.friends = user.friends.filter((id: any) => id.toString() !== friendId);
        await user.save();

        friend.friends = friend.friends.filter((id: any) => id.toString() !== userId);
        await friend.save();

        return NextResponse.json({
            message: "Friend removed successfully",
            friends: user.friends,
        });
    } catch (error) {
        console.error("Remove Friend error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
