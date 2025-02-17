import { Metadata } from "next";
import Analytics from "./Analytics";
import { APP_NAME } from "@/config/config";

const AnalyticsPage = () => {
  return <Analytics />;
};
export default AnalyticsPage;

export const metadata: Metadata = {
  title: "Analytics - " + APP_NAME,
  description: "Analytics of your visitors",
};
