'use client'

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Tab = "login" | "register";

export default function Login() {

    const { user, login, logout } = useAuth();
    const router = useRouter();
    
    const [activeTab, setActiveTab] = useState<Tab>("login");

    // login form state
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // register form state
    const [regName, setRegName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regMobile, setRegMobile] = useState("");
    const [regShopId, setShopId] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        try {
            setSubmitting(true);
            setError(null);
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: loginEmail, password: loginPassword }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Login failed");
                return;
            }
            login({ email: data.email || loginEmail, shopid: data.shopid });
            router.push("/admin/products");
        } catch (err: any) {
            console.error("Login error:", err);
            setError("Login failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRegister = async () => {
        setError('');
        try {
            setSubmitting(true);
            setError(null);
            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: regName,
                    email: regEmail,
                    password: regPassword,
                    mobile: regMobile,
                    shopid: regShopId
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Registration failed");
                return;
            }
            // auto-login after successful registration
            login({ email: data.email || regEmail });
            router.push("/admin/settings")
        } catch (err: any) {
            console.error("Register error:", err);
            setError("Registration failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // If routes are changed forcefully, i am logging out, so user can relogin OR register new account
    // useEffect(() => {
    //     logout()
    // })

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-between mt-10">
                <h2 className="text-2xl mb-4">Admin Portal</h2>
                <div className="mb-4 flex space-x-4">
                    <button
                        className={`px-4 py-2 rounded-md ${activeTab === "login"
                                ? "bg-black text-white"
                                : "bg-gray-200 text-black"
                            }`}
                        onClick={() => setActiveTab("login")}
                    >
                        Login
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${activeTab === "register"
                                ? "bg-black text-white"
                                : "bg-gray-200 text-black"
                            }`}
                        onClick={() => setActiveTab("register")}
                    >
                        Register
                    </button>
                </div>

                {error && (
                    <p className="text-red-600 mb-2 text-sm max-w-md text-center">
                        {error}
                    </p>
                )}

                {activeTab === "login" ? (
                    <div className="flex flex-col">
                        <input
                            className="p-2 mt-2 border border-gray-300 rounded-md w-80"
                            name="Email"
                            type="email"
                            placeholder="Enter Email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                        />

                        <input
                            className="p-2 mt-2 border border-gray-300 rounded-md"
                            name="Password"
                            placeholder="Password"
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                        />
                        <button
                            className="px-4 py-2 border-1 text-black rounded-md mt-3 border border-gray-400 disabled:opacity-60"
                            type="button"
                            onClick={handleLogin}
                            disabled={!loginEmail || !loginPassword || submitting}
                        >
                            {submitting ? "Logging in..." : "Login"}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <input
                            className="p-2 mt-2 border border-gray-300 rounded-md w-80"
                            name="Name"
                            type="text"
                            placeholder="Enter Your Name"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            required
                        />
                        <input
                            className="p-2 mt-2 border border-gray-300 rounded-md"
                            name="Mobile"
                            type="tel"
                            placeholder="Enter Mobile Number"
                            value={regMobile}
                            onChange={(e) => setRegMobile(e.target.value)}
                            required
                        />
                        <input
                            className="p-2 mt-2 border border-gray-300 rounded-md"
                            name="Email"
                            type="email"
                            placeholder="Enter Email ID"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            required
                        />
                        <input
                            className="p-2 mt-2 border border-gray-300 rounded-md"
                            name="Password"
                            placeholder="Password"
                            type="password"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            required
                        />
                        <input
                            className="p-2 mt-2 border border-gray-300 rounded-md"
                            name="Shop ID"
                            type="text"
                            placeholder="Enter 6 digit Shop ID"
                            value={regShopId}
                            onChange={(e) => setShopId(e.target.value)}
                            required
                        />
                        <button
                            className="px-4 py-2 bg-black text-white rounded-md mt-3 disabled:opacity-60"
                            type="button"
                            onClick={handleRegister}
                            disabled={
                                !regName || !regEmail || !regPassword || !regMobile || submitting
                            }
                        >
                            {submitting ? "Registering..." : "Register"}
                        </button>
                    </div>
                )}
            </div>
        );
    }
}