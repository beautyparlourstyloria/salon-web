import { useState, useRef, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Navigate } from "react-router-dom";
import { User, Mail, Phone, Camera, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { userAPI, bookingAPI, uploadAPI } from "@/services/api";

const Profile = () => {
    const { currentUser, updateUser, bookings } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        phone: currentUser?.phone || "",
    });
    const [isUploading, setIsUploading] = useState(false);
    const [backendBookings, setBackendBookings] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (currentUser?.email || currentUser?.phone) {
            bookingAPI.getUserBookings({ email: currentUser.email, phone: currentUser.phone })
                .then(res => setBackendBookings(res.data))
                .catch(err => console.error("Failed to load user bookings", err));
        }
    }, [currentUser]);

    if (!currentUser) {
        return <Navigate to="/" />;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser(formData.email, formData.name, formData.phone, currentUser.profileImage);
        setIsEditing(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Backend will perform more sophisticated validation

        setIsUploading(true);

        try {
            const uploadRes = await uploadAPI.uploadImage(file);
            const optimizedImageUrl = uploadRes.data.url;

            if (currentUser.id) {
                await userAPI.updateProfileImage(currentUser.id, optimizedImageUrl);
            }
            updateUser(currentUser.email, currentUser.name, currentUser.phone, optimizedImageUrl);
            alert("Profile picture updated successfully!");
        } catch (err) {
            console.error("Failed to upload image:", err);
            alert("Failed to update profile picture. Please make sure image is valid.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Banner */}
            <section className="pt-28 pb-16 md:pt-36 md:pb-20 px-4 gradient-hero">
                <div className="container mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <p className="font-body font-medium text-primary tracking-widest uppercase text-base mb-3">
                            Account Dashboard
                        </p>
                        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
                            My <span className="text-gradient-primary italic">Profile</span>
                        </h1>
                        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                            Manage your personal details, upcoming appointments, and exclusive offers.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Profile Content */}
            <section className="section-padding">
                <div className="container mx-auto px-4 max-w-5xl">

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Profile Details */}
                        <div className="glass-card rounded-3xl p-8 h-fit">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-8 gap-4">
                                <h2 className="text-2xl font-bold font-heading">Personal Details</h2>

                                {/* Profile Picture Upload Area */}
                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <div className="w-24 h-24 rounded-full border-4 border-background shadow-lg overflow-hidden bg-secondary flex items-center justify-center relative">
                                        {currentUser.profileImage ? (
                                            <img src={currentUser.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={40} className="text-muted-foreground" />
                                        )}
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <Loader2 className="animate-spin text-white" size={24} />
                                            </div>
                                        )}
                                        {!isUploading && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Camera className="text-white" size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1.5 rounded-full shadow-lg pointer-events-none">
                                        <Camera size={14} />
                                    </div>
                                </div>
                            </div>

                            {!isEditing ? (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Full Name</p>
                                            <p className="font-semibold text-lg">{currentUser.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Email Address</p>
                                            <p className="font-semibold text-lg">{currentUser.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Contact Number</p>
                                            <p className="font-semibold text-lg">{currentUser.phone || "Not provided"}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full mt-6 py-3 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl bg-background border border-input outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            disabled
                                            className="w-full px-4 py-2.5 rounded-xl bg-background border border-input outline-none opacity-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Contact Number</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl bg-background border border-input outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 py-3 rounded-xl border border-input font-medium hover:bg-secondary transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Bookings & Offers */}
                        <div className="glass-card rounded-3xl p-8">
                            <h2 className="text-2xl font-bold font-heading mb-6">Your Bookings & Offers</h2>
                            {backendBookings.length > 0 ? (
                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                    {backendBookings.map((b) => (
                                        <div key={b._id} className="bg-background border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-lg text-foreground">{b.service}</h4>
                                                <span
                                                    className={`text-xs px-3 py-1 rounded-full font-bold ${b.status === "Confirmed"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                                                        : b.status === "Completed"
                                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                                                            : b.status === "Cancelled" || b.status === "Declined"
                                                                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                                                                : "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400"
                                                        }`}
                                                >
                                                    {b.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-muted-foreground flex flex-col gap-1">
                                                <p>
                                                    <span className="font-medium text-foreground/80">Date & Time:</span> {b.date} at {b.time}
                                                </p>
                                                <p>
                                                    <span className="font-medium text-foreground/80">Beautician:</span> {b.beautician}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-secondary/30 rounded-2xl border border-dashed border-border">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <User size={32} className="text-primary opacity-50" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
                                    <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
                                        You haven't booked any services or claimed any offers yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Profile;
