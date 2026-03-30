import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useStore } from "@/lib/store";
import { Gem, Gift, Percent, Users, Sparkles, Calendar, Star, Heart } from "lucide-react";

const iconMap: Record<string, any> = {
  Gem,
  Gift,
  Percent,
  Users,
  Sparkles,
  Calendar,
  Star,
  Heart,
};

const Offers = () => {
  const { offers, setSelectedServiceToBook } = useStore();
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 px-4 gradient-hero">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-body font-medium text-primary tracking-widest uppercase text-base mb-3">
              Exclusive Deals
            </p>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
              Offers & <span className="text-gradient-primary italic">Packages</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Seasonal specials, festival packages & memberships — because you deserve to glow every day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, i) => {
              const IconComponent = iconMap[offer.iconName] || Star;
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="glass-card rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all group relative overflow-hidden"
                >
                  {offer.tag && (
                    <span
                      className={`absolute top-4 right-4 ${offer.tagColor || "bg-primary"} text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full`}
                    >
                      {offer.tag}
                    </span>
                  )}
                  <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <IconComponent className="text-primary-foreground" size={24} />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-2">{offer.title}</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-3xl font-bold text-gradient-primary">{offer.price}</span>
                    {offer.originalPrice && (
                      <span className="text-muted-foreground line-through text-sm">
                        {offer.originalPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">{offer.desc}</p>
                  <a
                    href="/#booking"
                    onClick={() => setSelectedServiceToBook(`${offer.title} (${offer.price})`)}
                    className="inline-block mt-5 gradient-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Book Now
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Offers;
