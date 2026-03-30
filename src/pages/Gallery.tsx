import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Play, X, Image as ImageIcon, Video } from "lucide-react";
import { useStore, MediaItem } from "@/lib/store";
import galleryMakeup from "@/assets/gallery-makeup.jpg";
import galleryHair from "@/assets/gallery-hair.jpg";
import galleryNails from "@/assets/gallery-nails.jpg";
import galleryFacial from "@/assets/gallery-facial.jpg";
import bridalImg from "@/assets/bridal-1.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const categories = ["All", "Makeup", "Bridal", "Hair", "Nails", "Skincare", "Studio"];

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);
  const { media } = useStore();

  const filtered = activeFilter === "All" ? media : media.filter((m) => m.category === activeFilter);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 px-4 gradient-hero">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-body font-medium text-primary tracking-widest uppercase text-base mb-3">
              Our Portfolio
            </p>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
              Photos & <span className="text-gradient-primary italic">Videos</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Browse our transformations, behind-the-scenes moments & creative artistry.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-16 md:top-20 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50 py-4 px-4">
        <div className="container mx-auto flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeFilter === cat
                  ? "gradient-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding">
        <div className="container mx-auto">
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setLightbox(item)}
                  className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                >
                  <img
                    src={item.src}
                    alt={item.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg">
                        <Play className="text-primary-foreground ml-1" size={24} />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-300 flex items-end p-4">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-primary-foreground font-heading text-sm font-semibold">
                        {item.label}
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        {item.type === "photo" ? (
                          <ImageIcon size={12} className="text-primary-foreground/70" />
                        ) : (
                          <Video size={12} className="text-primary-foreground/70" />
                        )}
                        <span className="text-primary-foreground/70 text-xs">{item.category}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground mt-12">No items in this category yet.</p>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-primary-foreground hover:text-primary transition-colors"
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={lightbox.src}
              alt={lightbox.label}
              className="max-w-full max-h-[85vh] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Gallery;
