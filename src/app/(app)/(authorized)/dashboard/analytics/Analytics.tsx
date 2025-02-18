"use client";

import { useToast } from "@/hooks/use-toast";
import { ApiResponse, DashboardData } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import geoData from "@/lib/countries-110m.json";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis
} from "recharts";
import {
  alpha2ToCountryName,
  formatChartData,
  generateChartConfig
} from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useTheme } from "next-themes";

export default function Analytics() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  // TODO: Fix Tooltip not working
  const { theme } = useTheme();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleMouseEnter = (
    data: { countryName: string; count: number },
    event: React.MouseEvent<SVGPathElement, MouseEvent>
  ) => {
    console.log("mouseEnter called with data:", data);
    const { countryName, count } = data;

    if (count) {
      setTooltipContent(`<strong>${countryName}</strong><br>Clicks: ${count}`);
    } else {
      setTooltipContent(`<strong>${countryName}</strong><br>Clicks: 0`);
    }
    setShowTooltip(true);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
    console.log("tooltipPosition", tooltipPosition, showTooltip);
  };

  const handleMouseLeave = () => {
    console.log("mouseLeave called with data:");

    setShowTooltip(false);
  };

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/dashboard");
      console.log(response, "From dashboard api");

      if (response.data.dashboardData) {
        setData(response.data.dashboardData);
        toast({
          title: response.data.message
        });
      } else {
        toast({
          title: "Failed to load dashboard data",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in fetching dashboard data:", error);

      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Error",
        description: errorMessage || "Failed to fetch dashboard data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, toast]);

  useEffect(() => {
    if (!session || !session.user) return;
    const fetchData = async () => {
      await fetchDashboardData();
    };
    fetchData();
  }, [session, fetchDashboardData]);

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <div className="mb-5 text-center">
          <h1 className="text-4xl font-bold">Analytics</h1>
        </div>
        <div className="space-y-8">
          <div className="flex justify-evenly gap-5">
            <Skeleton className="w-full h-[90px]" />
            <Skeleton className="w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="w-full h-[300px]" />
            <Skeleton className="w-full h-[300px]" />
            <Skeleton className="w-full h-[300px]" />
            <Skeleton className="w-full h-[300px]" />
            <Skeleton className="w-full h-[300px]" />
            <Skeleton className="w-full h-[300px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto">
        <div className="mb-5 text-center">
          <h1 className="text-4xl font-bold">Analytics</h1>
        </div>
        <div className="space-y-8">
          <div className="flex justify-evenly gap-5">
            {/* Total Visits */}
            <Card className="p-4 flex-1 ">
              <h3 className="text-xl font-semibold ">Total Visits</h3>
              <p className="text-2xl font-bold">{data?.totalVisits || 0}</p>
              {data?.totalVisits === 0 && (
                <p className="">
                  🚀 No visits yet! But every journey starts with a single step.
                </p>
              )}
            </Card>

            {/* Unique Visitors */}
            <Card className="p-4 flex-1">
              <h3 className="text-xl font-semibold ">Unique Visitors</h3>
              <p className="text-2xl font-bold">{data?.uniqueVisitors || 0}</p>
              {data?.uniqueVisitors === 0 && (
                <p className="">
                  🎯 No visitors yet? No worries, your audience will come soon!
                </p>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Visits */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="items-center pb-0">
                <CardTitle>Daily Visits</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                {data?.dailyVisits.length ? (
                  <ChartContainer
                    config={generateChartConfig<"date">(
                      data?.dailyVisits || []
                    )}
                    className="mx-auto aspect-square max-h-[300px]"
                  >
                    <LineChart
                      accessibilityLayer
                      data={formatChartData(data?.dailyVisits || [], "date")}
                      margin={{
                        top: 20,
                        left: 12,
                        right: 12
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        interval={0}
                        tickFormatter={(value) =>
                          new Intl.DateTimeFormat("en-US", {
                            day: "numeric"
                          }).format(new Date(value))
                        }
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                      />
                      <Line
                        dataKey="count"
                        type="natural"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        dot={{
                          fill: "hsl(var(--chart-1))"
                        }}
                        activeDot={{
                          r: 8
                        }}
                      >
                        <LabelList
                          position="top"
                          offset={10}
                          className="fill-foreground"
                          fontSize={14}
                        />
                      </Line>
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <h1 className="text-2xl text-center py-10">
                    📅 No daily visits recorded yet. The best is yet to come!
                  </h1>
                )}
                {/* TODO: fix y axis labels, add 0 for not visited days */}
              </CardContent>
              <CardFooter className="flex-col items-center gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                  Showing daily visitors for the last 7 Days.
                </div>
              </CardFooter>
            </Card>
            {/* Countries */}
            <Card className="col-span-1 md:col-span-2 p-4">
              <CardHeader className="items-center">
                <CardTitle>Countries</CardTitle>
                <CardDescription>
                  Visitors from different countries.
                </CardDescription>
              </CardHeader>
              <CardContent className="items-center">
                {data?.countries.length ? (
                  <>
                    <ComposableMap
                      projectionConfig={{ scale: 170 }}
                      className="transition-all duration-300"
                    >
                      <Geographies geography={geoData}>
                        {({ geographies }) =>
                          geographies.map((geo: any) => {
                            const formattedCountryData: Record<string, number> =
                              data?.countries.reduce(
                                (acc, { country, count }) => {
                                  const countryName =
                                    alpha2ToCountryName(country);
                                  acc[countryName] = count;
                                  return acc;
                                },
                                {} as Record<string, number>
                              ) ?? {};
                            const countryName = geo.properties.name;
                            const count =
                              formattedCountryData[countryName] || 0; // Get click count
                            return (
                              <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                onMouseEnter={(
                                  event: React.MouseEvent<
                                    SVGPathElement,
                                    MouseEvent
                                  >
                                ) =>
                                  handleMouseEnter(
                                    { countryName, count },
                                    event
                                  )
                                }
                                onMouseLeave={handleMouseLeave}
                                className="transition-all duration-200 cursor-pointer"
                                fill={
                                  count > 0
                                    ? theme === "dark"
                                      ? "#fff"
                                      : "#38bdf8"
                                    : theme === "dark"
                                      ? "#374151"
                                      : "#e5e7eb"
                                }
                                style={{
                                  default: {
                                    stroke:
                                      theme === "dark" ? "#9ca3af" : "#4b5563",
                                    strokeWidth: 0.5
                                  },
                                  hover: {
                                    fill: "#f59e0b", // Hover color (Orange)
                                    stroke: "#000"
                                  },
                                  pressed: {
                                    fill: "#ef4444" // Clicked color (Red)
                                  }
                                }}
                              />
                            );
                          })
                        }
                      </Geographies>
                      {showTooltip && (
                        <div
                          style={{
                            position: "absolute",
                            top: tooltipPosition.y + 10, // Adjust offset as needed
                            left: tooltipPosition.x + 10, // Adjust offset as needed
                            backgroundColor: "white",
                            padding: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            pointerEvents: "none", // Prevent tooltip from blocking mouse events
                            zIndex: 1000, // Ensure tooltip is on top
                            whiteSpace: "nowrap" // Prevents tooltip from wrapping
                          }}
                          dangerouslySetInnerHTML={{ __html: tooltipContent }} // Use dangerouslySetInnerHTML for HTML content
                        />
                      )}
                    </ComposableMap>
                    {data?.countries.map((country, index) => (
                      <p
                        key={country.country}
                        className="font-semibold text-lg"
                      >
                        {index + 1}. {alpha2ToCountryName(country.country)}:{" "}
                        {country.count}
                      </p>
                    ))}
                  </>
                ) : (
                  <h1 className="text-2xl text-center py-10">
                    🌍 No visitors from around the world yet. Keep sharing your
                    content!
                  </h1>
                )}
              </CardContent>
            </Card>
            {/* Devices */}
            <Card>
              <CardHeader className="items-center">
                <CardTitle>Devices</CardTitle>
                <CardDescription>
                  Devices used by visitors of all time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data?.devices.length ? (
                  <ChartContainer
                    config={generateChartConfig<"device">(data?.devices || [])}
                    className="mx-auto aspect-square max-h-[300px]"
                  >
                    <BarChart
                      accessibilityLayer
                      data={formatChartData(data?.devices ?? [], "device")}
                      layout="vertical"
                      margin={{
                        left: 0
                      }}
                    >
                      <YAxis
                        dataKey="device"
                        type="category"
                        tickLine={false}
                        tickMargin={5}
                        axisLine={false}
                        tickFormatter={(value) =>
                          // chartConfig[value as keyof typeof chartConfig]?.label ??
                          // value
                          value
                        }
                      />
                      <XAxis dataKey="count" type="number" hide />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar dataKey="count" layout="vertical" radius={5}>
                        <LabelList
                          dataKey="count"
                          position="right"
                          offset={8}
                          className="fill-foreground"
                          fontSize={12}
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <h1 className="text-2xl text-center py-10">
                    📱 No device data yet. Stay tuned!
                  </h1>
                )}
              </CardContent>
              <CardFooter className="flex-col items-center gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                  Showing devices used by visitors.
                </div>
              </CardFooter>
            </Card>

            {/* Traffic Sources */}
            <Card>
              <CardHeader className="items-center pb-0">
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Traffic sources of all time.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                {data?.trafficSources.length ? (
                  <ChartContainer
                    config={generateChartConfig<"trafficSource">(
                      data?.trafficSources || []
                    )}
                    className="mx-auto aspect-square max-h-[300px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={formatChartData(
                          data?.trafficSources || [],
                          "trafficSource"
                        )}
                        dataKey="count"
                        nameKey="trafficSource"
                        label
                      />
                      <ChartLegend
                        content={<ChartLegendContent nameKey="trafficSource" />}
                        className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                      />
                    </PieChart>
                  </ChartContainer>
                ) : (
                  <h1 className="text-2xl text-center py-10">
                    🔗 No traffic sources yet. Keep spreading the word!
                  </h1>
                )}
              </CardContent>
              <CardFooter className="flex-col items-center gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                  Showing traffic sources of visitors of all time
                </div>
              </CardFooter>
            </Card>

            {/* Peak Hours */}
            <Card>
              <CardHeader className="items-center">
                <CardTitle>Peak Hours</CardTitle>
                <CardDescription>
                  Peak hours of the day when your link was visited
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* TODO: Fix x axis labels, no of clicks not showing */}
                {data?.peakHours.length ? (
                  <ChartContainer
                    config={generateChartConfig<"hour">(data?.peakHours || [])}
                    className="mx-auto aspect-square max-h-[300px]"
                  >
                    <BarChart
                      accessibilityLayer
                      data={data?.peakHours || []}
                      layout="vertical"
                      margin={{
                        left: -20
                      }}
                    >
                      <XAxis type="number" dataKey="count" hide />
                      <YAxis
                        dataKey="hour"
                        type="category"
                        tickLine={false}
                        tickMargin={1}
                        axisLine={false}
                        tickFormatter={(value) =>
                          value > 12 ? `${value - 12} PM` : `${value} AM`
                        }
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar
                        dataKey="count"
                        fill="hsl(var(--chart-1))"
                        radius={5}
                      >
                        <LabelList
                          dataKey="count"
                          position="insideRight"
                          offset={8}
                          className="fill-foreground"
                          fontSize={12}
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <h1 className="text-2xl text-center py-10">
                    ⏰ No peak hour data yet. Your audience will find their time
                    soon!
                  </h1>
                )}
              </CardContent>
              <CardFooter className="flex-col items-center gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                  Showing top 5 peak hours of visitors of all time
                </div>
              </CardFooter>
            </Card>
            {/* OS Name */}
            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0">
                <CardTitle>Operating System</CardTitle>
                <CardDescription>Link created - Till now</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                {data?.osName.length ? (
                  <ChartContainer
                    config={generateChartConfig<"os">(data?.osName || [])}
                    className="mx-auto aspect-square max-h-[300px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent nameKey="count" hideLabel />
                        }
                      />
                      <Pie
                        data={formatChartData(data?.osName || [], "os")}
                        dataKey="count"
                        nameKey="os"
                        label={true}
                      />
                      <ChartLegend
                        content={<ChartLegendContent nameKey="os" />}
                        className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                      />
                    </PieChart>
                  </ChartContainer>
                ) : (
                  <h1 className="text-2xl text-center py-10">
                    💻 No OS data yet. It will appear once someone visits your
                    link. Keep waiting!
                  </h1>
                )}
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                  Showing OS used by your visitors.
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
