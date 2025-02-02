import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { UAParser as uaParser } from "ua-parser-js";
import geoIp from "geoip-country";
import Visit from "@/model/Visit";

export async function POST(req: Request) {
  console.log("📢 Track Visit API called");

  try {
    await dbConnect();

    const headers: Headers = req.headers;

    // Extract the relevant headers
    const userAgent: string = headers.get("user-agent") || "Unknown";
    const referer: string = headers.get("referer") || "";
    let ipAddress: string = headers.get("x-forwarded-for") || "Unknown";
    if (ipAddress === "::1") {
      ipAddress = "127.0.0.1";
    }
    // determine the country from the IP address
    const geo = geoIp.lookup(ipAddress);
    const country = geo ? geo.country : "Unknown";

    // Parse the user-agent
    const ua = uaParser(userAgent);
    const device = ua.device.type || "Unknown";

    const trafficSource = referer ? new URL(referer).hostname : "Direct";

    const body = await req.json();
    const { userId } = body;
    console.log(
      "Visit details:",
      {
        userId,
        userAgent,
        country,
        device,
        trafficSource,
        geo,
        ua,
        ipAddress,
      },
      "For Deployed testing"
    );
    const newVisit = new Visit({
      userId,
      userAgent,
      country,
      device,
      ip: ipAddress,
      trafficSource,
    });
    await newVisit.save();
    return Response.json(
      { success: true, message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error analyzing visit", error);
    return Response.json(
      { success: false, message: "Error analyzing visit" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  // Handle GET requests here
  return NextResponse.json({ message: "Track visit successful!" });
}
