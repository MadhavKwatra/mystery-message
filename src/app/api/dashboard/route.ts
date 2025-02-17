// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { User } from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import Visit from "@/model/Visit";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // get current logged in user
    const session = await getServerSession(authOptions);

    //   asserting
    const user: User = session?.user as User;

    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    //   COnverting to objectID for using in aggregation Pipeline
    const username = user.username;

    console.log("logged in user", username);

    // Total Visits
    const totalVisits = await Visit.countDocuments({ userId: username });

    // Unique Visitors (by IP)
    const uniqueVisitorsResult = await Visit.distinct("ip", {
      userId: username,
    });
    const uniqueVisitors = uniqueVisitorsResult.length;

    // Group by device sorted by count descending
    const devices = await Visit.aggregate([
      { $match: { userId: username } },
      {
        $group: {
          _id: { $ifNull: ["$device", "Unknown"] }, // Handle missing device field
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          device: "$_id",
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Group by country sorted by count descending
    const countries = await Visit.aggregate([
      { $match: { userId: username } },
      { $group: { _id: "$country", count: { $sum: 1 } } },
      {
        $project: {
          country: "$_id",
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Group by traffic source sorted by count descending
    const trafficSources = await Visit.aggregate([
      { $match: { userId: username } },
      {
        $group: {
          _id: { $ifNull: ["$trafficSource", "Unknown"] },
          count: { $sum: 1 },
        },
      },

      {
        $project: {
          trafficSource: "$_id",
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Daily Visits for the last 7 days sorted by date
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const dailyVisits = await Visit.aggregate([
      {
        $match: { createdAt: { $gte: last7Days } },
      },
      {
        // Convert createdAt from UTC to IST (add 330 minutes)
        $project: {
          createdAtIST: {
            $dateAdd: {
              startDate: "$createdAt",
              unit: "minute",
              amount: 330, // Add 5 hours and 30 minutes to convert to IST
            },
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAtIST" }, // Group by date in IST
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
    ]);

    // Group by OS Name sorted by count descending
    const osName = await Visit.aggregate([
      {
        $group: {
          _id: { $ifNull: ["$osName", "Unknown"] }, // Extract OS from userAgent
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          os: "$_id",
          count: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Top 5 Peak Hours sorted by count descending
    const peakHours = await Visit.aggregate([
      {
        $project: {
          // Convert the UTC createdAt time to IST (UTC +5:30)
          hour: {
            $hour: {
              $dateAdd: {
                startDate: "$createdAt",
                unit: "minute",
                amount: 330,
              },
            },
          },
        },
      },
      {
        $group: {
          _id: "$hour",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          hour: "$_id",
          count: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ]);
    console.log(
      {
        totalVisits,
        uniqueVisitors,
        devices,
        countries,
        trafficSources,
        peakHours,
        osName,
        dailyVisits,
      },
      "dashboard data",
    );

    return NextResponse.json({
      success: true,
      message: "Dashboard data fetched successfully",
      dashboardData: {
        totalVisits,
        uniqueVisitors,
        devices,
        countries,
        trafficSources,
        peakHours,
        osName,
        dailyVisits,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching dashboard data" },
      { status: 500 },
    );
  }
}
