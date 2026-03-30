import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import galleryMakeup from "@/assets/gallery-makeup.jpg";
import galleryHair from "@/assets/gallery-hair.jpg";
import galleryNails from "@/assets/gallery-nails.jpg";
import galleryFacial from "@/assets/gallery-facial.jpg";
import bridalImg from "@/assets/bridal-1.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const posts = [
  { img: galleryMakeup, likes: "1,245" },
  { img: galleryHair, likes: "987" },
  { img: bridalImg, likes: "2,103" },
  { img: galleryNails, likes: "756" },
  { img: galleryFacial, likes: "1,534" },
  { img: heroBg, likes: "1,892" },
];

const InstagramSection = () => {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-body font-medium text-primary tracking-widest uppercase text-base mb-2">
            Follow Us
          </p>
          <h2 className="text-2xl md:text-5xl font-heading font-bold mb-4">
            <span className="text-gradient-primary">@poojasathe_makeupartist</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-10">
            Stay inspired — follow our latest looks, transformations & behind-the-scenes on Instagram.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
          {posts.map((post, i) => (
            <motion.a
              key={i}
              href="https://www.instagram.com/poojasathe_makeupartist/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative aspect-square rounded-xl overflow-hidden"
            >
              <img
                src={post.img}
                alt="Instagram post"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/50 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-primary-foreground font-semibold">
                  <Instagram size={22} />
                  <span>♥ {post.likes}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.a
          href="https://www.instagram.com/poojasathe_makeupartist/"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 gradient-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold mt-10 hover:opacity-90 transition-opacity"
        >
          <Instagram size={20} />
          Follow on Instagram
        </motion.a>
      </div>
    </section>
  );
};

export default InstagramSection;
