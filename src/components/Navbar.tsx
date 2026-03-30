import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User as UserIcon, LogOut, Bell } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.svg";
import { useStore } from "@/lib/store";
import { authAPI } from "@/services/api";

const navLinks = [
  { label: "Home", href: "/#home", isHash: true },
  { label: "Services", href: "/#services", isHash: true },
  { label: "Bridal", href: "/#bridal", isHash: true },
  { label: "Gallery", href: "/gallery", isHash: false },
  { label: "Offers", href: "/offers", isHash: false },
  { label: "Contact", href: "/#contact", isHash: true },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser, loginUser, logoutUser, users, notifications, markNotificationAsRead } = useStore();
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgotPassword" | null>(null);
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
  const [loginError, setLoginError] = useState<string | null>(null);

  const userNotifications = currentUser ? notifications.filter(n => n.userId === currentUser.email || n.userId === currentUser.phone) : [];
  const unreadNotifications = userNotifications.filter(n => !n.isRead);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (authMode === "forgotPassword") {
      try {
        const res = await authAPI.forgotPassword({ email: authForm.email });
        if (res.data.demoResetUrl && res.data.demoResetToken) {
          alert(`DEMO MODE: Click OK to simulate clicking your password reset link!\n\nLink: ${res.data.demoResetUrl}`);
          setAuthMode(null);
          navigate(`/reset-password/${res.data.demoResetToken}`);
        } else {
          alert("Reset link sent! Please check your email.");
          setAuthMode("login");
        }
      } catch (err: any) {
        setLoginError(err.response?.data?.message || "An error occurred.");
      }
      return;
    }

    if (!authForm.email || !authForm.password) return;

    try {
      if (authMode === "register") {
        if (!authForm.name || !authForm.phone) return;
        if (authForm.password !== authForm.confirmPassword) {
          setLoginError("Passwords do not match!");
          return;
        }

        // Backend Register
        const res = await authAPI.register({
          name: authForm.name,
          email: authForm.email,
          phone: authForm.phone,
          password: authForm.password,
        });

        // Alert user to check email (and provide demo link if available)
        if (res.data.demoVerifyUrl && res.data.demoVerifyToken) {
          alert(`DEMO MODE: Click OK to simulate clicking your email verification link!\n\nLink: ${res.data.demoVerifyUrl}`);
          setAuthMode(null);
          navigate(`/verify-email/${res.data.demoVerifyToken}`);
        } else {
          alert("Registration successful! Please check your email inbox to verify your account.");
          setAuthMode("login");
          setLoginError("Registration successful! Please check your email to verify before logging in.");
        }
      } else {
        // Backend Login
        const loginRes = await authAPI.login({
          email: authForm.email,
          password: authForm.password,
        });

        const { token, user } = loginRes.data;
        localStorage.setItem("styloria-jwt-token", token);
        loginUser(user);
        setAuthMode(null);
      }

      setAuthForm({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
    } catch (err: any) {
      setLoginError(err.response?.data?.message || "An error occurred during authentication.");
    }
  };

  const renderNotifications = (isMobile = false) => {
    if (!currentUser) return null;
    const dropdownId = isMobile ? 'notif-dropdown-mobile' : 'notif-dropdown';
    return (
      <div className="relative">
        <button
          onClick={() => {
            const dropdown = document.getElementById(dropdownId);
            if (dropdown) dropdown.classList.toggle('hidden');
          }}
          className="relative p-2 text-foreground/70 hover:text-primary transition-colors focus:outline-none"
        >
          <Bell size={20} />
          {unreadNotifications.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </button>
        <div id={dropdownId} className={`hidden absolute ${isMobile ? 'right-0 -mr-4 md:mr-0' : 'right-0'} top-full mt-4 w-72 max-h-80 overflow-y-auto bg-background border border-border rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200`}>
          <div className="p-3 border-b border-border font-semibold text-sm">Notifications</div>
          {userNotifications.length > 0 ? (
            userNotifications.map(n => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-3 border-b border-border/50 text-sm cursor-pointer transition-colors hover:bg-secondary ${n.isRead ? 'opacity-70' : 'bg-primary/5'}`}
              >
                <p className="mb-1 text-foreground/90">{n.message}</p>
                <span className="text-xs text-muted-foreground">{new Date(n.date).toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">No notifications yet.</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between h-16 lg:h-20 px-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="Styloria" className="h-14 lg:h-14 w-auto" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) =>
              link.isHash ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-base font-body font-medium text-foreground/70 hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-base font-body font-medium text-foreground/70 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
            {currentUser ? (
              <div className="flex items-center gap-4 relative">
                {/* Notifications */}
                {renderNotifications(false)}

                <div className="relative">
                  <button
                    onClick={() => {
                      const dropdown = document.getElementById('user-dropdown');
                      if (dropdown) dropdown.classList.toggle('hidden');
                    }}
                    className="text-sm font-medium text-foreground flex items-center gap-2 hover:text-primary transition-colors focus:outline-none"
                  >
                    {currentUser.profileImage ? (
                      <img src={currentUser.profileImage} alt="Profile" className="w-6 h-6 rounded-full object-cover border border-primary/20" />
                    ) : (
                      <UserIcon size={18} />
                    )}
                    Hi, {currentUser.name || "User"}
                  </button>
                  <div id="user-dropdown" className="hidden absolute right-0 top-full mt-4 w-40 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button onClick={() => {
                      navigate("/profile");
                      const dropdown = document.getElementById('user-dropdown');
                      if (dropdown) dropdown.classList.add('hidden');
                    }} className="w-full px-4 py-3 flex items-center gap-2 text-sm text-foreground hover:bg-secondary transition-colors text-left border-b border-border">
                      <UserIcon size={16} /> My Profile
                    </button>
                    <button onClick={() => {
                      logoutUser();
                      const dropdown = document.getElementById('user-dropdown');
                      if (dropdown) dropdown.classList.add('hidden');
                    }} className="w-full px-4 py-3 flex items-center gap-2 text-sm text-red-500 hover:bg-secondary transition-colors text-left">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAuthMode("login")}
                className="text-base font-body font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <UserIcon size={18} /> Sign In
              </button>
            )}
            <Link
              to="/#booking"
              className="gradient-primary text-primary-foreground px-6 py-2.5 rounded-full text-base font-semibold hover:opacity-90 transition-opacity"
            >
              Book Now
            </Link>
          </div>

          {/* ALWAYS VISIBLE RIGHT ACTIONS (Notifications + Mobile Toggle) */}
          <div className="flex items-center gap-2 lg:hidden">
            {renderNotifications(true)}
            <button
              onClick={() => setOpen(!open)}
              className="text-foreground p-2"
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background border-b border-border overflow-hidden"
            >
              <div className="flex flex-col gap-1 p-4">
                {navLinks.map((link) =>
                  link.isHash ? (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="py-3 px-4 rounded-lg text-foreground/70 hover:bg-secondary hover:text-primary transition-colors font-medium"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setOpen(false)}
                      className="py-3 px-4 rounded-lg text-foreground/70 hover:bg-secondary hover:text-primary transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  )
                )}
                {currentUser ? (
                  <div className="flex items-center justify-between py-3 px-4 border-t border-border mt-2">
                    <span className="text-sm font-medium text-foreground flex items-center gap-2">
                      {currentUser.profileImage ? (
                        <img src={currentUser.profileImage} alt="Profile" className="w-6 h-6 rounded-full object-cover border border-primary/20" />
                      ) : (
                        <UserIcon size={18} />
                      )}
                      Hi, {currentUser.name || "User"}
                    </span>
                    <div className="flex gap-3">
                      <button onClick={() => { navigate("/profile"); setOpen(false); }} className="text-primary text-sm font-medium">Profile</button>
                      <button onClick={() => { logoutUser(); setOpen(false); }} className="text-red-500 text-sm font-medium">Logout</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setAuthMode("login"); setOpen(false); }}
                    className="py-3 px-4 rounded-lg text-left text-foreground hover:bg-secondary hover:text-primary transition-colors font-medium flex items-center gap-2"
                  >
                    <UserIcon size={18} /> Sign In / Register
                  </button>
                )}
                <Link
                  to="/#booking"
                  onClick={() => setOpen(false)}
                  className="gradient-primary text-primary-foreground px-6 py-3 rounded-full text-center font-semibold mt-2"
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Auth Modal Overlay */}
      <AnimatePresence>
        {authMode && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-sm p-8 rounded-3xl relative"
            >
              <button onClick={() => setAuthMode(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold font-heading mb-6 text-center">
                {authMode === "login" ? "Welcome Back" : authMode === "register" ? "Create Account" : "Reset Password"}
              </h2>
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === "register" && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                      <input
                        type="text" required value={authForm.name}
                        onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-input outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Contact Number</label>
                      <input
                        type="tel" required value={authForm.phone}
                        onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-input outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    {authMode === "login" ? "Email Address or Phone Number" : "Email Address"}
                  </label>
                  <input
                    type={authMode === "login" ? "text" : "email"} required value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-input outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  {authMode === "forgotPassword" && <p className="text-xs text-muted-foreground mt-2">Enter your email and we'll send you a password reset link.</p>}
                </div>
                {authMode !== "forgotPassword" && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Password</label>
                      <input
                        type="password" required value={authForm.password}
                        onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-input outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      {authMode === "login" && (
                        <div className="flex justify-end mt-2">
                          <button type="button" onClick={() => setAuthMode("forgotPassword")} className="text-sm text-primary font-medium hover:underline">
                            Forgot your password?
                          </button>
                        </div>
                      )}
                    </div>
                    {authMode === "register" && (
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Confirm Password</label>
                        <input
                          type="password" required value={authForm.confirmPassword}
                          onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-background border border-input outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    )}
                  </>
                )}
                {loginError && (
                  <p className="text-red-500 text-sm py-2 rounded-lg bg-red-50 px-3 mt-4 mb-2">{loginError}</p>
                )}
                <button type="submit" className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold mt-4">
                  {authMode === "login" ? "Sign In" : authMode === "register" ? "Register" : "Send Reset Link"}
                </button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-6">
                {authMode === "login" ? "Don't have an account?" : authMode === "register" ? "Already have an account?" : "Remember your password?"}
                <button
                  onClick={() => {
                    setAuthMode(authMode === "login" ? "register" : "login");
                    setLoginError(null);
                  }}
                  className="text-primary font-semibold ml-1 hover:underline"
                >
                  {authMode === "login" ? "Sign up" : "Log in"}
                </button>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
