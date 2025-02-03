import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/config/config";
import Link from "next/link";

const Custom404 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold mb-4">Oops! Page not found.</h1>
        {
          <p className="text-lg">
            Sorry, the page you’re looking for doesn’t exist.
          </p>
        }
        <Link href="/">
          <Button className="mt-4">Go back to home</Button>
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
