"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Grainient from "@/animations/Graninient";

export default function Hero3() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".hero-text", {
                y: 20,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.2
            });
            gsap.from(".hero-link", {
                x: -10,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.6
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="w-full bg-[#0a0a0a] h-screen max-h-screen flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden font-sans"
        >
            <div className="relative w-full max-w-[1400px] h-[85vh] rounded-[2.5rem] bg-[#1a2b3c] overflow-hidden shadow-2xl">
                <div className="absolute inset-0 z-0 pointer-events-none rounded-[2.5rem] overflow-hidden mix-blend-screen opacity-90">
                    <Grainient
                        color1="#3a8b8b"
                        color2="#1a4b6c"
                        color3="#2a6c7a"
                        warpSpeed={2.5}
                        warpAmplitude={60}
                        grainAmount={0.09}
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none mix-blend-overlay z-0" />
                <div className="relative w-full h-full flex flex-col justify-between p-8 md:p-12 lg:p-16 z-10 pointer-events-none">

                    <div className="flex justify-between items-start pointer-events-auto">
                        <div className="hero-text text-white font-medium text-lg leading-snug tracking-wide">
                            Neural_Lab<br />Experiments
                        </div>
                        <button className="hero-text px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold backdrop-blur-md transition-colors duration-300">
                            Get Started
                        </button>
                    </div>

                    <div className="w-[60%] md:w-[65%] pb-4 md:pb-12 pointer-events-auto">
                        <h1 className="hero-text text-white text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight">
                            Neural Network <br />
                            Visualization Engine
                        </h1>
                    </div>
                </div>


                <div className="absolute bottom-0 right-[-1px] mb-[-1px] w-[35%] md:w-[30%] lg:w-[25%] bg-[#0a0a0a] rounded-tl-[3rem] pt-12 pl-12 flex flex-col items-end justify-end z-20">
                    <svg className="absolute top-[-24px] right-0 w-6 h-6 text-[#0a0a0a]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 0v24H0c13.255 0 24-10.745 24-24z" />
                    </svg>
                    <svg className="absolute bottom-0 left-[-24px] w-6 h-6 text-[#0a0a0a]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 0v24H0c13.255 0 24-10.745 24-24z" />
                    </svg>

                    <div className="flex flex-col gap-6 text-right pr-6 pb-6 md:pr-10 md:pb-10 w-full">
                        {['Documentation', 'API Reference', 'Get Started'].map((link, i) => (
                            <a
                                key={link}
                                href="#"
                                className="hero-link group flex items-center justify-end gap-3 text-zinc-400 hover:text-white transition-colors duration-300 text-sm md:text-base font-medium"
                            >
                                {link}
                                <svg
                                    className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}