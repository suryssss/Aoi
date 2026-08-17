import Link from "next/link";
import { ArrowRight, PanelBottom } from "lucide-react";

export default function FooterShowcase() {
  const footers = [1];

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto w-full">
      <div className="animate-fade-in-up space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">Footer Components</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Immersive footer sections with scroll-triggered reveals, ASCII art canvases, parallax effects, and smooth text animations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {footers.map((id) => (
            <Link
              key={id}
              href={`/ui/footer/${id}`}
              className="group glass-panel rounded-xl overflow-hidden hover:bg-white/5 transition-all block"
            >
              <div className="aspect-[16/9] bg-[#121212] border-b border-white/5 flex items-center justify-center relative overflow-hidden group-hover:border-blue-500/30 transition-colors">
                <PanelBottom className="w-10 h-10 text-gray-700 group-hover:text-blue-500/50 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-5 flex items-center justify-between">
                <span className="font-medium">ASCII Reveal Footer {id}</span>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
