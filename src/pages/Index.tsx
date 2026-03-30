import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import BridalSection from "@/components/BridalSection";
import GallerySection from "@/components/GallerySection";
import ReviewsSection from "@/components/ReviewsSection";
import MembershipSection from "@/components/MembershipSection";
import BookingSection from "@/components/BookingSection";
import ContactSection from "@/components/ContactSection";
import InstagramSection from "@/components/InstagramSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <BridalSection />
      <BookingSection />
      <GallerySection />
      <ReviewsSection />
      <MembershipSection />
      <InstagramSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
