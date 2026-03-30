import React, { createContext, useContext, useEffect, useState } from "react";
import galleryMakeup from "@/assets/gallery-makeup.jpg";
import galleryHair from "@/assets/gallery-hair.jpg";
import galleryNails from "@/assets/gallery-nails.jpg";
import galleryFacial from "@/assets/gallery-facial.jpg";
import bridalImg from "@/assets/bridal-1.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import { Scissors, Sparkles, Heart, Flower2 } from "lucide-react";

export type MediaItem = {
    id: string;
    src: string;
    type: "photo" | "video";
    label: string;
    category: string;
};

export type Service = {
    id: string;
    name: string;
    price: string;
};

export type ServiceCategory = {
    id: string;
    label: string;
    iconName: string; // Storing string for lucide icon
    services: Service[];
};

export type Booking = {
    id: string;
    name: string;
    phone: string;
    email?: string;
    service: string;
    date: string;
    time: string;
    beautician: string;
    status: "Pending" | "Confirmed" | "Completed" | "Cancelled" | "Declined";
};

export type Offer = {
    id: string;
    iconName: string;
    title: string;
    price: string;
    originalPrice?: string;
    desc: string;
    tag?: string;
    tagColor?: string;
    isMembership?: boolean;
};

export type BridalPackage = {
    id: string;
    name: string;
    price: string;
    tier: "silver" | "gold" | "platinum";
    popular?: boolean;
    features: string[];
};

export type Review = {
    id: string;
    name: string;
    text: string;
    rating: number;
    showOnHomepage?: boolean;
};

export type User = {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    profileImage?: string;
    role?: string;
};

export type AppNotification = {
    id: string;
    userId: string;
    message: string;
    isRead: boolean;
    date: string;
};

type StoreContextType = {
    media: MediaItem[];
    addMedia: (item: Omit<MediaItem, "id">) => void;
    updateMedia: (id: string, updatedItem: Partial<Omit<MediaItem, "id">>) => void;
    removeMedia: (id: string) => void;
    categories: ServiceCategory[];
    addService: (categoryId: string, service: Omit<Service, "id">) => void;
    removeService: (categoryId: string, serviceId: string) => void;
    updateServicePrice: (categoryId: string, serviceId: string, newPrice: string) => void;
    updateServiceDetails: (categoryId: string, serviceId: string, name: string, price: string) => void;
    bookings: Booking[];
    addBooking: (booking: Omit<Booking, "id" | "status">) => void;
    updateBookingStatus: (id: string, status: Booking["status"]) => void;
    updateBooking: (id: string, date: string, time: string) => void;
    updateBookingDetails: (id: string, date: string, time: string, service: string, beautician: string) => void;
    offers: Offer[];
    addOffer: (offer: Omit<Offer, "id">) => void;
    removeOffer: (id: string) => void;
    updateOffer: (id: string, offer: Partial<Offer>) => void;
    bridalPackages: BridalPackage[];
    addBridalPackage: (pkg: Omit<BridalPackage, "id">) => void;
    removeBridalPackage: (id: string) => void;
    updateBridalPackage: (id: string, updatedFields: Partial<BridalPackage>) => void;
    reviews: Review[];
    addReview: (review: Omit<Review, "id">) => void;
    removeReview: (id: string) => void;
    updateReview: (id: string, updatedFields: Partial<Review>) => void;
    currentUser: User | null;
    users: User[];
    loginUser: (user: User) => void;
    logoutUser: () => void;
    updateUser: (email: string, name: string, phone?: string, profileImage?: string) => void;
    selectedServiceToBook: string | null;
    setSelectedServiceToBook: (service: string | null) => void;
    notifications: AppNotification[];
    markNotificationAsRead: (id: string) => void;
};

const initialBridalPackages: BridalPackage[] = [
    {
        id: "b1",
        name: "Silver Bridal",
        price: "₹14,999",
        tier: "silver",
        features: ["Bridal Makeup", "Hairstyling", "Draping", "Nail Art", "Complimentary Trial"],
    },
    {
        id: "b2",
        name: "Gold Bridal",
        price: "₹19,999",
        tier: "gold",
        popular: true,
        features: ["Bridal Makeup", "Hairstyling", "Draping", "Nail Art", "Complimentary Trial", "Hair Spa", "Facial"],
    },
    {
        id: "b3",
        name: "Platinum Bridal",
        price: "₹29,999",
        tier: "platinum",
        features: [
            "Airbrush Bridal Makeup",
            "Premium Hairstyling",
            "Draping",
            "Nail Extensions",
            "2 Trial Sessions",
            "Pre-Bridal Package",
            "Skincare Routine",
        ],
    },
];

const initialReviews: Review[] = [
  {
    id: "r1",
    name: "Priya Sharma",
    text: "Absolutely loved my bridal makeup! The team at Styloria made me feel like a queen on my special day. Highly recommend their platinum package.",
    rating: 5,
    showOnHomepage: true,
  },
  {
    id: "r2",
    name: "Ananya Patel",
    text: "Best hair spa experience ever! My hair has never felt so silky and healthy. The ambiance is so luxurious and calming.",
    rating: 5,
    showOnHomepage: true,
  },
  {
    id: "r3",
    name: "Meera Kulkarni",
    text: "The hydra facial treatment was incredible. My skin was glowing for weeks! The staff is so professional and friendly.",
    rating: 5,
    showOnHomepage: true,
  },
  {
    id: "r4",
    name: "Sneha Deshmukh",
    text: "I'm a regular for their nail art services. Always creative, clean, and on-trend designs. Love this place!",
    rating: 5,
    showOnHomepage: true,
  },
];

const initialMedia: MediaItem[] = [
    { id: "1", src: galleryMakeup, type: "photo", label: "Bridal Glam Makeup", category: "Makeup" },
    { id: "2", src: bridalImg, type: "photo", label: "Bridal Elegance", category: "Bridal" },
    { id: "3", src: galleryHair, type: "photo", label: "Hair Styling", category: "Hair" },
    { id: "4", src: galleryNails, type: "photo", label: "Nail Art Design", category: "Nails" },
    { id: "5", src: galleryFacial, type: "photo", label: "Skincare Glow", category: "Skincare" },
    { id: "6", src: heroBg, type: "photo", label: "Studio Ambience", category: "Studio" },
    { id: "7", src: galleryMakeup, type: "photo", label: "Party Makeup", category: "Makeup" },
    { id: "8", src: galleryHair, type: "photo", label: "Colour & Highlights", category: "Hair" },
    { id: "9", src: bridalImg, type: "photo", label: "Engagement Look", category: "Bridal" },
];

const initialCategories: ServiceCategory[] = [
    {
        id: "hair",
        label: "💇‍♀️ Hair",
        iconName: "Scissors",
        services: [
            { id: "s1", name: "Haircut", price: "₹499" },
            { id: "s2", name: "Hair Spa", price: "₹1,299" },
            { id: "s3", name: "Hair Smoothening", price: "₹4,999" },
            { id: "s4", name: "Hair Coloring", price: "₹2,499" },
            { id: "s5", name: "Keratin Treatment", price: "₹5,999" },
        ],
    },
    {
        id: "makeup",
        label: "💄 Makeup",
        iconName: "Sparkles",
        services: [
            { id: "s6", name: "Party Makeup", price: "₹2,999" },
            { id: "s7", name: "Engagement Makeup", price: "₹4,999" },
            { id: "s8", name: "Bridal HD Makeup", price: "₹9,999" },
            { id: "s9", name: "Airbrush Bridal", price: "₹12,999" },
        ],
    },
    {
        id: "nails",
        label: "💅 Nails",
        iconName: "Heart",
        services: [
            { id: "s10", name: "Manicure", price: "₹799" },
            { id: "s11", name: "Pedicure", price: "₹999" },
            { id: "s12", name: "Nail Extensions", price: "₹1,999" },
            { id: "s13", name: "Gel Polish", price: "₹699" },
        ],
    },
    {
        id: "skin",
        label: "🌸 Skin & Facial",
        iconName: "Flower2",
        services: [
            { id: "s14", name: "Cleanup", price: "₹899" },
            { id: "s15", name: "Fruit Facial", price: "₹1,299" },
            { id: "s16", name: "Gold Facial", price: "₹1,999" },
            { id: "s17", name: "Hydra Facial", price: "₹3,999" },
        ],
    },
];

const initialOffers: Offer[] = [
    { id: "o1", iconName: "Gem", title: "Monthly Glow Membership", price: "₹1,999/mo", originalPrice: "₹2,800/mo", desc: "1 Facial + 1 Hair Spa + 10% off all services", tag: "Membership", tagColor: "bg-primary", isMembership: true },
    { id: "o2", iconName: "Gift", title: "Bridal Membership", price: "₹9,999", desc: "Complete pre-bridal care package over 3 months", tag: "Festival Offer", tagColor: "bg-primary", isMembership: true },
    { id: "o3", iconName: "Percent", title: "First Visit Offer", price: "20% OFF", desc: "Flat 20% discount on your first appointment", tag: "New Clients", tagColor: "bg-accent", isMembership: true },
    { id: "o4", iconName: "Users", title: "Refer & Earn", price: "₹500 OFF", desc: "Get ₹500 off for every friend you refer", tag: "Always Active", tagColor: "bg-emerald-500", isMembership: true },
    { id: "o5", iconName: "Sparkles", title: "Summer Glow Package", price: "₹2,499", originalPrice: "₹3,500", desc: "Facial + Hair Spa + Manicure — Beat the heat with radiant skin & hair", tag: "Summer Special", tagColor: "bg-amber-500", isMembership: false },
    { id: "o6", iconName: "Heart", title: "Valentine's Duo", price: "₹3,999", originalPrice: "₹5,500", desc: "Couple makeover — Makeup + Hair styling for two", tag: "Limited Time", tagColor: "bg-rose-500", isMembership: false },
];

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    const [media, setMedia] = useState<MediaItem[]>(() => {
        const saved = localStorage.getItem("styloria-media");
        return saved ? JSON.parse(saved) : initialMedia;
    });

    const [categories, setCategories] = useState<ServiceCategory[]>(() => {
        const saved = localStorage.getItem("styloria-categories");
        return saved ? JSON.parse(saved) : initialCategories;
    });

    const [bookings, setBookings] = useState<Booking[]>(() => {
        const saved = localStorage.getItem("styloria-bookings");
        return saved ? JSON.parse(saved) : [];
    });

    const [offers, setOffers] = useState<Offer[]>(() => {
        const saved = localStorage.getItem("styloria-offers");
        return saved ? JSON.parse(saved) : initialOffers;
    });

    const [bridalPackages, setBridalPackages] = useState<BridalPackage[]>(() => {
        const saved = localStorage.getItem("styloria-bridal");
        return saved ? JSON.parse(saved) : initialBridalPackages;
    });

    const [reviews, setReviews] = useState<Review[]>(() => {
        const saved = localStorage.getItem("styloria-reviews");
        return saved ? JSON.parse(saved) : initialReviews;
    });

    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const saved = localStorage.getItem("styloria-current-user");
        return saved ? JSON.parse(saved) : null;
    });

    const [users, setUsers] = useState<User[]>(() => {
        const saved = localStorage.getItem("styloria-users");
        return saved ? JSON.parse(saved) : [];
    });

    const [notifications, setNotifications] = useState<AppNotification[]>(() => {
        const saved = localStorage.getItem("styloria-notifications");
        return saved ? JSON.parse(saved) : [];
    });

    const [selectedServiceToBook, setSelectedServiceToBook] = useState<string | null>(null);

    useEffect(() => {
        localStorage.setItem("styloria-media", JSON.stringify(media));
    }, [media]);

    useEffect(() => {
        localStorage.setItem("styloria-categories", JSON.stringify(categories));
    }, [categories]);

    useEffect(() => {
        localStorage.setItem("styloria-bookings", JSON.stringify(bookings));
    }, [bookings]);

    useEffect(() => {
        localStorage.setItem("styloria-offers", JSON.stringify(offers));
    }, [offers]);

    useEffect(() => {
        localStorage.setItem("styloria-bridal", JSON.stringify(bridalPackages));
    }, [bridalPackages]);

    useEffect(() => {
        localStorage.setItem("styloria-reviews", JSON.stringify(reviews));
    }, [reviews]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem("styloria-current-user", JSON.stringify(currentUser));
        } else {
            localStorage.removeItem("styloria-current-user");
        }
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem("styloria-users", JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem("styloria-notifications", JSON.stringify(notifications));
    }, [notifications]);

    const addMedia = (item: Omit<MediaItem, "id">) => {
        setMedia((prev) => [...prev, { ...item, id: Date.now().toString() }]);
    };

    const updateMedia = (id: string, updatedItem: Partial<Omit<MediaItem, "id">>) => {
        setMedia((prev) => prev.map(m => m.id === id ? { ...m, ...updatedItem } : m));
    };

    const removeMedia = (id: string) => {
        setMedia((prev) => prev.filter((m) => m.id !== id));
    };

    const addService = (categoryId: string, service: Omit<Service, "id">) => {
        setCategories((prev) =>
            prev.map((c) =>
                c.id === categoryId
                    ? { ...c, services: [...c.services, { ...service, id: Date.now().toString() }] }
                    : c
            )
        );
    };

    const removeService = (categoryId: string, serviceId: string) => {
        setCategories((prev) =>
            prev.map((c) =>
                c.id === categoryId
                    ? { ...c, services: c.services.filter((s) => s.id !== serviceId) }
                    : c
            )
        );
    };

    const updateServicePrice = (categoryId: string, serviceId: string, newPrice: string) => {
        setCategories((prev) =>
            prev.map((c) =>
                c.id === categoryId
                    ? {
                        ...c,
                        services: c.services.map((s) =>
                            s.id === serviceId ? { ...s, price: newPrice } : s
                        ),
                    }
                    : c
            )
        );
    };

    const updateServiceDetails = (categoryId: string, serviceId: string, name: string, price: string) => {
        setCategories((prev) =>
            prev.map((c) =>
                c.id === categoryId
                    ? {
                        ...c,
                        services: c.services.map((s) =>
                            s.id === serviceId ? { ...s, name, price } : s
                        ),
                    }
                    : c
            )
        );
    };

    const addBooking = (booking: Omit<Booking, "id" | "status">) => {
        setBookings((prev) => [
            ...prev,
            { ...booking, id: Date.now().toString(), status: "Pending" },
        ]);
    };

    const updateBookingStatus = (id: string, status: Booking["status"]) => {
        setBookings((prev) => {
            const booking = prev.find(b => b.id === id);

            if (booking && booking.status !== status) {
                const userId = booking.email || booking.phone;
                if (userId) {
                    let message = "";
                    if (status === "Confirmed") {
                        message = `Your booking for ${booking.service} on ${booking.date} at ${booking.time} has been confirmed.`;
                    } else if (status === "Declined") {
                        message = `Your booking for ${booking.service} on ${booking.date} at ${booking.time} has been declined.`;
                    } else if (status === "Cancelled") {
                        message = `Your booking for ${booking.service} on ${booking.date} at ${booking.time} has been cancelled.`;
                    }

                    if (message) {
                        setNotifications(n => [
                            {
                                id: Date.now().toString(),
                                userId,
                                message,
                                isRead: false,
                                date: new Date().toISOString()
                            },
                            ...n
                        ]);
                    }
                }
            }

            return prev.map((b) => (b.id === id ? { ...b, status } : b));
        });
    };

    const updateBooking = (id: string, date: string, time: string) => {
        setBookings((prev) =>
            prev.map((b) => (b.id === id ? { ...b, date, time } : b))
        );
    };

    const updateBookingDetails = (id: string, date: string, time: string, service: string, beautician: string) => {
        setBookings((prev) =>
            prev.map((b) => (b.id === id ? { ...b, date, time, service, beautician } : b))
        );
    };

    const addOffer = (offer: Omit<Offer, "id">) => {
        setOffers((prev) => [...prev, { ...offer, id: Date.now().toString() }]);
    };

    const removeOffer = (id: string) => {
        setOffers((prev) => prev.filter((o) => o.id !== id));
    };

    const updateOffer = (id: string, updatedFields: Partial<Offer>) => {
        setOffers((prev) =>
            prev.map((o) => (o.id === id ? { ...o, ...updatedFields } : o))
        );
    };

    const addBridalPackage = (pkg: Omit<BridalPackage, "id">) => {
        setBridalPackages((prev) => [...prev, { ...pkg, id: Date.now().toString() }]);
    };

    const removeBridalPackage = (id: string) => {
        setBridalPackages((prev) => prev.filter((b) => b.id !== id));
    };

    const updateBridalPackage = (id: string, updatedFields: Partial<BridalPackage>) => {
        setBridalPackages((prev) =>
            prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b))
        );
    };

    const addReview = (review: Omit<Review, "id">) => {
        setReviews((prev) => [...prev, { ...review, id: Date.now().toString() }]);
    };

    const removeReview = (id: string) => {
        setReviews((prev) => prev.filter((r) => r.id !== id));
    };

    const updateReview = (id: string, updatedFields: Partial<Review>) => {
        setReviews((prev) =>
            prev.map((r) => (r.id === id ? { ...r, ...updatedFields } : r))
        );
    };

    const loginUser = (user: User) => {
        setCurrentUser(user);
        setUsers((prev) => {
            if (!prev.some((u) => u.email === user.email)) {
                return [...prev, user];
            }
            return prev;
        });
    };

    const logoutUser = () => {
        setCurrentUser(null);
        localStorage.removeItem("styloria-jwt-token");
        localStorage.removeItem("styloria-role");
    };

    const updateUser = (email: string, name: string, phone?: string, profileImage?: string) => {
        setUsers((prev) => prev.map((u) => (u.email === email ? { ...u, name, phone, profileImage: profileImage || u.profileImage } : u)));
        if (currentUser?.email === email) {
            setCurrentUser({ ...currentUser, name, phone, profileImage: profileImage || currentUser.profileImage });
        }
    };

    const markNotificationAsRead = (id: string) => {
        setNotifications((prev) => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    return (
        <StoreContext.Provider
            value={{
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
                addBooking,
                updateBookingStatus,
                updateBooking,
                updateBookingDetails,
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
                currentUser,
                users,
                loginUser,
                logoutUser,
                updateUser,
                selectedServiceToBook,
                setSelectedServiceToBook,
                notifications,
                markNotificationAsRead,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error("useStore must be used within StoreProvider");
    return context;
};
