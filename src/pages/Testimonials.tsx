import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useStore } from "@/lib/store";

const Testimonials = () => {
    const { reviews } = useStore();

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-28 pb-16 px-4 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <p className="font-body font-medium text-primary tracking-widest uppercase text-sm mb-3">Client Love</p>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                        All <span className="text-gradient-primary italic">Testimonials</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        See what all our wonderful clients have to say about their experience at Styloria.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review, i) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="glass-card rounded-2xl p-6 relative flex flex-col h-full"
                        >
                            <Quote size={28} className="text-primary/20 absolute top-6 right-6" />
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: review.rating }).map((_, j) => (
                                    <Star key={j} size={16} className="fill-accent text-accent" />
                                ))}
                            </div>
                            <p className="text-muted-foreground mb-6 leading-relaxed flex-grow text-sm">"{review.text}"</p>
                            <div className="mt-auto">
                                <p className="font-heading font-semibold text-lg">{review.name}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {reviews.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>No testimonials available yet.</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Testimonials;
