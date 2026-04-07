import axios from 'axios';

// Use the window's hostname to allow local network testing from a mobile phone
const getBaseURL = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // If testing on a real live domain (like Netlify), and no live backend exists yet, 
    // it will still use a fallback (or local). Eventually, put the real backend URL here.
    if (window.location.hostname.includes('netlify.app')) {
        return 'https://styloria-api.herokuapp.com/api'; // Placeholder for future real backend
    }
    return `http://${window.location.hostname}:5001/api`;
};

const api = axios.create({
    baseURL: getBaseURL(), 
});

// Automatically inject JWT token from localStorage if valid
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('styloria-jwt-token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    verifyEmail: (token: string) => api.get(`/auth/verify-email/${token}`),
    forgotPassword: (data: { email: string }) => api.post('/auth/forgot-password', data),
    resetPassword: (token: string, data: any) => api.post(`/auth/reset-password/${token}`, data),
};

export const userAPI = {
    getAllUsers: () => api.get('/users'),
    updateProfileImage: (id: string, profileImage: string) => api.put(`/users/${id}/profile-image`, { profileImage })
};

export const bookingAPI = {
    createBooking: (data: any) => api.post('/bookings', data),
    getAllBookings: () => api.get('/bookings'),
    getUserBookings: (params: { email?: string; phone?: string }) => api.get('/bookings/user', { params }),
    updateBookingStatus: (id: string, status: string) => api.patch(`/bookings/${id}/status`, { status }),
    updateBookingDetails: (id: string, data: { date: string, time: string, service: string, beautician: string }) => api.put(`/bookings/${id}`, data)
};

export const adminAPI = {
    sendFeedbackEmail: (data: { to: string, subject: string, text: string }) => api.post('/admin/send-email', data)
};

export const bannerAPI = {
    getAllBanners: () => api.get('/banners'),
    addBanner: (data: { imageUrl: string; title?: string; subtitle?: string; description?: string; buttonText?: string; buttonUrl?: string }) => api.post('/banners', data),
    updateBanner: (id: string, data: { imageUrl?: string; title?: string; subtitle?: string; description?: string; buttonText?: string; buttonUrl?: string }) => api.put(`/banners/${id}`, data),
    deleteBanner: (id: string) => api.delete(`/banners/${id}`)
};

export const uploadAPI = {
    uploadImage: (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        return api.post('/upload', formData);
    }
};

export const dataAPI = {
    getAllData: () => api.get('/data/all'),
    // Media
    addMedia: (data: any) => api.post('/data/media', data),
    updateMedia: (id: string, data: any) => api.put(`/data/media/${id}`, data),
    deleteMedia: (id: string) => api.delete(`/data/media/${id}`),
    // Offers
    addOffer: (data: any) => api.post('/data/offer', data),
    updateOffer: (id: string, data: any) => api.put(`/data/offer/${id}`, data),
    deleteOffer: (id: string) => api.delete(`/data/offer/${id}`),
    // Bridal
    addBridal: (data: any) => api.post('/data/bridal', data),
    updateBridal: (id: string, data: any) => api.put(`/data/bridal/${id}`, data),
    deleteBridal: (id: string) => api.delete(`/data/bridal/${id}`),
    // Services
    addService: (categoryId: string, data: any) => api.post(`/data/category/${categoryId}/service`, data),
    updateService: (categoryId: string, serviceId: string, data: { name: string, price: string, endPrice?: string }) => api.put(`/data/category/${categoryId}/service/${serviceId}`, data),
    deleteService: (categoryId: string, serviceId: string) => api.delete(`/data/category/${categoryId}/service/${serviceId}`),
};

export default api;
