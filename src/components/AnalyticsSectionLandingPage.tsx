"use client";

import { useEffect, useState } from "react";
import { Activity, MessageCircle, Users } from "lucide-react";
// import Odometer from "react-odometerjs"
//import "odometer/themes/odometer-theme-minimal.css"
import { useSpring, animated, config } from "@react-spring/web";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { pusherClient } from "@/lib/pusher/client";

// Dummy data generator
const generateRandomIncrease = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
type AnalyticsData = {
  totalUsers: number;
  totalMessages: number;
  totalFeedbacks: number;
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

export default function AnalyticsSection() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const { data } = await axios.get<ApiResponse>("/api/analytics");
        if (data.analyticsData) {
          setAnalyticsData(data.analyticsData);
        } else {
          setError("No analytics data available.");
        }
      } catch (err: Error | any) {
        console.error("Error fetching analytics:", err);
        setError(
          err.response?.data?.message ||
            "Failed to fetch analytics. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
    // Simulate real-time updates with random increases
    const interval = setInterval(() => {
      setTotalUsers((prev) => prev + generateRandomIncrease(5, 20));
      setTotalMessages((prev) => prev + generateRandomIncrease(10, 50));
      setTotalFeedbacks((prev) => prev + generateRandomIncrease(2, 10));
    }, 3000);
    console.log("📡 Subscribing to:", `analyticsChannel`);
    const channel = pusherClient.subscribe("analytics-channel");

    channel.bind("pusher:subscription_succeeded", () => {
      console.log("✅ Subscription succeeded!");
    });

    channel.bind("pusher:subscription_error", (err: Error) => {
      console.error("❌ Subscription error:", err);
    });

    // Bind to events
    channel.bind("stats-update", (data: AnalyticsData) => {
      // setAnalyticsData(prevData=>({
      //   prevData.totalUsers,
      //   prevData.totalMessages,
      //   prevData.totalFeedbacks
      // }))
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
    return () => clearInterval(interval);
  }, []);

  // Pusher implementation (commented out)
  /*
  useEffect(() => {
    // Import Pusher client-side
    const Pusher = require('pusher-js');
    
    // Initialize Pusher
    const pusher = new Pusher('your-app-key', {
      cluster: 'your-app-cluster',
    });

    // Subscribe to the channel
    
    // Bind to events
    channel.bind('stats-update', (data: any) => {
      setTotalUsers(data.totalUsers);
      setTotalMessages(data.totalMessages);
      setTotalFeedbacks(data.totalFeedbacks);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);
  */

  // Card animations
  const cardProps = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: config.gentle
  });
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-gray-900 to-gray-800 text-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25px 25px, white 2%, transparent 0%)",
              backgroundSize: "50px 50px"
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center mb-10 md:mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              <span className="text-sm text-gray-300">Live Platform Data</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Real-Time Platform Metrics
            </h2>

            <p className="text-gray-400 mt-3 text-center max-w-2xl">
              Watch our platform grow in real-time as users connect,
              communicate, and provide feedback
            </p>
          </div>
        </div>

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
              <AnimatedCounter value={analyticsData?.totalUsers || 0} />
            </div>
          </animated.div>

          {/* Total Messages */}
          <animated.div
            style={cardProps}
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
              <AnimatedCounter value={analyticsData?.totalMessages || 0} />
            </div>
          </animated.div>

          {/* Total Feedbacks */}
          <animated.div
            style={cardProps}
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
              <AnimatedCounter value={analyticsData?.totalFeedbacks || 0} />
            </div>
          </animated.div>
        </div>
      </div>
    </section>
  );
}
