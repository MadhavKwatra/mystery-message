"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Activity, MessageCircle, Users } from "lucide-react";
// import Odometer from "react-odometerjs"

const Odometer = dynamic(import("react-odometerjs"), {
  ssr: false,
  loading: () => 0
});
// import "odometer/themes/odometer-theme-minimal.css"
// Dummy data generator
const generateRandomIncrease = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function OdometerAnalytics() {
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
    const channel = pusher.subscribe('analytics-channel');
    
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

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Real-Time Platform Metrics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Total Users */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-lg border border-purple-500/20 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-purple-900/50 p-4 rounded-full">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-center text-gray-300 mb-4">
              Total Users
            </h3>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-purple-500/10 rounded-lg"></div>
              <div className="relative bg-gray-900/80 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex justify-center">
                  <div className="odometer-wheel text-4xl md:text-5xl font-bold text-center text-purple-400">
                    <Odometer
                      value={totalUsers}
                      format="(,ddd)"
                      duration={1000}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Messages */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-lg border border-blue-500/20 hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-900/50 p-4 rounded-full">
                <MessageCircle className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-center text-gray-300 mb-4">
              Messages Sent
            </h3>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-blue-500/10 rounded-lg"></div>
              <div className="relative bg-gray-900/80 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex justify-center">
                  <div className="odometer-wheel text-4xl md:text-5xl font-bold text-center text-blue-400">
                    <Odometer
                      value={totalMessages}
                      format="(,ddd)"
                      duration={1000}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Feedbacks */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-lg border border-pink-500/20 hover:border-pink-500/50 transition-all">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-pink-900/50 p-4 rounded-full">
                <Activity className="w-8 h-8 text-pink-400" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-center text-gray-300 mb-4">
              Feedbacks Received
            </h3>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-pink-500/5 to-pink-500/10 rounded-lg"></div>
              <div className="relative bg-gray-900/80 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex justify-center">
                  <div className="odometer-wheel text-4xl md:text-5xl font-bold text-center text-pink-400">
                    <Odometer
                      value={totalFeedbacks}
                      format="(,ddd)"
                      duration={1000}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
