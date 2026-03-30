import logo from "@/assets/logo.svg";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground py-12 px-4">
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <img src={logo} alt="Styloria" className="h-12 brightness-0 invert" />
        <div className="flex flex-wrap justify-center gap-6 text-base opacity-70">
          <Link to="/#home" className="hover:opacity-100 transition-opacity">Home</Link>
          <Link to="/#services" className="hover:opacity-100 transition-opacity">Services</Link>
          <Link to="/#bridal" className="hover:opacity-100 transition-opacity">Bridal</Link>
          <Link to="/gallery" className="hover:opacity-100 transition-opacity">Gallery</Link>
          <Link to="/testimonials" className="hover:opacity-100 transition-opacity">Testimonials</Link>
          <Link to="/offers" className="hover:opacity-100 transition-opacity">Offers</Link>
          <Link to="/#contact" className="hover:opacity-100 transition-opacity">Contact</Link>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-8 pt-8 text-center text-sm opacity-50 flex items-center justify-center gap-1">
        © 2026 Styloria. Made with <Heart size={14} className="text-primary" /> in Pune
      </div>
    </div>
  </footer>
);

export default Footer;
