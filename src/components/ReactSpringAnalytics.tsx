"use client";

import { useEffect, useState } from "react";
import { Activity, MessageCircle, Users } from "lucide-react";
import { useSpring, animated, config } from "@react-spring/web";

// Dummy data generator
const generateRandomIncrease = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Animated counter component using React Spring
const AnimatedCounter = ({ value }: { value: number }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 200,
    config: config.molasses
  });

  return (
    <animated.div>
      {number.to((n) =>
        n.toLocaleString("en-US", { maximumFractionDigits: 0 })
      )}
    </animated.div>
  );
};

export default function ReactSpringAnalytics() {
  const [totalUsers, setTotalUsers] = useState(12500);
  const [totalMessages, setTotalMessages] = useState(48750);
  const [totalFeedbacks, setTotalFeedbacks] = useState(8320);

  useEffect(() => {
    // Simulate real-time updates with random increases
    const interval = setInterval(() => {
      setTotalUsers((prev) => prev + generateRandomIncrease(5, 20));
      setTotalMessages((prev) => prev + generateRandomIncrease(10, 50));
      setTotalFeedbacks((prev) => prev + generateRandomIncrease(2, 10));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Card animations
  const cardProps = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: config.gentle
  });

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Real-Time Platform Metrics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Total Users */}
          <animated.div
            style={cardProps}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-lg border border-purple-500/20 hover:border-purple-500/50 transition-all"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="bg-purple-900/50 p-4 rounded-full">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-center text-gray-300 mb-4">
              Total Users
            </h3>
            <div className="text-4xl md:text-5xl font-bold text-center text-purple-400">
              <AnimatedCounter value={totalUsers} />
            </div>
          </animated.div>

          {/* Total Messages */}
          <animated.div
            style={{ ...cardProps, delay: 100 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-lg border border-blue-500/20 hover:border-blue-500/50 transition-all"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-900/50 p-4 rounded-full">
                <MessageCircle className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-center text-gray-300 mb-4">
              Messages Sent
            </h3>
            <div className="text-4xl md:text-5xl font-bold text-center text-blue-400">
              <AnimatedCounter value={totalMessages} />
            </div>
          </animated.div>

          {/* Total Feedbacks */}
          <animated.div
            style={{ ...cardProps, delay: 200 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-lg border border-pink-500/20 hover:border-pink-500/50 transition-all"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="bg-pink-900/50 p-4 rounded-full">
                <Activity className="w-8 h-8 text-pink-400" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-center text-gray-300 mb-4">
              Feedbacks Received
            </h3>
            <div className="text-4xl md:text-5xl font-bold text-center text-pink-400">
              <AnimatedCounter value={totalFeedbacks} />
            </div>
          </animated.div>
        </div>
      </div>
    </section>
  );
}
