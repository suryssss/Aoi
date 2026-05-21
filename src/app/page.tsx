import Link from "next/link";
import Grainient from "@/animations/Graninient";
import { ArrowRight, Sparkles, Layers, Box } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Grainient color1="#4338ca" color2="#312e81" color3="#1e1b4b" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-sm text-blue-200 mb-8 animate-fade-in-up">
          <Sparkles className="w-4 h-4" />
          <span>Next.js UI Component Library</span>
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto">
          Craft Beautiful UIs with <br className="hidden sm:block" />
          <span className="text-gradient">Aoi Components</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          An open-source collection of high quality, animated, interactive & fully customizable React components for building stunning, memorable user interfaces.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link 
            href="/ui/hero" 
            className="group flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
          >
            Browse Components
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="https://github.com" 
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-8 py-3 glass-panel hover:bg-white/10 rounded-xl font-medium transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>

      {/* Features/Teaser Section */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Aoi?</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Built with modern tech stack focusing on performance and developer experience.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Layers, title: "Ready to Use", desc: "Copy and paste into your apps. No complex setup or configurations." },
            { icon: Sparkles, title: "Premium Aesthetics", desc: "Designed with modern UI trends, micro-interactions, and glassmorphism." },
            { icon: Box, title: "Highly Customizable", desc: "Built with Tailwind CSS v4. Easily tweak colors, spacing, and animations." }
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-8 rounded-2xl hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6 border border-blue-500/30">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
