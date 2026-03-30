import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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

const MembershipSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { offers } = useStore();
  const membershipOffers = offers.filter((o) => o.isMembership);

  return (
    <section id="membership" className="section-padding" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="font-body font-medium text-primary tracking-widest uppercase text-base mb-3">Exclusive</p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold">
            Membership & <span className="text-gradient-primary italic">Offers</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {membershipOffers.map((offer, i) => {
            const IconComponent = iconMap[offer.iconName] || Star;
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="glass-card rounded-2xl p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all group relative overflow-hidden"
              >
                {offer.tag && (
                  <div className="mb-4">
                    <span className={`inline-block ${offer.tagColor || "bg-primary"} text-primary-foreground text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full`}>
                      {offer.tag}
                    </span>
                  </div>
                )}
                <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <IconComponent className="text-primary-foreground" size={24} />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-1">{offer.title}</h3>
                <div className="flex items-baseline justify-center gap-2 mb-3">
                  <span className="text-2xl font-bold text-gradient-primary">{offer.price}</span>
                  {offer.originalPrice && (
                    <span className="text-muted-foreground line-through text-xs font-semibold">
                      {offer.originalPrice}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{offer.desc}</p>
              </motion.div>
            );
          })}
        </div>
        <div className="text-center mt-12">
          <a href="/offers" className="inline-block mt-4 gradient-primary text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
            View All Offers
          </a>
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;
