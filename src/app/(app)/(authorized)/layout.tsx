export default function AuthorizedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="my-8 md:px-16 lg:mx-auto p-6 rounded-xl max-w-6xl w-full">
      {children}
    </div>
  );
}
