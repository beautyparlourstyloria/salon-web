import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trash2, Plus, Check, Lock, LogOut, Edit, X, Mail, Search, ChevronDown, Download } from "lucide-react";
import { convertTo12HourFormat } from "@/lib/utils";
import { userAPI, adminAPI, bookingAPI, authAPI, uploadAPI, bannerAPI, default as api } from "@/services/api";

const Admin = () => {
    const {
        media,
        addMedia,
        updateMedia,
        removeMedia,
        categories,
        addService,
        removeService,
        updateServicePrice,
        updateServiceDetails,
        bookings,
        updateBookingStatus,
        updateBooking,
        updateBookingDetails: localUpdateBookingDetails,
        offers,
        addOffer,
        removeOffer,
        updateOffer,
        bridalPackages,
        addBridalPackage,
        removeBridalPackage,
        updateBridalPackage,
        reviews,
        addReview,
        removeReview,
        updateReview,
        users,
        loginUser,
        logoutUser,
    } = useStore();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginForm, setLoginForm] = useState({ username: "", password: "" });
    const [loginError, setLoginError] = useState("");
    const [backendUsers, setBackendUsers] = useState<any[]>([]);
    const [backendBookings, setBackendBookings] = useState<any[]>([]);
    const [searchBookingQuery, setSearchBookingQuery] = useState("");
    const [searchBookingDate, setSearchBookingDate] = useState("");
    const [searchUserQuery, setSearchUserQuery] = useState("");

    const [banners, setBanners] = useState<any[]>([]);
    const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
    const [newBannerTitle, setNewBannerTitle] = useState("");
    const [newBannerSubtitle, setNewBannerSubtitle] = useState("");
    const [newBannerDesc, setNewBannerDesc] = useState("");
    const [newBannerBtnText, setNewBannerBtnText] = useState("");
    const [newBannerBtnUrl, setNewBannerBtnUrl] = useState("");
    const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);

    const [newMedia, setNewMedia] = useState({ src: "", label: "", type: "photo" as "photo" | "video", category: "Makeup" });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
    const [editMediaForm, setEditMediaForm] = useState({ src: "", label: "", type: "photo" as "photo" | "video", category: "Makeup" });
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [isEditingUploading, setIsEditingUploading] = useState(false);
    const [newService, setNewService] = useState({ name: "", price: "", endPrice: "", categoryId: "hair" });
    const [newOffer, setNewOffer] = useState({ title: "", price: "", originalPrice: "", desc: "", iconName: "Star", tag: "", tagColor: "bg-primary", isMembership: false });
    const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
    const [editServiceForm, setEditServiceForm] = useState({ name: "", price: "", endPrice: "" });

    const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
    const [editBookingForm, setEditBookingForm] = useState({ date: "", time: "", beautician: "" });
    const [editBookingSelectedServices, setEditBookingSelectedServices] = useState<string[]>([]);
    const [isEditServiceDropdownOpen, setIsEditServiceDropdownOpen] = useState(false);
    const editDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (editDropdownRef.current && !editDropdownRef.current.contains(event.target as Node)) {
                setIsEditServiceDropdownOpen(false);
            }
        };

        if (isEditServiceDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isEditServiceDropdownOpen]);
    const [editingOfferId, setEditingOfferId] = useState<string | null>(null);

    const [editingBridalId, setEditingBridalId] = useState<string | null>(null);
    const [editBridalForm, setEditBridalForm] = useState({ name: "", price: "", features: "" });
    const [newBridal, setNewBridal] = useState({ name: "", price: "", features: "" });

    const [newReview, setNewReview] = useState({ name: "", text: "", rating: 5, showOnHomepage: true });
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [editReviewForm, setEditReviewForm] = useState({ name: "", text: "", rating: 5, showOnHomepage: true });
    useEffect(() => {
        const token = localStorage.getItem("styloria-jwt-token");
        const role = localStorage.getItem("styloria-role");
        const storedUser = localStorage.getItem("styloria-current-user");

        if (token && role === "admin" && storedUser) {
            setIsAuthenticated(true);
            fetchUsers();
            fetchBookings();
            fetchBanners();
        } else {
            // Scrub any partially leftover or stale login variables
            setIsAuthenticated(false);
            localStorage.removeItem("styloria-jwt-token");
            localStorage.removeItem("styloria-role");
            localStorage.removeItem("styloria-current-user");
        }
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await bookingAPI.getAllBookings();
            setBackendBookings(res.data);
        } catch (err: any) {
            console.error("Failed to fetch bookings from backend, falling back to local store.");
            setBackendBookings(bookings); // fallback
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleLogout();
            }
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await userAPI.getAllUsers();
            setBackendUsers(res.data);
        } catch (err: any) {
            console.error("Failed to fetch users from backend, falling back to local store.");
            setBackendUsers(users); // fallback
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleLogout();
            }
        }
    };

    const handleSendFeedbackEmail = async (email: string) => {
        const message = window.prompt(`Compose feedback reply for ${email}:`);
        if (!message) return;

        try {
            await adminAPI.sendFeedbackEmail({ to: email, subject: "Styloria Admin - Feedback Response", text: message });
            alert("Feedback sent successfully.");
        } catch (err) {
            alert("Failed to send feedback email.");
        }
    };

    const fetchBanners = async () => {
        try {
            const res = await bannerAPI.getAllBanners();
            setBanners(res.data);
        } catch (err) {
            console.error("Failed to fetch banners");
        }
    };

    const handleAddBanner = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBannerId && !bannerImageFile) return;

        setIsUploadingBanner(true);
        try {
            let optimizedImageUrl;
            if (bannerImageFile) {
                const uploadRes = await uploadAPI.uploadImage(bannerImageFile);
                optimizedImageUrl = uploadRes.data.url;
            }

            const bannerData: any = {
                title: newBannerTitle,
                subtitle: newBannerSubtitle,
                description: newBannerDesc,
                buttonText: newBannerBtnText,
                buttonUrl: newBannerBtnUrl
            };
            
            if (optimizedImageUrl) {
                bannerData.imageUrl = optimizedImageUrl;
            }

            if (editingBannerId) {
                await bannerAPI.updateBanner(editingBannerId, bannerData);
                setEditingBannerId(null);
                alert("Banner updated successfully!");
            } else {
                await bannerAPI.addBanner(bannerData);
                alert("Banner added successfully!");
            }
            
            setBannerImageFile(null);
            setNewBannerTitle("");
            setNewBannerSubtitle("");
            setNewBannerDesc("");
            setNewBannerBtnText("");
            setNewBannerBtnUrl("");
            fetchBanners();
        } catch (err: any) {
            alert("Banner upload failed: " + (err.response?.data?.message || err.message));
        } finally {
            setIsUploadingBanner(false);
        }
    };

    const handleEditBanner = (banner: any) => {
        setEditingBannerId(banner._id);
        setNewBannerTitle(banner.title || "");
        setNewBannerSubtitle(banner.subtitle || "");
        setNewBannerDesc(banner.description || "");
        setNewBannerBtnText(banner.buttonText || "");
        setNewBannerBtnUrl(banner.buttonUrl || "");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteBanner = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this banner?")) return;
        try {
            await bannerAPI.deleteBanner(id);
            fetchBanners();
        } catch (err) {
            alert("Failed to delete banner");
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");

        try {
            const loginRes = await authAPI.login({
                email: loginForm.username,
                password: loginForm.password,
            });

            const { token, user } = loginRes.data;
            if (user.role !== "admin") {
                setLoginError("Access denied: You are not an admin.");
                return;
            }

            localStorage.setItem("styloria-jwt-token", token);
            localStorage.setItem("styloria-role", user.role);
            loginUser(user);
            setIsAuthenticated(true);
            fetchUsers();
            fetchBookings();
        } catch (err: any) {
            if (loginForm.username === "admin@styloria.com" && loginForm.password === "admin123") {
                console.warn("Backend API Offline! Proceeding via Local Frontend Storage only.");
                localStorage.setItem("styloria-jwt-token", "offline-demo-token");
                localStorage.setItem("styloria-role", "admin");
                loginUser({ id: "offline", name: "Admin", email: "admin@styloria.com", phone: "1234567890", role: "admin" });
                setIsAuthenticated(true);
                fetchUsers();
                fetchBookings();
            } else {
                setLoginError(err.response?.data?.message || "Invalid credentials. Are you an admin?");
            }
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("styloria-jwt-token");
        localStorage.removeItem("styloria-role");
        logoutUser();
        setLoginForm({ username: "", password: "" });
    };

    const handleAddMedia = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingMediaId) {
            let imageUrl = editMediaForm.src;
            if (editImageFile) {
                setIsEditingUploading(true);
                try {
                    const uploadRes = await uploadAPI.uploadImage(editImageFile);
                    imageUrl = uploadRes.data.url;
                } catch (err: any) {
                    alert("Image upload failed: " + (err.response?.data?.message || err.message));
                    setIsEditingUploading(false);
                    return;
                }
                setIsEditingUploading(false);
            }
            if (!imageUrl || !editMediaForm.label) return;

            updateMedia(editingMediaId, { ...editMediaForm, src: imageUrl });
            setEditingMediaId(null);
            setEditMediaForm({ src: "", label: "", type: "photo", category: "Makeup" });
            setEditImageFile(null);
        } else {
            let imageUrl = newMedia.src;
            if (imageFile) {
                setIsUploading(true);
                try {
                    const uploadRes = await uploadAPI.uploadImage(imageFile);
                    imageUrl = uploadRes.data.url;
                } catch (err: any) {
                    alert("Image upload failed: " + (err.response?.data?.message || err.message));
                    setIsUploading(false);
                    return;
                }
                setIsUploading(false);
            }

            if (!imageUrl || !newMedia.label) return;

            addMedia({ ...newMedia, src: imageUrl });
            setNewMedia({ src: "", label: "", type: "photo", category: "Makeup" });
            setImageFile(null);
        }
    };

    const handleAddService = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newService.name || !newService.price) return;
        addService(newService.categoryId, { name: newService.name, price: newService.price, endPrice: newService.endPrice });
        setNewService({ name: "", price: "", endPrice: "", categoryId: "hair" });
    };

    const handleAddOffer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newOffer.title || !newOffer.price) return;
        if (editingOfferId) {
            updateOffer(editingOfferId, newOffer);
            setEditingOfferId(null);
        } else {
            addOffer({ ...newOffer });
        }
        setNewOffer({ title: "", price: "", originalPrice: "", desc: "", iconName: "Star", tag: "", tagColor: "bg-primary", isMembership: false });
    };

    const handleSaveEditService = (categoryId: string, serviceId: string) => {
        if (!editServiceForm.name || !editServiceForm.price) return;
        updateServiceDetails(categoryId, serviceId, editServiceForm.name, editServiceForm.price, editServiceForm.endPrice);
        setEditingServiceId(null);
        setEditServiceForm({ name: "", price: "", endPrice: "" });
    };

    const calculateTotalAmount = (serviceString?: string) => {
        if (!serviceString) return "-";
        let total = 0;
        const regex = /₹([0-9,]+)/g;
        let match;
        while ((match = regex.exec(serviceString)) !== null) {
            const num = parseInt(match[1].replace(/,/g, ''), 10);
            if (!isNaN(num)) total += num;
        }
        return total > 0 ? `₹${total.toLocaleString('en-IN')}` : "-";
    };

    const downloadCSV = (filename: string, headers: string[], data: any[][]) => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(","), ...data.map(row => row.map(cell => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadBookings = () => {
        const headers = ["Name", "Phone", "Service", "Date", "Time", "Beautician", "Total Amount", "Status"];
        const fileData = backendBookings.map(b => [
            b.name,
            b.phone,
            b.service,
            b.date,
            convertTo12HourFormat(b.time),
            b.beautician || "Any",
            calculateTotalAmount(b.service),
            b.status
        ]);
        downloadCSV("styloria_bookings.csv", headers, fileData);
    };

    const handleDownloadUsers = () => {
        const headers = ["Name", "Email Address", "Phone Number"];
        const fileData = backendUsers.map(u => [
            u.name,
            u.email,
            u.phone || "-"
        ]);
        downloadCSV("styloria_users.csv", headers, fileData);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-4 pt-28">
                    <div className="glass-card w-full max-w-md p-8 rounded-3xl animate-in fade-in zoom-in duration-500">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground shadow-lg">
                                <Lock size={32} />
                            </div>
                        </div>
                        <h1 className="text-2xl font-heading font-bold text-center mb-2">Admin Access</h1>
                        <p className="text-muted-foreground text-center mb-8">Please log in to manage your site</p>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={loginForm.username}
                                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                                    placeholder="admin@styloria.com"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={loginForm.password}
                                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            {loginError && (
                                <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{loginError}</p>
                            )}

                            <button
                                type="submit"
                                className="w-full gradient-primary text-primary-foreground py-3.5 rounded-xl text-base font-semibold hover:opacity-90 transition-opacity mt-4"
                            >
                                Log In
                            </button>
                        </form>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-28 pb-16 px-4">
                <div className="container mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>

                    <Tabs defaultValue="bookings" className="w-full flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-64 shrink-0">
                            <TabsList className="flex flex-col h-auto w-full items-stretch justify-start bg-secondary/50 p-2 rounded-xl sticky top-24">
                                <TabsTrigger value="bookings" className="justify-start px-4 py-3 text-left data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-lg mb-1 transition-all">Bookings</TabsTrigger>
                                <TabsTrigger value="services" className="justify-start px-4 py-3 text-left data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-lg mb-1 transition-all">Services</TabsTrigger>
                                <TabsTrigger value="gallery" className="justify-start px-4 py-3 text-left data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-lg mb-1 transition-all">Gallery</TabsTrigger>
                                <TabsTrigger value="offers" className="justify-start px-4 py-3 text-left data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-lg mb-1 transition-all">Offers</TabsTrigger>
                                <TabsTrigger value="users" className="justify-start px-4 py-3 text-left data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-lg mb-1 transition-all">Users</TabsTrigger>
                                <TabsTrigger value="bridal" className="justify-start px-4 py-3 text-left data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-lg mb-1 transition-all">Bridal</TabsTrigger>
                                <TabsTrigger value="reviews" className="justify-start px-4 py-3 text-left data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-lg mb-1 transition-all">Testimonials</TabsTrigger>
                                <TabsTrigger value="banners" className="justify-start px-4 py-3 text-left data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-lg mb-1 transition-all">Main Banners</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 w-full min-w-0">

                            {/* Banners Tab */}
                            <TabsContent value="banners" className="space-y-6">
                                <div className="glass-card p-6 rounded-2xl">
                                    <h2 className="text-xl font-semibold mb-4">{editingBannerId ? "Edit Homepage Banner" : "Add Homepage Banner"}</h2>
                                    <form onSubmit={handleAddBanner} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setBannerImageFile(e.target.files ? e.target.files[0] : null)}
                                                className="hidden"
                                                id="banner-upload"
                                            />
                                            <label
                                                htmlFor="banner-upload"
                                                className="w-full px-4 py-2.5 rounded-xl border bg-background flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors h-full min-h-[140px]"
                                            >
                                                <span className="text-lg font-medium text-muted-foreground block text-center mb-2">
                                                    {bannerImageFile ? bannerImageFile.name : "+ Select Image"}
                                                </span>
                                            </label>
                                        </div>
                                        <div className="space-y-3">
                                            <input
                                                placeholder="Top Subtitle (e.g. Premium Beauty Lounge)"
                                                value={newBannerSubtitle}
                                                onChange={(e) => setNewBannerSubtitle(e.target.value)}
                                                className="w-full px-4 py-2 rounded-xl border bg-background"
                                            />
                                            <input
                                                placeholder="Main Title (e.g. Where Beauty Meets Confidence)"
                                                value={newBannerTitle}
                                                onChange={(e) => setNewBannerTitle(e.target.value)}
                                                className="w-full px-4 py-2 rounded-xl border bg-background"
                                            />
                                            <input
                                                placeholder="Description Paragraph"
                                                value={newBannerDesc}
                                                onChange={(e) => setNewBannerDesc(e.target.value)}
                                                className="w-full px-4 py-2 rounded-xl border bg-background"
                                            />
                                            <div className="flex gap-2">
                                                <input
                                                    placeholder="Button Text"
                                                    value={newBannerBtnText}
                                                    onChange={(e) => setNewBannerBtnText(e.target.value)}
                                                    className="w-full px-4 py-2 rounded-xl border bg-background"
                                                />
                                                <input
                                                    placeholder="Button Link (e.g. #services)"
                                                    value={newBannerBtnUrl}
                                                    onChange={(e) => setNewBannerBtnUrl(e.target.value)}
                                                    className="w-full px-4 py-2 rounded-xl border bg-background"
                                                />
                                            </div>
                                            {editingBannerId && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingBannerId(null);
                                                        setNewBannerTitle("");
                                                        setNewBannerSubtitle("");
                                                        setNewBannerDesc("");
                                                        setNewBannerBtnText("");
                                                        setNewBannerBtnUrl("");
                                                        setBannerImageFile(null);
                                                    }}
                                                    className="w-full border-2 border-red-500 text-red-500 hover:bg-red-50 rounded-xl py-3 flex items-center justify-center gap-2 mt-2 font-medium"
                                                >
                                                    Cancel Editing
                                                </button>
                                            )}
                                            <button type="submit" disabled={(!editingBannerId && !bannerImageFile) || isUploadingBanner} className="w-full gradient-primary text-white rounded-xl py-3 flex items-center justify-center gap-2 disabled:opacity-50 mt-4">
                                                {isUploadingBanner ? "Saving..." : editingBannerId ? "Update Dynamic Banner" : "Save Dynamic Banner"}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {banners.map((b) => (
                                        <div key={b._id} className="glass-card p-4 rounded-2xl flex flex-col gap-3">
                                            <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden bg-black/5">
                                                <img src={b.imageUrl} alt={b.title || "Banner"} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="font-medium text-sm truncate max-w-[200px]">{b.title || "Untitled Banner"}</p>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditBanner(b)}
                                                        className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                                        title="Edit Banner"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBanner(b._id)}
                                                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                        title="Delete Banner"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {banners.length === 0 && (
                                        <p className="text-muted-foreground col-span-full text-center py-8">No dynamic banners added yet. The default static banner is currently showing on the homepage.</p>
                                    )}
                                </div>
                            </TabsContent>

                            {/* Bookings Tab */}
                            <TabsContent value="bookings" className="space-y-4 m-0">
                                <div className="glass-card p-6 rounded-2xl">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-xl font-semibold">Manage Bookings</h2>
                                            <button onClick={handleDownloadBookings} className="flex items-center gap-1.5 text-sm bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-lg transition-colors">
                                                <Download size={14} /> Export CSV
                                            </button>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                            <div className="relative w-full sm:w-64">
                                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                                <input
                                                    type="text"
                                                    placeholder="Search by name, phone or status..."
                                                    value={searchBookingQuery}
                                                    onChange={(e) => setSearchBookingQuery(e.target.value)}
                                                    className="w-full pl-9 pr-4 py-2 rounded-xl border bg-background text-sm"
                                                />
                                            </div>
                                            <div className="relative w-full sm:w-44">
                                                <input
                                                    type="date"
                                                    value={searchBookingDate}
                                                    onChange={(e) => setSearchBookingDate(e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl border bg-background text-sm text-muted-foreground"
                                                />
                                                {searchBookingDate && (
                                                    <button 
                                                        onClick={() => setSearchBookingDate("")} 
                                                        className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full bg-secondary/50"
                                                        title="Clear Date Filter"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {backendBookings.filter(b => {
                                        const matchQ = b.name?.toLowerCase().includes(searchBookingQuery.toLowerCase()) || b.phone?.includes(searchBookingQuery) || b.status?.toLowerCase().includes(searchBookingQuery.toLowerCase());
                                        const matchD = searchBookingDate ? b.date === searchBookingDate : true;
                                        return matchQ && matchD;
                                    }).length === 0 ? (
                                        <p className="text-muted-foreground">No bookings found.</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-border/50 text-muted-foreground">
                                                        <th className="p-3 font-medium">Name</th>
                                                        <th className="p-3 font-medium">Phone</th>
                                                        <th className="p-3 font-medium">Service</th>
                                                        <th className="p-3 font-medium">Total Amount</th>
                                                        <th className="p-3 font-medium">Date & Time</th>
                                                        <th className="p-3 font-medium">Beautician</th>
                                                        <th className="p-3 font-medium">Status</th>
                                                        <th className="p-3 font-medium text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {backendBookings.filter(b => {
                                                        const matchQ = b.name?.toLowerCase().includes(searchBookingQuery.toLowerCase()) || b.phone?.includes(searchBookingQuery) || b.status?.toLowerCase().includes(searchBookingQuery.toLowerCase());
                                                        const matchD = searchBookingDate ? b.date === searchBookingDate : true;
                                                        return matchQ && matchD;
                                                    }).map((b) => (
                                                        <tr key={b._id || b.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                                                            <td className="p-3 font-medium">{b.name}</td>
                                                            <td className="p-3 text-muted-foreground">{b.phone}</td>
                                                            <td className="p-3">
                                                                {editingBookingId === (b._id || b.id) ? (
                                                                    <div className="relative min-w-[200px]" ref={editDropdownRef}>
                                                                        <div 
                                                                            className="w-full px-2 py-1.5 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 cursor-pointer flex justify-between items-center transition-all min-h-[36px]"
                                                                            onClick={() => setIsEditServiceDropdownOpen(!isEditServiceDropdownOpen)}
                                                                        >
                                                                            <span className={editBookingSelectedServices.length === 0 ? "text-muted-foreground text-sm" : "text-foreground text-sm line-clamp-1"}>
                                                                                {editBookingSelectedServices.length === 0 ? "Choose services" : editBookingSelectedServices.join(", ")}
                                                                            </span>
                                                                            <ChevronDown size={14} className={`text-muted-foreground transition-transform ${isEditServiceDropdownOpen ? "rotate-180" : ""}`} />
                                                                        </div>

                                                                        {isEditServiceDropdownOpen && (
                                                                            <div className="absolute z-[100] w-[250px] md:w-full mt-1 bg-background border border-input rounded-xl shadow-lg max-h-60 overflow-y-auto p-1 text-sm top-full left-0">
                                                                                <div className="space-y-3 p-1 relative">
                                                                                    <div className="sticky top-0 bg-background/95 backdrop-blur z-10 flex justify-end pb-1 border-b">
                                                                                        <button type="button" onClick={() => setIsEditServiceDropdownOpen(false)} className="text-xs font-semibold text-primary">Done</button>
                                                                                    </div>
                                                                                    {[
                                                                                        { label: "Standard Services", items: categories.map((c) => c.services.map((s) => `${s.name} (${s.price}${s.endPrice ? ` to ${s.endPrice}` : ''})`)).flat() },
                                                                                        { label: "Memberships & Offers", items: offers.filter(o => o.title !== "Bridal Membership").map((o) => `${o.title} (${o.price})`) },
                                                                                        { label: "Bridal Packages", items: bridalPackages.map(pkg => `${pkg.name} (${pkg.price})`) }
                                                                                    ].map((group) => (
                                                                                        <div key={group.label}>
                                                                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 px-1">{group.label}</p>
                                                                                            {group.items.map((item) => (
                                                                                                <label key={item} className="flex items-start gap-2 p-1.5 hover:bg-secondary/50 rounded-md cursor-pointer transition-colors">
                                                                                                    <input
                                                                                                        type="checkbox"
                                                                                                        checked={editBookingSelectedServices.includes(item)}
                                                                                                        onChange={(e) => {
                                                                                                            if (e.target.checked) setEditBookingSelectedServices([...editBookingSelectedServices, item]);
                                                                                                            else setEditBookingSelectedServices(editBookingSelectedServices.filter(s => s !== item));
                                                                                                        }}
                                                                                                        className="mt-0.5 shrink-0 accent-primary w-3 h-3 cursor-pointer"
                                                                                                    />
                                                                                                    <span className="text-xs cursor-pointer leading-tight">{item}</span>
                                                                                                </label>
                                                                                            ))}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    b.service
                                                                )}
                                                            </td>
                                                            <td className="p-3 font-semibold text-primary whitespace-nowrap">
                                                                {calculateTotalAmount(editingBookingId === (b._id || b.id) ? editBookingSelectedServices.join(', ') : b.service)}
                                                            </td>
                                                            <td className="p-3">
                                                                {editingBookingId === (b._id || b.id) ? (
                                                                    <div className="flex gap-2 min-w-[200px]">
                                                                        <input type="date" value={editBookingForm.date} onChange={e => setEditBookingForm({ ...editBookingForm, date: e.target.value })} className="border rounded px-2 py-1 w-full text-sm bg-background border-input" />
                                                                        <input type="time" value={editBookingForm.time} onChange={e => setEditBookingForm({ ...editBookingForm, time: e.target.value })} className="border rounded px-2 py-1 w-full text-sm bg-background border-input" />
                                                                    </div>
                                                                ) : (
                                                                    <span className="whitespace-nowrap">{new Date(b.date).toLocaleDateString()} at {convertTo12HourFormat(b.time)}</span>
                                                                )}
                                                            </td>
                                                            <td className="p-3">
                                                                {editingBookingId === (b._id || b.id) ? (
                                                                    <select value={editBookingForm.beautician} onChange={e => setEditBookingForm({ ...editBookingForm, beautician: e.target.value })} className="border rounded px-2 py-1.5 w-full min-w-[120px] text-sm bg-background border-input outline-none">
                                                                        <option value="">Select Beautician</option>
                                                                        {["Any Available", "Pooja", "Sonali"].map((b) => (
                                                                            <option key={b} value={b}>{b}</option>
                                                                        ))}
                                                                    </select>
                                                                ) : (
                                                                    b.beautician
                                                                )}
                                                            </td>
                                                            <td className="p-3">
                                                                <span
                                                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${b.status === "Confirmed"
                                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                                        : b.status === "Declined" || b.status === "Cancelled"
                                                                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                                            : b.status === "Pending"
                                                                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                                                : "bg-secondary text-secondary-foreground"
                                                                        }`}
                                                                >
                                                                    {b.status}
                                                                </span>
                                                            </td>
                                                            <td className="p-3">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    {editingBookingId === (b._id || b.id) ? (
                                                                        <>
                                                                            <button onClick={async () => {
                                                                                const updatedService = editBookingSelectedServices.join(", ");
                                                                                
                                                                                try {
                                                                                    if (b._id) {
                                                                                        await bookingAPI.updateBookingDetails(b._id, {
                                                                                            date: editBookingForm.date,
                                                                                            time: editBookingForm.time,
                                                                                            service: updatedService,
                                                                                            beautician: editBookingForm.beautician
                                                                                        });
                                                                                    } else {
                                                                                        throw new Error("Local fallback mode");
                                                                                    }
                                                                                } catch (err: any) {
                                                                                    console.error("Backend failed, saving locally", err);
                                                                                    if (b.id) {
                                                                                        localUpdateBookingDetails(b.id, editBookingForm.date, editBookingForm.time, updatedService, editBookingForm.beautician);
                                                                                    } else {
                                                                                        alert("Failed to update booking details: " + (err.response?.data?.message || err.message));
                                                                                    }
                                                                                } finally {
                                                                                    setEditingBookingId(null);
                                                                                    setIsEditServiceDropdownOpen(false);
                                                                                    fetchBookings();
                                                                                }
                                                                            }} className="text-green-600 hover:text-green-700 bg-green-100 p-2 rounded-full transition-colors" title="Save Booking">
                                                                                <Check size={16} />
                                                                            </button>
                                                                            <button onClick={() => { setEditingBookingId(null); setIsEditServiceDropdownOpen(false); }} className="text-red-500 bg-red-100 p-2 rounded-full transition-colors" title="Cancel">
                                                                                <X size={16} />
                                                                            </button>
                                                                        </>
                                                                    ) : (
                                                                        <button onClick={() => { 
                                                                            setEditingBookingId(b._id || b.id); 
                                                                            setIsEditServiceDropdownOpen(false);
                                                                            setEditBookingForm({ date: b.date, time: b.time, beautician: b.beautician || "" }); 
                                                                            // Make sure to parse existing services exactly as they are in the checkboxes
                                                                            const allServiceNames = [
                                                                                ...categories.map((c) => c.services.map((s) => `${s.name} (${s.price}${s.endPrice ? ` to ${s.endPrice}` : ''})`)).flat(),
                                                                                ...offers.filter(o => o.title !== "Bridal Membership").map((o) => `${o.title} (${o.price})`),
                                                                                ...bridalPackages.map(pkg => `${pkg.name} (${pkg.price})`)
                                                                            ];
                                                                            const selectedList = b.service ? b.service.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
                                                                            
                                                                            // Try to find the exact matching service from allServiceNames
                                                                            const matchedServices = selectedList.map((selected: string) => {
                                                                                const match = allServiceNames.find(sName => sName.toLowerCase().includes(selected.toLowerCase()) || selected.toLowerCase().includes(sName.toLowerCase()) || sName === selected);
                                                                                return match || selected;
                                                                            });
                                                                            setEditBookingSelectedServices(matchedServices);
                                                                        }} className="text-blue-600 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 p-2 rounded-full transition-colors" title="Edit Booking Details">
                                                                            <Edit size={16} />
                                                                        </button>
                                                                    )}
                                                                    {b.status === "Pending" && (
                                                                        <>
                                                                            <button onClick={async () => { 
                                                                                try { 
                                                                                    if (b._id) await bookingAPI.updateBookingStatus(b._id, "Confirmed"); 
                                                                                } catch(e) { console.error(e); } finally { fetchBookings(); } 
                                                                            }} className="text-green-600 hover:text-green-700 bg-green-100 hover:bg-green-200 p-2 rounded-full transition-colors" title="Confirm Booking">
                                                                                <Check size={16} />
                                                                            </button>
                                                                            <button onClick={async () => { 
                                                                                try { 
                                                                                    if (b._id) await bookingAPI.updateBookingStatus(b._id, "Declined"); 
                                                                                } catch(e) { console.error(e); } finally { fetchBookings(); } 
                                                                            }} className="text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 p-2 rounded-full transition-colors" title="Decline Booking">
                                                                                <X size={16} />
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* Services Tab */}
                            <TabsContent value="services" className="space-y-6">
                                <div className="glass-card p-6 rounded-2xl">
                                    <h2 className="text-xl font-semibold mb-4">Add New Service</h2>
                                    <form onSubmit={handleAddService} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                        <input
                                            placeholder="Service Name"
                                            value={newService.name}
                                            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border bg-background"
                                            required
                                        />
                                        <input
                                            placeholder="Start Price (e.g. ₹150)"
                                            value={newService.price}
                                            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border bg-background"
                                            required
                                        />
                                        <input
                                            placeholder="End Price (Optional, e.g. ₹499)"
                                            value={newService.endPrice}
                                            onChange={(e) => setNewService({ ...newService, endPrice: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border bg-background"
                                        />
                                        <select
                                            value={newService.categoryId}
                                            onChange={(e) => setNewService({ ...newService, categoryId: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border bg-background"
                                        >
                                            {categories.map((c) => (
                                                <option key={c.id} value={c.id}>{c.label}</option>
                                            ))}
                                        </select>
                                        <button type="submit" className="gradient-primary text-white rounded-xl py-2 flex items-center justify-center gap-2">
                                            <Plus size={18} /> Add
                                        </button>
                                    </form>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {categories.map((c) => (
                                        <div key={c.id} className="glass-card p-6 rounded-2xl">
                                            <h3 className="text-lg font-bold mb-4">{c.label}</h3>
                                            <ul className="space-y-3">
                                                {c.services.map((s) => (
                                                    <li key={s.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                                        <div>
                                                            <p className="font-medium">{s.name}</p>
                                                            {editingServiceId === s.id ? (
                                                                <div className="flex flex-col gap-2 mt-1">
                                                                    <input
                                                                        className="border border-input rounded-md px-2 py-0.5 text-sm bg-background w-full max-w-[150px]"
                                                                        value={editServiceForm.name}
                                                                        onChange={(e) => setEditServiceForm({ ...editServiceForm, name: e.target.value })}
                                                                    />
                                                                    <div className="flex items-center gap-2">
                                                                        <input
                                                                            placeholder="Start Price"
                                                                            className="border border-input rounded-md px-2 py-0.5 text-sm w-24 bg-background"
                                                                            value={editServiceForm.price}
                                                                            onChange={(e) => setEditServiceForm({ ...editServiceForm, price: e.target.value })}
                                                                        />
                                                                        <input
                                                                            placeholder="End Price"
                                                                            className="border border-input rounded-md px-2 py-0.5 text-sm w-24 bg-background"
                                                                            value={editServiceForm.endPrice}
                                                                            onChange={(e) => setEditServiceForm({ ...editServiceForm, endPrice: e.target.value })}
                                                                        />
                                                                        <button
                                                                            onClick={() => handleSaveEditService(c.id, s.id)}
                                                                            className="text-green-600 bg-green-100 p-1 rounded-md"
                                                                        >
                                                                            <Check size={14} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setEditingServiceId(null)}
                                                                            className="text-red-500 bg-red-100 p-1 rounded-md"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-primary font-semibold text-sm cursor-pointer hover:underline" onClick={() => {
                                                                    setEditingServiceId(s.id);
                                                                    setEditServiceForm({ name: s.name, price: s.price, endPrice: s.endPrice || "" });
                                                                }}>
                                                                    {s.price}{s.endPrice ? ` to ${s.endPrice}` : ""} <Edit size={12} className="inline ml-1" />
                                                                </span>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => removeService(c.id, s.id)}
                                                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* Gallery Tab */}
                            <TabsContent value="gallery" className="space-y-6">
                                <div className="glass-card p-6 rounded-2xl">
                                    <h2 className="text-xl font-semibold mb-4">{editingMediaId ? "Edit Media" : "Add New Media"}</h2>
                                    <form onSubmit={handleAddMedia} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
                                        <div className="lg:col-span-2 relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (editingMediaId) {
                                                        setEditImageFile(e.target.files ? e.target.files[0] : null);
                                                    } else {
                                                        setImageFile(e.target.files ? e.target.files[0] : null);
                                                    }
                                                }}
                                                className="hidden"
                                                id="gallery-upload"
                                            />
                                            <label
                                                htmlFor="gallery-upload"
                                                className="w-full px-4 py-2.5 rounded-xl border bg-background flex items-center justify-between cursor-pointer hover:border-primary transition-colors"
                                            >
                                                <span className="text-sm truncate text-muted-foreground line-clamp-1 max-w-[80%] block" title={editingMediaId ? (editImageFile ? editImageFile.name : editMediaForm.src) : (imageFile ? imageFile.name : "Select Image from Device...")}>
                                                    {editingMediaId
                                                        ? (editImageFile ? editImageFile.name : (editMediaForm.src ? "Retain Existing Image" : "Select Image..."))
                                                        : (imageFile ? imageFile.name : "Select Image from Device...")}
                                                </span>
                                                <div className="bg-secondary px-3 py-1 rounded text-xs font-semibold shrink-0">Browse</div>
                                            </label>
                                        </div>
                                        <input
                                            placeholder="Label / Title"
                                            value={editingMediaId ? editMediaForm.label : newMedia.label}
                                            onChange={(e) => {
                                                if (editingMediaId) setEditMediaForm({ ...editMediaForm, label: e.target.value });
                                                else setNewMedia({ ...newMedia, label: e.target.value });
                                            }}
                                            className="w-full px-4 py-2 rounded-xl border bg-background"
                                            required
                                        />
                                        <select
                                            value={editingMediaId ? editMediaForm.category : newMedia.category}
                                            onChange={(e) => {
                                                if (editingMediaId) setEditMediaForm({ ...editMediaForm, category: e.target.value });
                                                else setNewMedia({ ...newMedia, category: e.target.value });
                                            }}
                                            className="w-full px-4 py-2 rounded-xl border bg-background"
                                        >
                                            {["Makeup", "Bridal", "Hair", "Nails", "Skincare", "Studio"].map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        <div className="flex gap-2 w-full">
                                            <button type="submit" disabled={(editingMediaId && isEditingUploading) || (!editingMediaId && isUploading) || (!editingMediaId && !newMedia.src && !imageFile)} className="flex-1 gradient-primary text-white rounded-xl py-2 flex items-center justify-center gap-2 disabled:opacity-50">
                                                {editingMediaId
                                                    ? (isEditingUploading ? "Saving..." : <><Check size={18} /> Save</>)
                                                    : (isUploading ? "Uploading..." : <><Plus size={18} /> Add</>)
                                                }
                                            </button>
                                            {editingMediaId && (
                                                <button type="button" onClick={() => { setEditingMediaId(null); setEditImageFile(null); setEditMediaForm({ src: "", label: "", type: "photo", category: "Makeup" }); }} className="flex-1 border border-input bg-secondary text-foreground hover:bg-secondary/50 rounded-xl py-2 flex items-center justify-center gap-2 transition-colors">
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {media.map((m) => (
                                        <div key={m.id} className="relative group rounded-xl overflow-hidden aspect-square border">
                                            <img src={m.src} alt={m.label} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingMediaId(m.id);
                                                        setEditMediaForm({ src: m.src, label: m.label, type: m.type || "photo", category: m.category });
                                                        setEditImageFile(null);
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }}
                                                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={20} />
                                                </button>
                                                <button
                                                    onClick={() => removeMedia(m.id)}
                                                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* Offers Tab */}
                            <TabsContent value="offers" className="space-y-6">
                                <div className="glass-card p-6 rounded-2xl">
                                    <h2 className="text-xl font-semibold mb-4">Add New Offer / Membership</h2>
                                    <form onSubmit={handleAddOffer} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input
                                            placeholder="Title (e.g. Summer Glow)"
                                            value={newOffer.title}
                                            onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border bg-background"
                                            required
                                        />
                                        <input
                                            placeholder="Price (e.g. ₹2,499)"
                                            value={newOffer.price}
                                            onChange={(e) => setNewOffer({ ...newOffer, price: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border bg-background"
                                            required
                                        />
                                        <input
                                            placeholder="Original Price (optional)"
                                            value={newOffer.originalPrice}
                                            onChange={(e) => setNewOffer({ ...newOffer, originalPrice: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border bg-background"
                                        />
                                        <input
                                            placeholder="Tag (e.g. Summer Special)"
                                            value={newOffer.tag}
                                            onChange={(e) => setNewOffer({ ...newOffer, tag: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border bg-background"
                                        />
                                        <textarea
                                            placeholder="Description"
                                            value={newOffer.desc}
                                            onChange={(e) => setNewOffer({ ...newOffer, desc: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border bg-background sm:col-span-2"
                                            rows={2}
                                        />
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="isMembership"
                                                checked={newOffer.isMembership}
                                                onChange={(e) => setNewOffer({ ...newOffer, isMembership: e.target.checked })}
                                                className="w-4 h-4"
                                            />
                                            <label htmlFor="isMembership" className="text-sm">Is this a Membership? (Shows on homepage)</label>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3 sm:col-span-2">
                                            <button type="submit" className="flex-1 gradient-primary text-white rounded-xl py-2 flex items-center justify-center gap-2">
                                                {editingOfferId ? <><Check size={18} /> Update Offer</> : <><Plus size={18} /> Add Offer</>}
                                            </button>
                                            {editingOfferId && (
                                                <button type="button" onClick={() => { setEditingOfferId(null); setNewOffer({ title: "", price: "", originalPrice: "", desc: "", iconName: "Star", tag: "", tagColor: "bg-primary", isMembership: false }); }} className="flex-1 border border-input bg-secondary text-foreground hover:bg-secondary/50 rounded-xl py-2 flex items-center justify-center gap-2 transition-colors">
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {offers.map((o) => (
                                        <div key={o.id} className="glass-card p-6 rounded-2xl relative">
                                            <div className="absolute top-4 right-4 flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingOfferId(o.id);
                                                        setNewOffer({ title: o.title, price: o.price, originalPrice: o.originalPrice || "", desc: o.desc || "", iconName: o.iconName || "Star", tag: o.tag || "", tagColor: o.tagColor || "bg-primary", isMembership: o.isMembership || false });
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }}
                                                    className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => removeOffer(o.id)}
                                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <h3 className="text-lg font-bold pr-8">{o.title}</h3>
                                            <p className="text-primary font-semibold text-xl my-2">{o.price} {o.originalPrice && <span className="text-muted-foreground line-through text-sm">{o.originalPrice}</span>}</p>
                                            <p className="text-sm text-muted-foreground mb-3">{o.desc}</p>
                                            {o.tag && <span className="text-xs bg-secondary px-2 py-1 rounded inline-block mb-2">{o.tag}</span>}
                                            <p className="text-xs font-medium text-amber-600">{o.isMembership ? "Membership (Homepage)" : "Standard Offer"}</p>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* Users Tab */}
                            <TabsContent value="users" className="space-y-4 m-0">
                                <div className="glass-card p-6 rounded-2xl">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-xl font-semibold">Registered Users</h2>
                                            <button onClick={handleDownloadUsers} className="flex items-center gap-1.5 text-sm bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-lg transition-colors">
                                                <Download size={14} /> Export CSV
                                            </button>
                                        </div>
                                        <div className="relative w-full sm:w-64">
                                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <input
                                                type="text"
                                                placeholder="Search by name, email or phone..."
                                                value={searchUserQuery}
                                                onChange={(e) => setSearchUserQuery(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2 rounded-xl border bg-background text-sm"
                                            />
                                        </div>
                                    </div>
                                    {backendUsers.filter(u => u.name?.toLowerCase().includes(searchUserQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchUserQuery.toLowerCase()) || u.phone?.includes(searchUserQuery)).length === 0 ? (
                                        <p className="text-muted-foreground">No users registered yet.</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-border/50 text-muted-foreground">
                                                        <th className="p-3 font-medium">Name</th>
                                                        <th className="p-3 font-medium">Email Address</th>
                                                        <th className="p-3 font-medium">Phone Number</th>
                                                        <th className="p-3 font-medium text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {backendUsers.filter(u => u.name?.toLowerCase().includes(searchUserQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchUserQuery.toLowerCase()) || u.phone?.includes(searchUserQuery)).map((u, i) => (
                                                        <tr key={u._id || i} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                                                            <td className="p-3 font-medium flex items-center gap-2">
                                                                {u.profileImage ? (
                                                                    <img src={u.profileImage} alt="Profile" className="w-8 h-8 rounded-full object-cover shrink-0" />
                                                                ) : (
                                                                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                                                                        {u.name.charAt(0).toUpperCase()}
                                                                    </div>
                                                                )}
                                                                {u.name}
                                                            </td>
                                                            <td className="p-3 text-muted-foreground">{u.email}</td>
                                                            <td className="p-3 text-muted-foreground">{u.phone || "-"}</td>
                                                            <td className="p-3 text-right">
                                                                <button onClick={() => handleSendFeedbackEmail(u.email)} className="text-sm bg-blue-100/50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ml-auto">
                                                                    <Mail size={14} /> Send Reply
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* Bridal Packages Tab */}
                            <TabsContent value="bridal" className="space-y-6">
                                <div className="glass-card p-6 rounded-2xl">
                                    <h2 className="text-xl font-semibold mb-4">Add New Bridal Package</h2>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        if (!newBridal.name || !newBridal.price) return;
                                        addBridalPackage({
                                            name: newBridal.name,
                                            price: newBridal.price,
                                            features: newBridal.features.split(',').map(f => f.trim()).filter(Boolean),
                                            tier: "silver"
                                        });
                                        setNewBridal({ name: "", price: "", features: "" });
                                    }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input placeholder="Package Name" value={newBridal.name} onChange={(e) => setNewBridal({ ...newBridal, name: e.target.value })} className="w-full px-4 py-2 rounded-xl border bg-background" required />
                                        <input placeholder="Price" value={newBridal.price} onChange={(e) => setNewBridal({ ...newBridal, price: e.target.value })} className="w-full px-4 py-2 rounded-xl border bg-background" required />
                                        <textarea placeholder="Features (comma separated)" value={newBridal.features} onChange={(e) => setNewBridal({ ...newBridal, features: e.target.value })} className="w-full px-4 py-2 rounded-xl border bg-background sm:col-span-2" rows={2} />
                                        <button type="submit" className="sm:col-span-2 gradient-primary text-white rounded-xl py-2 flex items-center justify-center gap-2"><Plus size={18} /> Add Package</button>
                                    </form>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {bridalPackages.map((pkg) => (
                                        <div key={pkg.id} className="glass-card p-6 rounded-2xl relative">
                                            {editingBridalId === pkg.id ? (
                                                <div className="space-y-4">
                                                    <input
                                                        value={editBridalForm.name}
                                                        onChange={(e) => setEditBridalForm({ ...editBridalForm, name: e.target.value })}
                                                        className="w-full px-3 py-2 border rounded-lg bg-background"
                                                        placeholder="Package Name"
                                                    />
                                                    <input
                                                        value={editBridalForm.price}
                                                        onChange={(e) => setEditBridalForm({ ...editBridalForm, price: e.target.value })}
                                                        className="w-full px-3 py-2 border rounded-lg bg-background"
                                                        placeholder="Price"
                                                    />
                                                    <textarea
                                                        value={editBridalForm.features}
                                                        onChange={(e) => setEditBridalForm({ ...editBridalForm, features: e.target.value })}
                                                        className="w-full px-3 py-2 border rounded-lg bg-background"
                                                        rows={4}
                                                        placeholder="Features (comma separated)"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                updateBridalPackage(pkg.id, {
                                                                    name: editBridalForm.name,
                                                                    price: editBridalForm.price,
                                                                    features: editBridalForm.features.split(',').map(f => f.trim()).filter(Boolean)
                                                                });
                                                                setEditingBridalId(null);
                                                            }}
                                                            className="flex-1 bg-green-500 text-white rounded-lg py-2 text-sm font-semibold hover:bg-green-600 transition-colors"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingBridalId(null)}
                                                            className="flex-1 bg-secondary text-foreground rounded-lg py-2 text-sm font-semibold hover:bg-secondary/80 transition-colors border"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="absolute top-4 right-4 flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setEditingBridalId(pkg.id);
                                                                setEditBridalForm({ name: pkg.name, price: pkg.price, features: pkg.features.join(', ') });
                                                            }}
                                                            className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button onClick={() => removeBridalPackage(pkg.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                                    </div>
                                                    <h3 className="text-xl font-bold pr-16">{pkg.name}</h3>
                                                    <p className="text-primary font-bold text-2xl my-2">{pkg.price}</p>
                                                    <div className="mt-4 space-y-2">
                                                        <p className="text-sm font-semibold text-muted-foreground">Features:</p>
                                                        <ul className="text-sm space-y-1">
                                                            {pkg.features.map((f, idx) => (
                                                                <li key={idx} className="flex items-center gap-2">
                                                                    <Check size={14} className="text-primary" /> {f}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* Reviews Tab */}
                            <TabsContent value="reviews" className="space-y-6">
                                <div className="glass-card p-6 rounded-2xl">
                                    <h2 className="text-xl font-semibold mb-4">{editingReviewId ? "Edit Testimonial" : "Add New Testimonial"}</h2>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        if (editingReviewId) {
                                            updateReview(editingReviewId, editReviewForm);
                                            setEditingReviewId(null);
                                            setEditReviewForm({ name: "", text: "", rating: 5, showOnHomepage: true });
                                        } else {
                                            if (!newReview.name || !newReview.text) return;
                                            addReview({ ...newReview });
                                            setNewReview({ name: "", text: "", rating: 5, showOnHomepage: true });
                                        }
                                    }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input placeholder="Client Name" value={editingReviewId ? editReviewForm.name : newReview.name} onChange={(e) => editingReviewId ? setEditReviewForm({ ...editReviewForm, name: e.target.value }) : setNewReview({ ...newReview, name: e.target.value })} className="w-full px-4 py-2 rounded-xl border bg-background" required />
                                        <input type="number" min="1" max="5" placeholder="Rating (1-5)" value={editingReviewId ? editReviewForm.rating : newReview.rating} onChange={(e) => editingReviewId ? setEditReviewForm({ ...editReviewForm, rating: Number(e.target.value) }) : setNewReview({ ...newReview, rating: Number(e.target.value) })} className="w-full px-4 py-2 rounded-xl border bg-background" required />
                                        <textarea placeholder="Review Text" value={editingReviewId ? editReviewForm.text : newReview.text} onChange={(e) => editingReviewId ? setEditReviewForm({ ...editReviewForm, text: e.target.value }) : setNewReview({ ...newReview, text: e.target.value })} className="w-full px-4 py-2 rounded-xl border bg-background sm:col-span-2" rows={3} required />

                                        <div className="sm:col-span-2 flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="showOnHomepage"
                                                checked={editingReviewId ? editReviewForm.showOnHomepage : newReview.showOnHomepage}
                                                onChange={(e) => editingReviewId ? setEditReviewForm({ ...editReviewForm, showOnHomepage: e.target.checked }) : setNewReview({ ...newReview, showOnHomepage: e.target.checked })}
                                                className="w-4 h-4 cursor-pointer"
                                            />
                                            <label htmlFor="showOnHomepage" className="cursor-pointer text-sm font-medium">Show on Homepage</label>
                                        </div>

                                        <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
                                            <button type="submit" className="flex-1 gradient-primary text-white rounded-xl py-2 flex items-center justify-center gap-2">
                                                {editingReviewId ? <><Check size={18} /> Update Review</> : <><Plus size={18} /> Add Review</>}
                                            </button>
                                            {editingReviewId && (
                                                <button type="button" onClick={() => { setEditingReviewId(null); setEditReviewForm({ name: "", text: "", rating: 5, showOnHomepage: true }); }} className="flex-1 border border-input bg-secondary text-foreground hover:bg-secondary/50 rounded-xl py-2 flex items-center justify-center gap-2 transition-colors">
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {reviews.map((r) => (
                                        <div key={r.id} className="glass-card p-6 rounded-2xl relative">
                                            <div className="absolute top-4 right-4 flex gap-2">
                                                <button onClick={() => {
                                                    setEditingReviewId(r.id);
                                                    setEditReviewForm({ name: r.name, text: r.text, rating: r.rating, showOnHomepage: r.showOnHomepage ?? false });
                                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                                }} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit size={16} /></button>
                                                <button onClick={() => removeReview(r.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                            <h3 className="text-lg font-bold pr-16">{r.name}</h3>
                                            <p className="text-amber-500 my-1">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                                            <p className="text-sm text-muted-foreground italic truncate">"{r.text}"</p>
                                            <div className="mt-2 text-xs text-muted-foreground">
                                                {r.showOnHomepage ? <span className="text-green-600 font-semibold">• Shown on Homepage</span> : <span>• Hidden from Homepage</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                        </div>
                    </Tabs>
                </div>
            </div>
            <Footer />
        </div >
    );
};

export default Admin;
