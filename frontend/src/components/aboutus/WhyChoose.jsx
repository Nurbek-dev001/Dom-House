import React from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Shield, 
  Clock, 
  Users, 
  MapPin, 
  TrendingUp,
  Award,
  Lock
} from "lucide-react";

export default function WhyChoose() {
  const reasons = [
    {
      icon: Zap,
      title: "Lightning Fast Search",
      description: "Find your perfect property in seconds with our advanced AI-powered search algorithm"
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "All transactions are protected with military-grade encryption and legal agreements"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Our dedicated support team is always available to help with any questions"
    },
    {
      icon: Users,
      title: "Verified Sellers",
      description: "Every seller on DomHouse is thoroughly verified and authenticated"
    },
    {
      icon: MapPin,
      title: "Location Intelligence",
      description: "Get detailed neighborhood information and insights for every property"
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Stay informed with real-time market trends and property value analytics"
    },
    {
      icon: Award,
      title: "Award-Winning Platform",
      description: "Recognized as Kazakhstan's most trusted real estate platform"
    },
    {
      icon: Lock,
      title: "Legal Protection",
      description: "Automatic payment contracts and legal documentation for every rental"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Why Choose DomHouse?</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-600 to-cyan-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover what makes DomHouse the #1 choice for property seekers across Kazakhstan
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-teal-200"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {reason.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonial Quote Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-12 text-white text-center"
        >
          <p className="text-2xl font-semibold mb-4 italic">
            "DomHouse revolutionized how I find rentals. The platform is user-friendly, 
            the properties are verified, and the payment contracts give me peace of mind."
          </p>
          <p className="text-lg font-medium">— Aidos Kalikhov, Satisfied Tenant</p>
          <div className="flex justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-2xl">⭐</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
