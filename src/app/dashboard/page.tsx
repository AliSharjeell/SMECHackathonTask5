"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";

interface Friend {
    _id: string;
    username: string;
}

interface UserData {
    _id: string;
    username: string;
    friends: Friend[];
}

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            router.push("/");
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/user?userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    // If user not found (e.g. invalid local storage), logout
                    localStorage.clear();
                    router.push("/");
                }
            } catch (error) {
                console.error("Failed to fetch user");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleRemoveFriend = async (friendId: string) => {
        if (!user) return;
        if (!confirm("Are you sure you want to remove this friend?")) return;

        try {
            const res = await fetch("/api/friends/remove", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user._id, friendId }),
            });

            if (res.ok) {
                const updatedFriends = user.friends.filter((f) => f._id !== friendId);
                setUser({ ...user, friends: updatedFriends });
            } else {
                alert("Failed to remove friend");
            }
        } catch (err) {
            alert("Error removing friend");
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!user) return <div className="p-8">User not found</div>;

    return (
        <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-100">
                            Welcome, {user.username}
                        </h1>
                        <p className="text-zinc-500 text-sm mt-1">ID: {user._id}</p>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            router.push("/");
                        }}
                        className="text-red-400 hover:text-red-300 font-medium transition-colors bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-lg"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col items-center space-y-6">
                        <h2 className="text-xl font-bold text-zinc-100">Your Friend Code</h2>
                        <div className="bg-white p-4 rounded-xl border border-zinc-700">
                            <QRCode value={user._id} size={200} />
                        </div>
                        <p className="text-sm text-zinc-500 text-center max-w-[200px]">
                            Let your friends scan this code to add you.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl text-center">
                            <h3 className="text-lg font-medium text-zinc-300 mb-4">
                                Add a New Friend
                            </h3>
                            <button
                                onClick={() => router.push("/scan")}
                                className="inline-flex items-center px-6 py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-xl transition-all shadow-lg shadow-white/5"
                            >
                                Scan QR Code
                            </button>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
                            <h2 className="text-xl font-bold text-zinc-100 mb-4">Friends List</h2>
                            {user.friends.length === 0 ? (
                                <p className="text-zinc-500 text-center py-4">No friends yet.</p>
                            ) : (
                                <ul className="divide-y divide-zinc-800">
                                    {user.friends.map((friend) => (
                                        <li key={friend._id} className="py-4 flex justify-between items-center group">
                                            <span className="font-medium text-zinc-200">
                                                {friend.username}
                                            </span>
                                            <button
                                                onClick={() => handleRemoveFriend(friend._id)}
                                                className="text-red-400 hover:text-red-300 text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg"
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
