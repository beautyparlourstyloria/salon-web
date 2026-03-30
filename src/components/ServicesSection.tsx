import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import * as LucideIcons from "lucide-react";
import { useStore, ServiceCategory } from "@/lib/store";

const ServicesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const { categories, setSelectedServiceToBook } = useStore();

  const [activeTab, setActiveTab] = useState(categories[0]?.id || "hair");

  const activeCategory = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <section id="services" className="section-padding" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="font-body font-medium text-primary tracking-widest uppercase text-base mb-3">What We Offer</p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold">
            Our <span className="text-gradient-primary italic">Services</span>
          </h2>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-6 py-3 rounded-full text-base font-semibold transition-all ${activeTab === cat.id
                ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Service cards */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {activeCategory?.services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div>
                <h3 className="text-lg font-heading font-semibold mb-1">{service.name}</h3>
                <p className="text-2xl font-bold text-gradient-primary">{service.price}</p>
              </div>
              <a
                href="#booking"
                onClick={() => setSelectedServiceToBook(`${service.name} (${service.price})`)}
                className="mt-4 border border-primary/30 text-primary text-center py-2.5 rounded-full text-base font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Book Now
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
