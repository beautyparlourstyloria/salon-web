import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ArrowRight, CheckCircle } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { authAPI } from "@/services/api";

const ResetPassword = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        if (!token) {
            setError("Invalid reset token");
            return;
        }

        setIsLoading(true);
        try {
            await authAPI.resetPassword(token, { password });
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to reset password. Token may be expired.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4 pt-24 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card w-full max-w-md p-8 rounded-3xl"
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground shadow-lg">
                            {success ? <CheckCircle size={32} /> : <Lock size={32} />}
                        </div>
                    </div>

                    <h1 className="text-2xl font-heading font-bold text-center mb-2">
                        {success ? "Password Reset Complete!" : "Reset Your Password"}
                    </h1>

                    {success ? (
                        <div className="text-center">
                            <p className="text-muted-foreground mb-8">
                                Your password has successfully been updated. You can now log in using your new credentials.
                            </p>
                            <button
                                onClick={() => navigate("/")}
                                className="w-full gradient-primary text-primary-foreground py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2"
                            >
                                Go to Homepage <ArrowRight size={18} />
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                            <p className="text-sm text-muted-foreground text-center mb-6">
                                Please enter your new password below.
                            </p>

                            <div>
                                <label className="text-sm font-medium mb-1.5 block">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                                    placeholder="Enter new password"
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Confirm Password</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                                    placeholder="Confirm new password"
                                    minLength={6}
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg my-4">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full gradient-primary text-primary-foreground py-3.5 rounded-xl text-base font-semibold hover:opacity-90 transition-opacity mt-4 disabled:opacity-70"
                            >
                                {isLoading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default ResetPassword;
