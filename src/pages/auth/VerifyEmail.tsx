import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { authAPI } from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function VerifyEmail() {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState("Verifying your email securely...");

    useEffect(() => {
        const verify = async () => {
            try {
                if (!token) return;
                await authAPI.verifyEmail(token);
                setStatus("Email Verified Successfully! Your email is now verified. You may proceed to login or verify your phone via OTP.");
            } catch (err: any) {
                setStatus(err.response?.data?.message || "Invalid or Expired Verification Token.");
            }
        };
        verify();
    }, [token]);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="glass-card max-w-lg w-full p-10 rounded-3xl text-center">
                    <h2 className="text-3xl font-heading font-bold mb-4">Email Verification</h2>
                    <p className="text-muted-foreground text-lg mb-8">{status}</p>
                    <Link
                        to="/"
                        className="inline-block gradient-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
                    >
                        Go to Home / Login
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}
