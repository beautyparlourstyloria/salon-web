import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authAPI } from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function VerifyOtp() {
    const { state } = useLocation();
    const email = state?.email || "";
    const [otp, setOtp] = useState("");
    const [msg, setMsg] = useState("");
    const [error, setError] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120);
    const [demoOtpCode, setDemoOtpCode] = useState<string | null>(state?.demoOtpCode || null);
    const [demoVerifyUrl, setDemoVerifyUrl] = useState<string | null>(state?.demoVerifyUrl || null);
    const navigate = useNavigate();

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleResend = async () => {
        try {
            if (!email) return;
            setTimeLeft(120); // Reset timer
            const res = await authAPI.resendOtp({ email });
            setMsg("A new OTP has been sent via SMS!");
            setError(false);
            if (res.data.demoOtpCode) setDemoOtpCode(res.data.demoOtpCode);
        } catch (err: any) {
            setError(true);
            setMsg(err.response?.data?.message || "Failed to resend OTP.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!email) {
                setMsg("No email provided in session state.");
                setError(true);
                return;
            }
            await authAPI.verifyOtp({ email, otp });
            setMsg("Phone number verified successfully! You can now login safely.");
            setError(false);
            setTimeout(() => navigate("/"), 2500);
        } catch (err: any) {
            setError(true);
            setMsg(err.response?.data?.message || "Invalid or Expired OTP");
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="glass-card max-w-md w-full p-8 rounded-3xl">
                    <h2 className="text-2xl font-heading font-bold mb-2">Verify Phone Number</h2>
                    <p className="text-muted-foreground mb-6">
                        Enter the 6-digit OTP sent via SMS.
                    </p>

                    {demoOtpCode && (
                        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center border border-blue-100 dark:border-blue-900/40 space-y-3">
                            <div>
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-1">Developer Demo Mode: SMS</p>
                                <p className="text-sm text-blue-800 dark:text-blue-300">Target Phone is offline. Your mock code is: <span className="font-mono font-bold text-base">{demoOtpCode}</span></p>
                            </div>
                            {demoVerifyUrl && (
                                <div className="pt-3 border-t border-blue-200 dark:border-blue-900/50">
                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-2">Developer Demo Mode: Email</p>
                                    <a href={demoVerifyUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-foreground bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 transition-colors px-4 py-2 rounded-lg font-medium">
                                        Click Here to Verify Email
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                required
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary/30 outline-none transition-all text-center tracking-[0.5em] font-mono text-xl"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full gradient-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                        >
                            Verify Setup
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Didn't receive the code?{" "}
                            {timeLeft > 0 ? (
                                <span className="font-medium">Wait {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</span>
                            ) : (
                                <button onClick={handleResend} className="text-primary font-semibold hover:underline">
                                    Resend OTP
                                </button>
                            )}
                        </p>
                    </div>

                    {msg && (
                        <p className={`mt-4 p-3 rounded-lg text-sm text-center ${error ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
                            {msg}
                        </p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
