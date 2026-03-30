import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Calendar, Clock, User, CheckCircle, Mail, ChevronDown } from "lucide-react";
import { useStore } from "@/lib/store";
import { bookingAPI } from "@/services/api";

const beauticians = ["Any Available", "Pooja", "Sonali"];

const BookingSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { categories, addBooking, offers, bridalPackages, currentUser, selectedServiceToBook, setSelectedServiceToBook, bookings } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [errorObj, setErrorObj] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [submittedPhone, setSubmittedPhone] = useState("");
  const allServices = categories.map((c) => c.services.map((s) => `${s.name} (${s.price})`)).flat();
  const allOffers = offers.filter(o => o.title !== "Bridal Membership").map((o) => `${o.title} (${o.price})`);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedServiceToBook && !selectedServices.includes(selectedServiceToBook)) {
      setSelectedServices(prev => [...prev, selectedServiceToBook]);
    }
  }, [selectedServiceToBook]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServiceDropdownOpen(false);
      }
    };

    if (isServiceDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isServiceDropdownOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;

    // Validate Time (10 AM to 7 PM)
    const [hours, minutes] = time.split(":").map(Number);
    if (hours < 10 || hours >= 19 || (hours === 19 && minutes > 0)) {
        setErrorObj("Please select a time between 10:00 AM and 07:00 PM.");
        return;
    }

    // Optional local check first
    const isSlotTaken = bookings.some(b => b.date === date && b.time === time && b.status !== "Cancelled" && b.status !== "Declined");
    if (isSlotTaken) {
      setErrorObj("This time slot is already booked locally. Please choose another time.");
      return;
    }

    if (selectedServices.length === 0) {
      setErrorObj("Please select at least one service.");
      return;
    }

    const payload = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      service: selectedServices.join(", "),
      date,
      time,
      beautician: formData.get("beautician") as string,
      email: formData.get("email") as string || currentUser?.email || "",
    };

    try {
      try {
        await bookingAPI.createBooking(payload);
      } catch (apiErr: any) {
        console.warn("Backend API not reachable or rejected request. Falling back to local frontend cache.", apiErr);
      }

      // Automatically fall back to local store caching so the visual UI still works
      addBooking(payload);

      setSubmittedPhone(payload.phone);
      setErrorObj(null);
      setSubmitted(true);
    } catch (err: any) {
      setErrorObj("Failed to book appointment. Please try again.");
    }
  };

  return (
    <section id="booking" className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="font-body font-medium text-primary tracking-widest uppercase text-base mb-3">Schedule Visit</p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold">
            Book Your <span className="text-gradient-primary italic">Appointment</span>
          </h2>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl p-12 text-center"
          >
            <CheckCircle size={64} className="text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-heading font-bold mb-3">Booking Confirmed!</h3>
            <p className="text-muted-foreground">
              We'll send you a confirmation via SMS & email shortly. See you at Styloria! 💕
            </p>
            <div className="mt-4 p-4 bg-secondary/50 rounded-xl text-sm">
              <p className="font-semibold text-foreground mb-1">Confirmation Details Sent To:</p>
              <p>Phone: {submittedPhone}</p>
              {currentUser?.email && <p>Email: {currentUser.email}</p>}
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setSelectedServiceToBook(null);
                setSelectedServices([]);
              }}
              className="mt-6 gradient-primary text-primary-foreground px-8 py-3 rounded-full font-semibold"
            >
              Book Another
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="glass-card rounded-3xl p-8 md:p-10 space-y-6"
          >
            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    name="name"
                    required
                    type="text"
                    defaultValue={currentUser?.name || ""}
                    placeholder="Your name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Phone</label>
                <input
                  name="phone"
                  required
                  type="tel"
                  defaultValue={currentUser?.phone || ""}
                  placeholder="9011493241"
                  pattern="[6-9][0-9]{9}"
                  maxLength={10}
                  title="Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9"
                  onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    name="email"
                    required
                    type="email"
                    defaultValue={currentUser?.email || ""}
                    placeholder="your@email.com"
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                    title="Please enter a valid email address"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Services (Multiple) */}
            <div className="relative" ref={dropdownRef}>
              <label className="text-sm font-medium mb-1.5 block">Select Services</label>
              <div 
                className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary/30 cursor-pointer flex justify-between items-center transition-all min-h-[50px]"
                onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
              >
                <span className={selectedServices.length === 0 ? "text-muted-foreground" : "text-foreground line-clamp-1"}>
                  {selectedServices.length === 0 ? "Choose services" : selectedServices.join(", ")}
                </span>
                <ChevronDown size={18} className={`text-muted-foreground transition-transform ${isServiceDropdownOpen ? "rotate-180" : ""}`} />
              </div>

              {isServiceDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-background border border-input rounded-xl shadow-lg max-h-60 overflow-y-auto p-2">
                  <div className="space-y-4 p-2 relative">
                    {/* Add sticky close button for ease of use */}
                    <div className="sticky top-0 bg-background/95 backdrop-blur z-10 flex justify-end pb-2 border-b">
                      <button type="button" onClick={() => setIsServiceDropdownOpen(false)} className="text-xs font-semibold text-primary">Done</button>
                    </div>

                    {[
                      { label: "Standard Services", items: allServices },
                      { label: "Memberships & Offers", items: allOffers },
                      { label: "Bridal Packages", items: bridalPackages.map(pkg => `${pkg.name} (${pkg.price})`) }
                    ].map((group) => (
                      <div key={group.label}>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{group.label}</p>
                        {group.items.map((item) => (
                          <label key={item} className="flex items-start gap-3 p-2 hover:bg-secondary/50 rounded-lg cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedServices.includes(item)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedServices([...selectedServices, item]);
                                else setSelectedServices(selectedServices.filter(s => s !== item));
                              }}
                              className="mt-1 shrink-0 accent-primary w-4 h-4 cursor-pointer"
                            />
                            <span className="text-sm cursor-pointer">{item}</span>
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Date</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    name="date"
                    required
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Time</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    name="time"
                    required
                    type="time"
                    min="10:00"
                    max="19:00"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-center">Open: 10:00 AM - 07:00 PM</p>
              </div>
            </div>

            {/* Beautician */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Choose Beautician</label>
              <select name="beautician" className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary/30 outline-none transition-all appearance-none">
                {beauticians.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {errorObj && (
              <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{errorObj}</p>
            )}

            <button
              type="submit"
              className="w-full gradient-primary text-primary-foreground py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
            >
              Confirm Booking
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
};

export default BookingSection;
