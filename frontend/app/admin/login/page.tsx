'use client'

import { useAuth } from "@/app/context/AuthContext";
import { useLogin, useRegister } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Tab = "login" | "register";

export default function Login() {

    const { user, login } = useAuth();
    const router = useRouter();
    const loginMutation = useLogin();
    const registerMutation = useRegister();

    const [activeTab, setActiveTab] = useState<Tab>("login");

    // login form state
    const [loginEmail, setLoginEmail] = useState("test@gmail.com");
    const [loginPassword, setLoginPassword] = useState("Test@123");

    // register form state
    const [regName, setRegName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regMobile, setRegMobile] = useState("");
    const [regShopId, setShopId] = useState("");

    const [error, setError] = useState<string | null>(null);

    const validateEmail = (value: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    };

      const validatePassword = (value:string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(value);
  };


  const validatePhone = (value:string) => {
    const regex = /^[6-9][0-9]{9}$/; // Indian 10-digit numbers starting with 6–9
    return regex.test(value);
  };


    const handleLogin = async () => {

        const isEmailValid = validateEmail(loginEmail);

        if(!isEmailValid) {
            return setError("Please enter a valid email")
        }

        loginMutation.mutate(
            { email: loginEmail, password: loginPassword },
            {
                onSuccess: (data) => {
                    // Call login from AuthContext after successful authentication
                    login({ email: data.email || loginEmail, shopid: data.shopid });
                    router.push("/admin/products");
                    console.log("Login success", data);
                },
                onError: (error) => {
                    setError("Login failed. Please try again.");
                    console.log("Login failed", error);
                }
            }
        );
    };

    const handleRegister = async () => {
        const isEmailValid = validateEmail(regEmail);
        const isMobileNumberValid = validatePhone(regMobile);
        const isPasswordStrong = validatePassword(regPassword)
        if (!isEmailValid) {
            return setError("Please enter a valid email")
        }
        if(!isMobileNumberValid) {
            return setError("Please enter a valid phone number")
        }
                if(!isPasswordStrong) {
            return setError("Please enter strong password. Rules: At least 8 characters, At least one uppercase letter, At least one lowercase letter, At least one number, - At least one special character (like !@#$%^&*)")
        }
        registerMutation.mutate(
            {
                name: regName,
                email: regEmail,
                password: regPassword,
                mobile: regMobile,
                shopid: regShopId
            },
            {
                onSuccess: (data) => {
                    // Call login from AuthContext after successful authentication
                    login({ email: data.email || regEmail, shopid: data.shopid, });
                    router.push("/admin/settings");
                    console.log("Login success", data);
                },
                onError: (error) => {
                    setError("Login failed. Please try again.");
                    console.log("Login failed", error);
                }
            }
        );
    };


    // If routes are changed forcefully, i am logging out, so user can relogin OR register new account
    useEffect(() => {
        if (user) {
            router.push("/admin/products")
        }
    }, [user, router])

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
                        onClick={() => {setActiveTab("login"); setError(null)}}
                    >
                        Login
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${activeTab === "register"
                            ? "bg-black text-white"
                            : "bg-gray-200 text-black"
                            }`}
                        onClick={() => {setActiveTab("register"); setError(null)}}
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
                            className="px-4 py-2 bg-black text-white rounded-md mt-3 disabled:opacity-30"
                            type="button"
                            onClick={handleLogin}
                            disabled={!loginEmail || !loginPassword || loginMutation.isPending}
                        >
                            {loginMutation.isPending ? "Logging in..." : "Login"}
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
                            type="number"
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
                            placeholder="Enter Shop ID"
                            value={regShopId}
                            onChange={(e) => setShopId(e.target.value)}
                            required
                        />
                        <button
                            className="px-4 py-2 bg-black text-white rounded-md mt-3 disabled:opacity-30"
                            type="button"
                            onClick={handleRegister}
                            disabled={
                                !regName || !regEmail || !regPassword || !regMobile || !regShopId || registerMutation.isPending
                            }
                        >
                            {registerMutation.isPending ? "Registering..." : "Register"}
                        </button>
                    </div>
                )}
            </div>
        );
    }
}