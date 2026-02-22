"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero5() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mainXTo = useRef<any>(null);
    const mainYTo = useRef<any>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
            gsap.set(".hero5-image", { scale: 1.15 });
            gsap.set(".hero5-text-line", { yPercent: 120, opacity: 0 });
            gsap.set(".hero5-btn", { x: 40, opacity: 0 });
            gsap.set(".hero5-card", { y: 60, opacity: 0 });
            gsap.set(".hero5-overlay", { opacity: 1 });

            tl.to(".hero5-overlay", {
                opacity: 0,
                duration: 1.5,
                ease: "power2.inOut"
            })
                .to(".hero5-image", {
                    scale: 1,
                    duration: 2.5,
                    ease: "power3.out"
                }, "<")
                .to(".hero5-text-line", {
                    yPercent: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.15,
                }, "-=2.0")
                .to(".hero5-btn", {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                }, "-=1.5")
                .to(".hero5-card", {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "back.out(1.2)"
                }, "-=1.2");

            mainXTo.current = gsap.quickTo(".hero5-image", "x", { duration: 1.5, ease: "power3" });
            mainYTo.current = gsap.quickTo(".hero5-image", "y", { duration: 1.5, ease: "power3" });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const { clientX, clientY } = e;
        const xOffset = (clientX / window.innerWidth - 0.5) * 30;
        const yOffset = (clientY / window.innerHeight - 0.5) * 30;

        if (mainXTo.current && mainYTo.current) {
            mainXTo.current(-xOffset);
            mainYTo.current(-yOffset);
        }
    };

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative w-full h-screen bg-[#0A0A0A] p-4 md:p-6 lg:p-8 overflow-hidden font-sans"
        >
            <div className="relative w-full h-full rounded-3xl md:rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl">
                <div className="hero5-overlay absolute inset-0 z-10 pointer-events-none bg-[#0A0A0A]" />
                <img
                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000"
                    alt="Modern Living Room"
                    className="hero5-image w-[105%] h-[105%] -left-[2.5%] -top-[2.5%] absolute object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
            </div>
            <div className="absolute top-4 left-4 md:top-6 md:left-6 lg:top-8 lg:left-8 z-20 flex flex-col items-start pointer-events-none">

                <div className="relative bg-[#0A0A0A] rounded-tl-[1.25rem] md:rounded-tl-[1.5rem] rounded-br-2xl md:rounded-br-[2.5rem] pr-8 md:pr-12 lg:pr-16 pb-4 md:pb-6 pt-4 md:pt-6 lg:pt-8 pl-4 md:pl-6 lg:pl-8 z-20 pointer-events-auto">
                    <div className="overflow-hidden mb-1 md:mb-2 pt-2 md:pt-4">
                        <h1 className="hero5-text-line text-white text-4xl md:text-6xl lg:text-[5rem] font-semibold leading-[1.1] tracking-tight cursor-default transition-all duration-300 hover:text-transparent hover:[-webkit-text-stroke:2px_white]">
                            Transforming Homes
                        </h1>
                    </div>
                </div>
                <div className="relative bg-[#0A0A0A] rounded-br-2xl md:rounded-br-[2.5rem] pr-8 md:pr-12 lg:pr-16 pb-6 md:pb-8 pt-2 pl-4 md:pl-6 lg:pl-8 z-20 -mt-1 pointer-events-auto">
                    <div className="overflow-hidden">
                        <h1 className="hero5-text-line text-white text-4xl md:text-6xl lg:text-[5rem] font-semibold leading-[1.1] tracking-tight cursor-default transition-all duration-300 hover:text-transparent hover:[-webkit-text-stroke:2px_white]">
                            Since 1995
                        </h1>
                    </div>
                    <svg className="absolute top-0 -right-7 w-7 h-7 md:-right-11 md:w-11 md:h-11 fill-[#0A0A0A]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                        <path d="M0 0 L 100 0 C 45 0 0 45 0 100 Z" />
                    </svg>
                    <svg className="absolute -bottom-7 left-0 w-7 h-7 md:-bottom-11 md:w-11 md:h-11 fill-[#0A0A0A]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                        <path d="M0 0 L 100 0 C 45 0 0 45 0 100 Z" />
                    </svg>
                </div>
            </div>
            <div className="hero5-btn absolute top-10 right-10 md:top-14 md:right-14 z-20">
                <button className="group relative overflow-hidden flex items-center gap-2 bg-white text-black px-5 py-2.5 md:px-7 md:py-3.5 rounded-full font-semibold text-sm md:text-base transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl">
                    <span className="relative z-10">Book a Consultation</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r from-transparent via-black to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                </button>
            </div>
            <div className="hero5-card absolute bottom-10 right-10 md:bottom-14 md:right-14 z-20 w-[18rem] md:w-[22rem] bg-[#0A0A0A] border border-white/10 hover:border-white/20 rounded-3xl p-3 md:p-4 flex flex-col gap-4 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-2 group/card cursor-pointer">
                <div className="w-full h-40 md:h-48 rounded-[1.25rem] md:rounded-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/20 z-10 group-hover/card:bg-transparent transition-colors duration-500" />
                    <img
                        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800"
                        alt="Interior Details"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                    />
                </div>
                <div className="flex flex-col gap-1.5 px-3 pb-2 md:pb-3">
                    <h3 className="text-lg md:text-xl font-semibold tracking-tight transition-colors duration-300 group-hover/card:text-blue-100">Custom Design Solutions</h3>
                    <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-light transition-colors duration-300 group-hover/card:text-neutral-300">
                        Personalized interiors crafted to reflect your vision.
                    </p>
                    <div className="flex justify-between items-center mt-3 group/link">
                        <span className="text-xs md:text-sm font-semibold text-neutral-200 group-hover/card:text-white transition-colors">More info</span>
                        <div className="bg-white/10 rounded-full p-1.5 transition-all duration-300 group-hover/card:bg-white group-hover/card:text-black">
                            <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}
