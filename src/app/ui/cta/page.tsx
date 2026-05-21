import { ArrowRight, Zap } from "lucide-react";

export default function CTAShowcase() {
  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto w-full">
      <div className="animate-fade-in-up space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">CTA Components</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Call-to-action sections designed to drive conversions.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[40vh]">
          <Zap className="w-12 h-12 text-blue-500 mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
          <p className="text-gray-400">These components are currently being developed.</p>
        </div>
      </div>
    </div>
  );
}
