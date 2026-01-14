"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const endpoint = isLogin ? "/api/login" : "/api/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      if (data.user) {
        // Simple auth: store ID in local storage
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("username", data.user.username);
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Failed to connect to server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-xl w-[400px] border border-zinc-800">
        <h1 className="text-3xl font-bold mb-8 text-center text-zinc-100 tracking-tight">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 mb-6 rounded-lg text-sm font-medium text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-400 ml-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all font-medium"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-400 ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all font-medium"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-white/5"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-zinc-500 hover:text-zinc-300 text-sm font-medium transition-colors"
          >
            {isLogin
              ? "Don't have an account? Create one"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
