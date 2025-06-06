import { useState } from "react";
import type { AuthRequest } from "../../models/requests/AuthRequest";
import { login } from "../../api/auth";

interface LoginFormProps {
    onSuccess: () => void;
    switchToRegister: () => void;
}

export default function LoginForm({
    onSuccess,
    switchToRegister,
}: LoginFormProps) {
    const [formData, setFormData] = useState<AuthRequest>({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await login(formData);
            localStorage.setItem("jwt_token", response.token);
            console.log(response.token);
            onSuccess();
        } catch (err) {
            setError("Invalid email or password. Error: " + err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
                        <h1 className="text-3xl font-extrabold text-white text-center">
                            Login
                        </h1>
                        <p className="text-blue-100 text-center mt-2">
                            Welcome back! Please enter your credentials.
                        </p>
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 px-8 py-6"
                    >
                        {error && (
                            <div className="p-3 bg-red-500 text-white rounded-md text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-blue-400">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 bg-blue-200 border border-blue-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-blue-400">
                                Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 bg-blue-200 border border-blue-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="flex justify-center items-center">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
                            >
                                Login
                            </button>
                        </div>

                        <p className="text-center text-gray-400">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                className="text-blue-400 hover:text-blue-300 underline"
                                onClick={switchToRegister}
                            >
                                Register
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
