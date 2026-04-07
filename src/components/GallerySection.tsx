import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useStore } from "@/lib/store";

const GallerySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { media } = useStore();
  
  const displayImages = media.filter(m => m.isVisible !== false).slice(0, 6);

  return (
    <section id="gallery" className="section-padding" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="font-body font-medium text-primary tracking-widest uppercase text-base mb-3">Our Work</p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold">
            The <span className="text-gradient-primary italic">Gallery</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayImages.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${
                i === 0 ? "md:row-span-2" : ""
              }`}
            >
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-primary-foreground font-heading text-xl font-semibold">{img.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
