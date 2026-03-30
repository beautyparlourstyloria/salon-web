import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Styloria Salon" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
      </div>

      <div className="relative container mx-auto px-4 pt-20">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-body font-medium text-lg md:text-xl text-primary mb-4 tracking-widest uppercase"
          >
            Premium Beauty Lounge
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-[1.1] mb-6"
          >
            Where Beauty
            <br />
            <span className="text-gradient-primary italic">Meets Confidence</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-lg mb-10 font-light"
          >
            Experience luxury beauty treatments crafted with elegance and care at Pune's most exclusive salon.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#booking"
              className="gradient-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
            >
              Book Appointment
            </a>
            <a
              href="#services"
              className="border-2 border-primary/30 text-foreground px-8 py-4 rounded-full text-lg font-semibold hover:bg-secondary transition-colors"
            >
              Our Services
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
