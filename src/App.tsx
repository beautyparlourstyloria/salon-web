import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Offers from "./pages/Offers";
import Gallery from "./pages/Gallery";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Testimonials from "./pages/Testimonials";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResetPassword from "./pages/auth/ResetPassword";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { StoreProvider } from "./lib/store";

const queryClient = new QueryClient();

const App = () => (
  <GoogleOAuthProvider clientId="YOUR_CLIENT_ID_HERE">
    <StoreProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>

              <Route path="/" element={<Index />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/profile" element={
                <>
                  <Navbar />
                  <Profile />
                  <Footer />
                </>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </StoreProvider>
  </GoogleOAuthProvider>
);

export default App;
