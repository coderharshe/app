import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
        <SearchX className="h-10 w-10 text-gray-600" />
      </div>
      <h2 className="mt-6 text-2xl font-extrabold text-white">
        Page Not Found
      </h2>
      <p className="mt-3 max-w-md text-center text-sm text-gray-500">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved. Let&apos;s get you back on track.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/5 px-6 py-3 text-sm font-semibold text-gray-300 transition-all hover:bg-white/10 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
    </div>
  );
}
