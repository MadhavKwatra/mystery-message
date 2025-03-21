import { clsx, type ClassValue } from "clsx";
import { getCldImageUrl } from "next-cloudinary";
import { twMerge } from "tailwind-merge";
import countries from "i18n-iso-countries";
(async () => {
  try {
    const locale = await import("i18n-iso-countries/langs/en.json");
    countries.registerLocale(locale);
    console.log("Countries initialized");
  } catch (error) {
    console.error("Error initializing countries:", error);
  }
})(); // Call the IIFE immediately

export function alpha2ToCountryName(
  alpha2Code: string | null | undefined
): string {
  if (!alpha2Code) {
    return "Unknown";
  }

  const countryName = countries.getName(alpha2Code, "en");
  return countryName || "Unknown";
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPublicIdFromUrl(url: string) {
  const startIndex = url.indexOf("spill-it-uploads/");
  if (startIndex !== -1) {
    return url.substring(startIndex);
  }
  return null;
}

export function getOptimizedAvatarImageUrl(url: string) {
  const publicId = getPublicIdFromUrl(url);

  return getCldImageUrl({
    width: 150,
    height: 150,
    src: publicId ?? "",
    format: "auto",
    crop: "auto",
    quality: "auto"
  });
}
type ChartData<T extends string> = {
  [key in T]: string | null; // The key we're mapping from (e.g., "device", "trafficSource")
} & { count: number }; // The count field

export const generateChartConfig = <T extends string>(
  data: ChartData<T>[]
): Record<string, { label: string; color?: string }> => {
  const defaultConfig: Record<string, { label: string; color?: string }> = {
    count: { label: "Visitors" },
    unknown: { label: "Unknown", color: "hsl(var(--chart-5))" }
  };
  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))"
  ];
  // Auto-detect key by looking at the first object (excluding "count")
  const key = Object.keys(data[0]).find((k) => k !== "count");

  let colorIndex = 0;
  const uniqueItems = new Set();

  const chartConfig: Record<string, { label: string; color: string }> = {};
  data.forEach((item) => {
    if (!key) return defaultConfig; // Ensure key is defined
    let value =
      String(item[key as keyof ChartData<T>] as string)?.toLowerCase() ||
      "unknown";
    // Normalize key values
    value = value.replace(/[^a-zA-Z0-9]/g, "-");
    if (!uniqueItems.has(value)) {
      uniqueItems.add(value);
      chartConfig[value] = {
        label: value.charAt(0).toUpperCase() + value.slice(1), // Capitalize first letter
        color: colors[colorIndex % colors.length] // Cycle colors using modulo
      };
      colorIndex++; // Move to the next color
    }
  });

  return { ...defaultConfig, ...chartConfig };
};

export function formatChartData<T extends { [key: string]: any }>(
  data: T[],
  key: keyof T
): (T & { fill: string })[] {
  return data.map((item) => {
    const originalKey = String(item[key]);

    const formattedKey = originalKey
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();
    // ✅ Safe for CSS variable
    return {
      ...item,
      [key]: formattedKey,
      fill: `var(--color-${formattedKey})`
    };
  });
}
