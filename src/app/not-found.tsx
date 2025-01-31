"use client"
import Link from "next/link";

const Custom404 = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl">Oops! Page not found.</h1>
      <p>Sorry, the page you’re looking for doesn’t exist.</p>
      <Link href="/">Go back to Home</Link>
    </div>
  );
};

export default Custom404;
