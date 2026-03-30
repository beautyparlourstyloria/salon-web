import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, MessageCircle, Instagram } from "lucide-react";

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="section-padding bg-secondary/30" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="font-body font-medium text-primary tracking-widest uppercase text-base mb-3">Get In Touch</p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold">
            Contact <span className="text-gradient-primary italic">Us</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="text-primary-foreground" size={20} />
              </div>
              <div>
                <h4 className="font-heading font-semibold mb-1">Visit Us</h4>
                <p className="text-muted-foreground text-sm">Kamaldeep Plaza, Rambag Colony, Sadashiv Peth, Pune, Maharashtra - 411030</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shrink-0">
                <Phone className="text-primary-foreground" size={20} />
              </div>
              <div>
                <h4 className="font-heading font-semibold mb-1">Call Us</h4>
                <p className="text-muted-foreground text-sm">+91 90114 93241</p>
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href="https://wa.me/919011493241"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 gradient-primary text-primary-foreground rounded-2xl p-5 flex items-center justify-center gap-3 font-semibold hover:opacity-90 transition-opacity"
              >
                <MessageCircle size={20} />
                WhatsApp
              </a>
              <a
                href="https://www.instagram.com/poojasathe_makeupartist/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 border-2 border-primary/30 rounded-2xl p-5 flex items-center justify-center gap-3 font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram size={20} />
                Instagram
              </a>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="rounded-2xl overflow-hidden h-80 lg:h-full min-h-[320px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.4552991829696!2d73.84477129999999!3d18.5083163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c1001c563b3f%3A0xcade663d76ab7439!2sKamaldeep%20Plaza!5e0!3m2!1sen!2sin!4v1772176697561!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Styloria Location"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
