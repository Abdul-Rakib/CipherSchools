import { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useLogin } from "../../hooks/useLogin";

export default function EmailLogin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { emailLogin, loginErr } = useLogin();

    const handleSubmit = async () => {
        await emailLogin(email, password);
    };

    const fillTestCredentials = () => {
        setEmail("test@gmail.com");
        setPassword("123456");
    };

    return (
        <div className="mx-4 mt-6">
            {/* Test Credentials Banner */}
            <div className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 mb-1">Quick Test Login</h4>
                        <p className="text-sm text-blue-800 mb-2">
                            Want to try without signing up? Use these test credentials:
                        </p>
                        <div className="bg-white rounded-lg p-3 mb-3 border border-blue-200">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600">Email:</span>
                                <code className="text-sm font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded">test@gmail.com</code>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">Password:</span>
                                <code className="text-sm font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded">123456</code>
                            </div>
                        </div>
                        <button
                            onClick={fillTestCredentials}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Auto-Fill Test Credentials
                        </button>
                    </div>
                </div>
            </div>

            <p className="text-gray-700 font-medium mb-3">Or Login Manually</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                {/* Email Input */}
                <div>
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="
                          w-full 
                          pl-10 
                          pr-4 
                          py-3 
                          border
                          text-black
                          rounded-lg 
                          placeholder-gray-400
                          focus:ring-2 focus:ring-ribbon
                        "
                            required
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div>
                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="
                          w-full 
                          pl-10 
                          pr-10 
                          py-3 
                          border
                          text-gray-800 
                          rounded-lg 
                          placeholder-gray-400
                          focus:ring-2 focus:ring-ribbon
                        "
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {loginErr && (
                    <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-center">
                        {loginErr}
                    </div>
                )}

                {/* Login Button */}
                <button
                    onClick={handleSubmit}
                    className="
                      w-full 
                      bg-gray-200 
                      text-black
                      py-3 
                      rounded-lg 
                    "
                >
                    Sign In For Test
                </button>
            </form>
        </div>
    )
}
