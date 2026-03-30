import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";
import { useStore } from "@/lib/store";

const ReviewsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { reviews } = useStore();

  return (
    <section className="section-padding bg-secondary/30" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="font-body font-medium text-primary tracking-widest uppercase text-base mb-3">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold">
            What Our <span className="text-gradient-primary italic">Clients Say</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {(reviews.filter(r => r.showOnHomepage).length > 0 ? reviews.filter(r => r.showOnHomepage) : reviews.slice(0, 2)).map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="glass-card rounded-2xl p-8 relative"
            >
              <Quote size={32} className="text-primary/20 absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={16} className="fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed italic">"{review.text}"</p>
              <p className="font-heading font-semibold">{review.name}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <a href="/testimonials" className="inline-block mt-4 gradient-primary text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
            View All Testimonials
          </a>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
