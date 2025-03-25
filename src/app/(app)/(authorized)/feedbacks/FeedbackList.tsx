"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Plus } from "lucide-react";

interface FeedbackPage {
  id: string;
  title: string;
  description: string;
  url: string;
}

interface FeedbackCardProps {
  page: FeedbackPage;
}

function FeedbackCard({ page }: FeedbackCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{page.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {page.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 text-base">{page.description}</p>
      </CardContent>
      <CardFooter>
        <Link href={page.url}>
          <Button className="font-semibold">Visit Page</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

interface FeedbackPage {
  id: string;
  title: string;
  description: string;
  url: string;
}

// Dummy data for now
const dummyFeedbackPages: FeedbackPage[] = [
  {
    id: "1",
    title: "Product Feedback",
    description: "Feedback for our product launch.",
    url: "/feedback/product-feedback"
  },
  {
    id: "2",
    title: "Service Feedback",
    description: "Let us know your service experience.",
    url: "/feedback/service-feedback"
  },
  {
    id: "3",
    title: "Website Feedback",
    description: "Share your thoughts about our website design.",
    url: "/feedback/website-feedback"
  }
];

export default function FeedbackList() {
  const [feedbackPages, setFeedbackPages] =
    useState<FeedbackPage[]>(dummyFeedbackPages);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { toast } = useToast();
  const { data: session } = useSession();

  // Placeholder function for fetching feedback pages
  const fetchFeedbackPages = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await axios.get<ApiResponse>("/api/get-feedback-pages");
      // setFeedbackPages(response.data.pages || []);
      // Simulate a delay for loading
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error fetching feedback pages", error);
      toast({
        title: "Error",
        description: "Failed to fetch feedback pages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!session || !session.user) return;
    const fetchData = async () => {
      await fetchFeedbackPages();
      setIsPageLoading(false);
    };
    fetchData();
  }, [session, fetchFeedbackPages]);

  if (isPageLoading) {
    return (
      <>
        <div className="flex items-center justify-end mb-4">
          <Skeleton className="h-10 w-48 rounded-md" />
        </div>
        <Separator />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-lg" />
          ))}
        </div>
      </>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="text-center text-lg font-medium mt-10">Please login</div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-col md:flex-row items-center justify-end gap-4">
        <Link href="/feedbacks/create">
          <Button className="font-semibold flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <Plus className="h-4 w-4" />
            Create New Feedback Page
          </Button>
        </Link>
      </div>
      <Separator />
      {feedbackPages.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {feedbackPages.map((page) => (
            <FeedbackCard key={page.id} page={page} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-6">
          <p className="text-2xl font-semibold">No Feedback Pages Found!</p>
          <p className="text-lg mt-2">
            Click on &quot;Create Feedback Page&quot; to start building one.
          </p>
        </div>
      )}
      {isLoading && (
        <div className="mt-4 flex items-center justify-center">
          <Skeleton className="h-8 w-8 rounded-full" />
          <p className="ml-2">Refreshing feedback pages...</p>
        </div>
      )}
    </>
  );
}
