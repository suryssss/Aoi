import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">Welcome to Aoi</h1>
      <Link href="/ui/hero" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
        View Hero Components
      </Link>
    </div>
  );
}
