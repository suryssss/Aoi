"use client";

import PreloaderAnimation from "../../../components/Preloader/PreloaderAnimation";

export default function PreloaderShowcase() {
  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto w-full">
      <div className="animate-fade-in-up space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">Preloader Components</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Engaging loading screens to keep users entertained while your application initializes.
          </p>
        </div>

        <div className="relative w-full h-[60vh] glass-panel rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center bg-black">
          {/* Render the preloader directly inside the showcase area for preview */}
          <div className="absolute inset-0 w-full h-full scale-75 origin-center pointer-events-none">
               <PreloaderAnimation />
          </div>
          <div className="absolute bottom-4 right-4 text-xs text-gray-500">Preview (Scaled 75%)</div>
        </div>
      </div>
    </div>
  );
}
