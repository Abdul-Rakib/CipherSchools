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

    return (
        <div className="mx-4">
            <p className="p-2">Admin Login For Testing</p>
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
                    Sign In As Admin
                </button>
            </form>
        </div>
    )
}
