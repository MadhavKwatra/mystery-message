// components/OdometerWrapper.tsx
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Define prop types for Odometer
interface OdometerProps {
  value: number;
  format?: string;
  duration?: number;
  animation?: string;
  theme?: string;
  [key: string]: any; // For any additional props
}

// Create a client-side only Odometer component
// This will be undefined during server-side rendering, used only when isClient is true
const ClientSideOdometer = dynamic<OdometerProps>(
  () => import("react-odometerjs").then((mod) => mod.default),
  { ssr: false }
);

export default function OdometerWrapper(props: OdometerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This code runs only on client-side
    setIsClient(true);
    // Import the CSS
    import("odometer/themes/odometer-theme-minimal.css").catch((err) =>
      console.error("Failed to load odometer CSS:", err)
    );
  }, []);

  if (!isClient) {
    // Return a placeholder when rendering on the server or during hydration
    return <div className="odometer-placeholder">{props.value}</div>;
  }

  // Only render the actual Odometer on the client side
  return <ClientSideOdometer {...props} />;
}
