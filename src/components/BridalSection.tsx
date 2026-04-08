import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Crown, Check } from "lucide-react";
import bridalImg from "@/assets/bridal-1.jpg";
import { useStore } from "@/lib/store";

const tierColors = {
  silver: "from-gray-300 to-gray-400",
  gold: "from-amber-400 to-yellow-500",
  platinum: "from-slate-300 via-slate-100 to-slate-400",
};

const BridalSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { setSelectedServiceToBook, bridalPackages } = useStore();

  return (
    <section id="bridal" className="section-padding bg-secondary/30 relative overflow-hidden" ref={ref}>
      {/* Decorative image */}
      <div className="absolute right-0 top-0 w-1/3 h-full hidden lg:block opacity-20">
        <img src={bridalImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-secondary/30" />
      </div>

      <div className="container mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="font-body font-medium text-primary tracking-widest uppercase text-base mb-3">For Your Special Day</p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold">
            Bridal <span className="text-gradient-primary italic">Packages</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {bridalPackages.filter(p => p.isVisible !== false).map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className={`relative glass-card rounded-3xl p-8 flex flex-col ${pkg.popular ? "ring-2 ring-primary shadow-xl shadow-primary/10 scale-105" : ""
                }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <div className="flex items-center gap-2 mb-4">
                <Crown
                  size={20}
                  className={`bg-gradient-to-r ${tierColors[pkg.tier]} bg-clip-text`}
                  style={{ color: pkg.tier === "gold" ? "#d4a517" : pkg.tier === "platinum" ? "#8a8a9a" : "#a0a0a0" }}
                />
                <h3 className="text-xl font-heading font-bold">{pkg.name}</h3>
              </div>

              <p className="text-3xl font-bold text-gradient-primary mb-3">{pkg.price}</p>
              {pkg.note && <p className="text-xs text-muted-foreground mb-4 bg-secondary/50 p-2 rounded-md italic ring-1 ring-border">Note: {pkg.note}</p>}

              <ul className="space-y-3 mb-8 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check size={16} className="text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/#booking"
                onClick={() => setSelectedServiceToBook(`${pkg.name} (${pkg.price})`)}
                className={`text-center py-3 rounded-full font-semibold transition-all ${pkg.popular
                  ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "border-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
              >
                Book Package
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BridalSection;
