import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import galleryNails from "@/assets/gallery-nails.jpg";
import galleryHair from "@/assets/gallery-hair.jpg";
import galleryFacial from "@/assets/gallery-facial.jpg";
import galleryMakeup from "@/assets/gallery-makeup.jpg";
import bridalImg from "@/assets/bridal-1.jpg";

const images = [
  { src: galleryMakeup, alt: "Makeup artistry", label: "Makeup" },
  { src: bridalImg, alt: "Bridal look", label: "Bridal" },
  { src: galleryNails, alt: "Nail art", label: "Nails" },
  { src: galleryHair, alt: "Hair styling", label: "Hair" },
  { src: galleryFacial, alt: "Skincare treatments", label: "Skincare" },
];

const GallerySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

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
          {images.map((img, i) => (
            <motion.div
              key={img.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${
                i === 0 ? "md:row-span-2" : ""
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
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
