import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Heart, Award } from "lucide-react";

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-secondary/30" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="font-body font-medium text-primary tracking-widest uppercase text-base mb-3">About Us</p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Welcome to <span className="text-gradient-primary italic">Styloria</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-12">
            Styloria is a luxury women's salon dedicated to enhancing natural beauty with elegance
            and care. Our expert beauticians blend artistry with premium products to deliver
            transformative experiences in a serene, opulent setting.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { icon: Sparkles, title: "Premium Products", desc: "Only the finest international beauty brands" },
            { icon: Heart, title: "Expert Care", desc: "Highly trained and passionate beauticians" },
            { icon: Award, title: "Award Winning", desc: "Recognized for excellence in beauty services" },
          ].map((item) => (
            <div
              key={item.title}
              className="glass-card rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-5">
                <item.icon className="text-primary-foreground" size={24} />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
