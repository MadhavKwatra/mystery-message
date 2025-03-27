import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import { Metadata } from "next";
import { APP_NAME } from "@/config/config";
import SendAnonymousFeedback from "./SendAnonymousFeedback";

async function SendFeedbackPage({
  params
}: {
  params: Promise<{ feedbackSlug: string }>;
}) {
  const { feedbackSlug } = await params;

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "https";
  console.log(host, protocol, "SERVer");
  try {
    const response = await fetch(
      `${protocol}://${host}/api/feedbacks/${feedbackSlug}`,
      {
        cache: "no-store"
      }
    );
    const body = await response.json();

    console.log(response.status, body, "check-user");
    if (response.status === 404) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="p-6 mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-semibold mb-4">
              We couldn&apos;t find this feedback page
            </h1>
            {
              <p className="text-lg">
                We couldn’t find a feedback page for{" "}
                <strong>{feedbackSlug}</strong>. Change this in the url and try
                again.
              </p>
            }
            <Link href="/">
              <Button className="mt-4">Go back to home</Button>
            </Link>
          </div>
        </div>
      );
    }
    if (response.status === 200) {
      return (
        <>
          <Head>
            <title>Send feedback for @${feedbackSlug}</title>
            <meta
              name="description"
              content={`Send an anonymous feedback for @${feedbackSlug}`}
            />
          </Head>
          <SendAnonymousFeedback />
        </>
      );
    }
  } catch (error) {
    console.log(error, "Error in loading feedback page");
    return notFound();
  }

  // TODO: show loading till api responds
  // <Suspense fallback={<div>Loading...</div>}> {/* Show the spinner while waiting for data */}
  //   {response.status === 200 && (
  //     <SendMessage isAcceptingMessages={body.isAcceptingMessage} />
  //   )}
  // </Suspense>
}
export default SendFeedbackPage;

export const metadata: Metadata = {
  title: "Send Feedback - " + APP_NAME,
  description: "Send anonymous feedbacks"
};
