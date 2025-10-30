import React from "react";
import { motion } from "framer-motion";

// ⭐ Star Icon
const StarIcon = ({ className = "w-5 h-5 text-yellow-400" }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
  </svg>
);

// 🌟 Testimonial Card
const TestimonialCard = ({ rating, text, author, role, image }) => (
  <motion.div
    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    {/* Top Content */}
    <div>
      {/* Stars */}
      <div className="flex mb-3">
        {[...Array(rating)].map((_, i) => (
          <StarIcon key={i} />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
        “{text}”
      </p>
    </div>

    {/* Author Info */}
    <div className="flex items-center mt-auto">
      {image ? (
        <img
          src={image}
          alt={author}
          className="w-12 h-12 rounded-full object-cover mr-4 border border-gray-200 shadow-sm"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-bold mr-4 shadow-sm">
          {author.charAt(0)}
        </div>
      )}
      <div>
        <p className="font-semibold text-blue-600 text-base">{author}</p>
        <p className="text-xs text-gray-400">{role}</p>
      </div>
    </div>
  </motion.div>
);

// 💬 Review Section
const Review = () => {
  const testimonials = [
    {
      id: 1,
      rating: 4,
      text: "Homzy made my apartment hunt super easy. Found a great place in my budget within a week!",
      author: "Priya Sharma",
      role: "Renter",
      image: "/images/priya.jfif", // 👈 Replace with real image path
    },
    {
      id: 2,
      rating: 5,
      text: "Selling my property was quick and stress-free thanks to Homzy's professional support.",
      author: "Atul Khatri",
      role: "Seller",
      image: "/images/Atul.jfif",
    },
    {
      id: 3,
      rating: 4,
      text: "Needed a space for my cafe. They guided me through perfect options and lease process effortlessly.",
      author: "Muskan Choudhary",
      role: "Business Owner",
      image: "/images/Muskan.jfif",
    },
    {
      id: 4,
      rating: 5,
      text: "As a first-time home buyer, I couldn’t have asked for a smoother experience. Highly recommend!",
      author: "Amit Patel",
      role: "Home Buyer",
      image: "/images/Amit.jfif",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-white py-20 px-6 sm:px-10 lg:px-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/30 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/20 blur-[150px] rounded-full"></div>

      {/* Header */}
      <header className="text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
          What Our Clients Say
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          Real stories from happy customers who found their dream property with Homzy.
        </p>
      </header>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} {...testimonial} />
        ))}
      </div>
    </section>
  );
};

export default Review;

