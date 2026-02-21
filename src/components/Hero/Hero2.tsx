"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

export default function Hero2() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".hero-stagger", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.2
            });
            gsap.from(".hero-image", {
                scale: 0.95,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                delay: 0.4
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="w-full h-full bg-[#0a0a0a] flex items-center justify-center px-6 md:px-12 lg:px-20 overflow-hidden font-sans"
        >
            <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">

                {/* Left Content Area */}
                <div className="flex flex-col items-start z-10">
                    {/* Top Badge */}
                    <div className="hero-stagger flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
                        <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            New
                        </span>
                        <span className="text-zinc-300 text-sm font-medium">
                            AI-powered design systems
                        </span>
                    </div>

                    <h1 className="hero-stagger text-white text-4xl md:text-[3.25rem] lg:text-6xl font-medium leading-[1.05] tracking-tight">
                        Transform your product <br className="hidden xl:block" /> with intelligent design
                    </h1>

                    <p className="hero-stagger text-zinc-400 text-base md:text-lg mt-5 max-w-lg leading-relaxed font-normal">
                        Get component libraries, design tokens, and expert tooling. Ship your design systems faster & smarter.
                    </p>

                    {/* Action Buttons */}
                    <div className="hero-stagger flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto">
                        <button className="w-full sm:w-auto bg-white text-black px-6 py-3 rounded-full font-semibold text-sm hover:scale-105 transition-transform duration-300 ease-out">
                            Start Building
                        </button>
                        <button className="w-full sm:w-auto group flex items-center justify-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-transparent text-white font-semibold text-sm hover:bg-white/5 transition-colors duration-300">
                            Watch Demo
                            <div className="flex items-center justify-center w-6 h-6 bg-white text-black rounded-full group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-2.5 h-2.5 translate-x-[1px]" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </button>
                    </div>

                    {/* Social Proof */}
                    <div className="hero-stagger flex items-center gap-5 mt-10 md:mt-12">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full border-[3px] border-[#0a0a0a] bg-white flex items-center justify-center text-black text-[11px] font-bold z-30 shadow-sm">JD</div>
                            <div className="w-10 h-10 rounded-full border-[3px] border-[#0a0a0a] bg-white flex items-center justify-center text-black text-[11px] font-bold z-20 shadow-sm">SK</div>
                            <div className="w-10 h-10 rounded-full border-[3px] border-[#0a0a0a] bg-white flex items-center justify-center text-black text-[11px] font-bold z-10 shadow-sm">AL</div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-lg leading-none">50k+</span>
                            <span className="text-zinc-500 text-[13px] font-medium mt-1">Engineers shipping products daily.</span>
                        </div>
                    </div>
                </div>

                {/* Right Image Area */}
                <div className="hero-image relative w-full aspect-[4/3] lg:aspect-square max-h-[70vh] rounded-[2.5rem] bg-zinc-900 shadow-2xl overflow-hidden group">
                    <Image
                        src="/hero/heroimg2.png"
                        alt="Engineers collaborating"
                        fill
                        className="object-cover opacity-80 mix-blend-lighten grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-100"
                        priority
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/50 to-transparent pointer-events-none" />

                    <div className="absolute inset-0 rounded-[2.5rem] border border-white/10 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 bg-[#0a0a0a] pt-4 pl-4 rounded-tl-[2.5rem]">
                        <svg className="absolute top-0 -left-4 w-4 h-4 text-[#0a0a0a]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 0v24H0c13.255 0 24-10.745 24-24z" />
                        </svg>
                        <svg className="absolute -top-4 right-0 w-4 h-4 text-[#0a0a0a]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 24H0V0c0 13.255 10.745 24 24 24z" />
                        </svg>

                        <button className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-black hover:bg-zinc-200 transition-colors duration-300 shadow-xl cursor-pointer group/btn relative z-10">
                            <svg
                                className="w-6 h-6 -rotate-45 group-hover/btn:rotate-0 group-hover/btn:scale-110 transition-transform duration-500 ease-out"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
}
