import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { bannerAPI } from "@/services/api";

const HeroSection = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await bannerAPI.getAllBanners();
        setBanners(res.data);
      } catch (err) {
        console.error("Failed to fetch banners", err);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const currentBgImage = banners.length > 0 ? banners[currentIndex].imageUrl : heroBg;

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image slider */}
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          <img src={currentBgImage} alt="Styloria Salon Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4 pt-20">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex} 
            className="max-w-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-body font-medium text-lg md:text-xl text-primary mb-4 tracking-widest uppercase"
            >
              {banners[currentIndex]?.subtitle || "Premium Beauty Lounge"}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-[1.1] mb-6"
            >
              {banners[currentIndex]?.title ? (
                <span>{banners[currentIndex].title}</span>
              ) : (
                <>
                  Where Beauty
                  <br />
                  <span className="text-gradient-primary italic">Meets Confidence</span>
                </>
              )}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground max-w-lg mb-10 font-light"
            >
              {banners[currentIndex]?.description || "Experience luxury beauty treatments crafted with elegance and care at Pune's most exclusive salon."}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href={banners[currentIndex]?.buttonUrl || "#booking"}
                className="gradient-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
              >
                {banners[currentIndex]?.buttonText || "Book Appointment"}
              </a>
              {!banners[currentIndex]?.buttonText && (
                <a
                  href="#services"
                  className="border-2 border-primary/30 text-foreground px-8 py-4 rounded-full text-lg font-semibold hover:bg-secondary transition-colors"
                >
                  Our Services
                </a>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeroSection;
