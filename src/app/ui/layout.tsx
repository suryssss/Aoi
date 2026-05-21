"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function UILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const components = [
    { name: "Hero", href: "/ui/hero" },
    { name: "Cursor", href: "/ui/cursor" },
    { name: "Gallery", href: "/ui/gallery" },
    { name: "Navbar", href: "/ui/navbar" },
    { name: "Preloader", href: "/ui/preloader" },
    { name: "Buttons", href: "/ui/buttons" },
    { name: "CTA", href: "/ui/cta" },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white relative">
      
      {/* Floating Menu Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed top-4 left-4 z-40 p-3 glass-panel hover:bg-white/10 rounded-full transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none -translate-x-4' : 'opacity-100 translate-x-0'}`}
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed top-0 left-0 h-full w-72 bg-neutral-950 border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <h2 className="text-xl font-bold tracking-tight mb-6">Components</h2>
          <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {components.map((comp) => {
              const isActive = pathname?.startsWith(comp.href);
              return (
                <Link
                  key={comp.name}
                  href={comp.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm transition-colors ${isActive ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
                >
                  {comp.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full min-h-screen relative">
        {children}
      </main>
    </div>
  );
}
