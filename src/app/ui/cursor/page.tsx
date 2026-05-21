import Link from "next/link";
import { ArrowRight, MousePointer2 } from "lucide-react";

export default function CursorShowcase() {
  const cursors = [1];

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto w-full">
      <div className="animate-fade-in-up space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">Custom Cursors</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Interactive and animated cursor components to enhance user experience and engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursors.map((id) => (
            <Link
              key={id}
              href={`/ui/cursor/${id}`}
              className="group glass-panel rounded-xl overflow-hidden hover:bg-white/5 transition-all block"
            >
              <div className="aspect-[16/9] bg-[#121212] border-b border-white/5 flex items-center justify-center relative overflow-hidden group-hover:border-blue-500/30 transition-colors">
                <MousePointer2 className="w-10 h-10 text-gray-700 group-hover:text-blue-500/50 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-5 flex items-center justify-between">
                <span className="font-medium">Cursor Variation {id}</span>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
