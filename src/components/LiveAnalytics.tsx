import { useState, useEffect } from "react";
import axios from "axios";
import CountUp from "react-countup";
import { ApiResponse } from "@/types/ApiResponse";

type AnalyticsData = {
  totalUsers: number;
  totalMessages: number;
  totalFeedbacks: number;
};

export default function LiveAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="text-center">
        <p className="text-3xl font-bold">
          <CountUp end={analyticsData!.totalUsers} duration={2} separator="," />
        </p>
        <p className="text-sm text-gray-500">Total Users Joined</p>
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold">
          <CountUp
            end={analyticsData!.totalMessages}
            duration={2}
            separator=","
          />
        </p>
        <p className="text-sm text-gray-500">Total Anonymous Messages</p>
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold">
          <CountUp
            end={analyticsData!.totalFeedbacks}
            duration={2}
            separator=","
          />
        </p>
        <p className="text-sm text-gray-500">Total Anonymous Feedbacks</p>
      </div>
    </div>
  );
}
