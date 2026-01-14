"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function ScanPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [scanning, setScanning] = useState(true);

    const handleScan = async (result: string) => {
        if (!result || !scanning) return;

        // Stop scanning immediately after one successful read to prevent multiple API calls
        setScanning(false);

        // The result is the friend's ID
        const friendId = result;
        const userId = localStorage.getItem("userId");

        if (!userId) {
            router.push("/");
            return;
        }

        try {
            const res = await fetch("/api/friends/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, friendId }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("Friend added! Redirecting...");
                setTimeout(() => router.push("/dashboard"), 1500);
            } else {
                setError(data.error || "Failed to add friend");
                // Resume scanning after error if user wants to try again (button click?)
                // For now, let's just show error.
            }
        } catch (err) {
            setError("Network error");
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg overflow-hidden shadow-xl">
                <div className="p-4 bg-gray-900 text-white flex justify-between items-center">
                    <h1 className="text-lg font-bold">Scan Friend QR</h1>
                    <button
                        onClick={() => router.back()}
                        className="text-gray-300 hover:text-white"
                    >
                        Close
                    </button>
                </div>

                <div className="relative aspect-square bg-black">
                    {success ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-green-100 text-green-800 text-xl font-bold">
                            {success}
                        </div>
                    ) : scanning ? (
                        <Scanner
                            onScan={(results) => {
                                if (results && results.length > 0) {
                                    handleScan(results[0].rawValue);
                                }
                            }}
                            onError={(error) => console.log(error)}
                            components={{
                                onOff: false,
                                torch: true,
                                zoom: true,
                                finder: true,
                            }}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-800 p-4 text-center">
                            <div className="space-y-4">
                                <p className="font-bold text-lg">{error}</p>
                                <button
                                    onClick={() => {
                                        setError("");
                                        setScanning(true);
                                    }}
                                    className="bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 text-center text-gray-600">
                    Point camera at your friend&apos;s QR code
                </div>
            </div>
        </div>
    );
}
