import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import SendMessage from "./SendMessageComponent";
import { Button } from "@/components/ui/button";
import Head from "next/head";

async function SendMessagePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  console.log(username, "SERVer");
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "https";
  console.log(host, protocol, "SERVer");
  try {
    const response = await fetch(
      `${protocol}://${host}/api/check-user/${username}`,
      {
        cache: "no-store",
      }
    );
    const body = await response.json();

    console.log(response.status, body, "check-user");
    if (response.status === 404) {
      return (
        <div className="p-6 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-semibold mb-4">
            We couldn&apos;t find this user
          </h1>
          {
            <p className="text-lg">
              We couldn’t find a public profile for <strong>@{username}</strong>
              . Change the username in the url and try again.
            </p>
          }
          <Link href="/">
            <Button className="mt-4">Go back to home</Button>
          </Link>
        </div>
      );
    }

    if (response.status === 200) {
      const { isAcceptingMessage } = body;
      return (
        <>
          <Head>
            <title>
              {isAcceptingMessage
                ? `Send a message to @${username}`
                : `User @${username} is not accepting messages`}
            </title>
            <meta
              name="description"
              content={`Send an anonymous message to @${username}`}
            />
          </Head>
          <SendMessage isAcceptingMessages={isAcceptingMessage} />;
        </>
      );
    }

    // TODO: show loading till api responds
    // <Suspense fallback={<div>Loading...</div>}> {/* Show the spinner while waiting for data */}
    //   {response.status === 200 && (
    //     <SendMessage isAcceptingMessages={body.isAcceptingMessage} />
    //   )}
    // </Suspense>
  } catch (error) {
    console.log(error, "Error in loading public profile page");
    return notFound();
  }
}
export default SendMessagePage;
