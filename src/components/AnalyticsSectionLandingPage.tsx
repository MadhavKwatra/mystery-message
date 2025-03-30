"use client";

import React, { useEffect, useState } from "react";
import { Activity, Loader2, MessageCircle, Users } from "lucide-react";
import { useSpring, animated, config } from "@react-spring/web";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { pusherClient } from "@/lib/pusher/client";

const generateRandomIncrease = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
type AnalyticsData = {
  totalUsers: number;
  totalMessages: number;
  totalFeedbacks: number;
};

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
      setAnalyticsData((prevData) => ({
        totalUsers: (prevData?.totalUsers || 0) + (data?.totalUsers || 0),
        totalMessages:
          (prevData?.totalMessages || 0) + (data?.totalMessages || 0),
        totalFeedbacks:
          (prevData?.totalFeedbacks || 0) + (data?.totalFeedbacks || 0)
      }));
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // making it cool with real-time updates with random increases
    const interval = setInterval(() => {
      if (!analyticsData) return;

      setAnalyticsData((prev) => ({
        totalUsers: (prev?.totalUsers || 0) + generateRandomIncrease(2, 10),
        totalMessages:
          (prev?.totalMessages || 0) + generateRandomIncrease(10, 50),
        totalFeedbacks:
          (prev?.totalFeedbacks || 0) + generateRandomIncrease(2, 20)
      }));
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [analyticsData]);

  // Card animations
  const cardProps = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: config.gentle
  });
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 from-purple-100 to-pink-100 text-gray-800 dark:text-white relative overflow-hidden ">
      <div className="container max-w-5xl mx-auto px-4">
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
          <div className="flex flex-col items-center mb-8 md:mb-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full dark:bg-gray-800/50 bg-gray-800/80 border border-gray-950 dark:border-gray-700 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-400 dark:bg-green-500 mr-2 animate-pulse"></span>
              <span className="text-sm text-gray-100 dark:text-gray-300">
                Live Platform Data
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-500 dark:to-red-500 bg-clip-text text-transparent">
              Real-Time Platform Metrics
            </h2>

            <p className="dark:text-gray-400 text-gray-800 mt-3 text-center max-w-2xl">
              Watch our platform grow in real-time as users connect,
              communicate, and provide feedback
            </p>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-300">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {/* Total Users */}
            <animated.div
              style={cardProps}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 shadow-lg border border-purple-500/20 hover:border-purple-500/50 transition-all "
            >
              <div className="flex items-center justify-center mb-4">
                <div className="dark:bg-purple-900/50 bg-purple-900/90 p-4 rounded-full">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center dark:text-gray-300 mb-4">
                Total Users Joined
              </h3>
              <div className="text-4xl md:text-5xl font-bold text-center dark:text-purple-400 text-purple-700">
                <AnimatedCounter
                  value={analyticsData?.totalUsers || 0}
                  key={1}
                />
              </div>
            </animated.div>

            {/* Total Messages */}
            <animated.div
              style={cardProps}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 shadow-lg border border-blue-500/20 hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="dark:bg-blue-900/50 bg-blue-900/90 p-4 rounded-full">
                  <MessageCircle className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center dark:text-gray-300  mb-4">
                Anonymous Messages Sent
              </h3>

              <div className="text-4xl md:text-5xl font-bold text-center dark:text-blue-400 text-blue-700">
                <AnimatedCounter
                  value={analyticsData?.totalMessages || 0}
                  key={2}
                />
              </div>
            </animated.div>

            {/* Total Feedbacks */}
            <animated.div
              style={cardProps}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 shadow-lg border border-pink-500/20 hover:border-pink-500/50 transition-all"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="dark:bg-pink-900/50 bg-pink-900/90 p-4 rounded-full">
                  <Activity className="w-8 h-8 text-pink-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center dark:text-gray-300 mb-4">
                Anonymous Feedbacks Sent
              </h3>

              <div className="text-4xl md:text-5xl font-bold text-center dark:text-pink-400 text-pink-700">
                <AnimatedCounter
                  value={analyticsData?.totalFeedbacks || 0}
                  key={3}
                />
              </div>
            </animated.div>
          </div>
        )}
        <p className="text-gray-500 text-center max-w-2xl text-xs mt-2 w-2/3 mx-auto">
          * ( Currently adding a random number for every 5 seconds, to make it
          look cool. But they are live updates. You can try. )
        </p>
      </div>
    </section>
  );
}
