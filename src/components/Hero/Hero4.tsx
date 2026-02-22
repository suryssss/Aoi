"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero4() {
    const containerRef = useRef<HTMLElement>(null);
    const xTo = useRef<any>(null);
    const yTo = useRef<any>(null);
    const mainXTo = useRef<any>(null);
    const mainYTo = useRef<any>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

            gsap.set(".hero-word-inner", { yPercent: 120 });
            gsap.set(".hero-inline-img", { scale: 0, opacity: 0, rotation: -10 });
            gsap.set(".hero-subtitle", { y: -30, opacity: 0 });
            gsap.set(".hero-main-img-overlay", { height: "100%", top: 0 });
            gsap.set(".hero-main-img", { scale: 1.2 });

            tl.to(".hero-word-inner", {
                yPercent: 0,
                duration: 1.2,
                stagger: 0.1,
            })
                .to(".hero-inline-img", {
                    scale: 1,
                    opacity: 1,
                    rotation: 0,
                    duration: 1,
                    ease: "back.out(2)",
                    stagger: 0.1,
                }, "-=0.8")
                .to(".hero-subtitle", {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power3.out"
                }, "-=0.8")
                .to(".hero-main-img-overlay", {
                    height: "0%",
                    top: "100%",
                    duration: 1.5,
                    ease: "power4.inOut",
                }, "-=0.6")
                .to(".hero-main-img", {
                    scale: 1,
                    duration: 2,
                    ease: "power2.out",
                }, "-=1.5");
            xTo.current = gsap.quickTo(".hero-inline-img", "x", { duration: 0.8, ease: "power3" });
            yTo.current = gsap.quickTo(".hero-inline-img", "y", { duration: 0.8, ease: "power3" });
            mainXTo.current = gsap.quickTo(".hero-main-img", "x", { duration: 1.2, ease: "power3" });
            mainYTo.current = gsap.quickTo(".hero-main-img", "y", { duration: 1.2, ease: "power3" });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const { clientX, clientY } = e;
        const xOffset = (clientX / window.innerWidth - 0.5) * 40;
        const yOffset = (clientY / window.innerHeight - 0.5) * 40;

        if (xTo.current && yTo.current) {
            xTo.current(xOffset);
            yTo.current(yOffset);
        }

        if (mainXTo.current && mainYTo.current) {
            mainXTo.current(-xOffset * 1.5);
            mainYTo.current(-yOffset * 1.5);
        }
    };

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative w-full min-h-screen bg-[#070707] text-white flex flex-col items-center pt-24 md:pt-32 px-4 md:px-8 pb-16 overflow-hidden selection:bg-white selection:text-black"
        >
            <div className="flex flex-col items-center justify-center z-10 space-y-1 md:space-y-4 w-full">
                <div className="flex items-center justify-center gap-3 md:gap-5 lg:gap-8 flex-wrap">
                    <div className="overflow-hidden pb-2 md:pb-4">
                        <h1 className="hero-word-inner text-4xl md:text-6xl lg:text-[6rem] leading-none font-bold tracking-tight cursor-default transition-all duration-300 hover:text-transparent hover:[-webkit-text-stroke:2px_white]">
                            CREATING
                        </h1>
                    </div>
                    <div className="hero-inline-img relative w-20 h-10 md:w-36 md:h-16 lg:w-48 lg:h-24 rounded-2xl overflow-hidden shrink-0 shadow-xl mb-2 md:mb-4">
                        <img
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600"
                            alt="Office"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-125 cursor-pointer"
                        />
                    </div>
                    <div className="overflow-hidden pb-2 md:pb-4">
                        <h1 className="hero-word-inner text-4xl md:text-6xl lg:text-[6rem] leading-none font-bold tracking-tight cursor-default transition-all duration-300 hover:text-transparent hover:[-webkit-text-stroke:2px_white]">
                            DIGITAL
                        </h1>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-3 md:gap-5 lg:gap-8 flex-wrap">
                    <div className="overflow-hidden pb-2 md:pb-4">
                        <h1 className="hero-word-inner text-4xl md:text-6xl lg:text-[6rem] leading-none font-bold tracking-tight cursor-default transition-all duration-300 hover:text-transparent hover:[-webkit-text-stroke:2px_white]">
                            BUILDING
                        </h1>
                    </div>
                    <div className="hero-inline-img relative w-20 h-10 md:w-36 md:h-16 lg:w-48 lg:h-24 rounded-2xl overflow-hidden shrink-0 shadow-xl mb-2 md:mb-4">
                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600"
                            alt="Dashboard"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-125 cursor-pointer"
                        />
                    </div>
                    <div className="overflow-hidden pb-2 md:pb-4">
                        <h1 className="hero-word-inner text-4xl md:text-6xl lg:text-[6rem] leading-none font-bold tracking-tight cursor-default transition-all duration-300 hover:text-transparent hover:[-webkit-text-stroke:2px_white]">
                            TOMORROW
                        </h1>
                    </div>
                </div>

            </div>
            <div className="hero-subtitle max-w-2xl text-center mt-12 md:mt-16 text-base md:text-xl text-neutral-400 font-light z-10 px-4 leading-relaxed group">
                <p className="transition-colors duration-500 hover:text-white cursor-default">
                    We craft exceptional digital products that connect brands with their audiences. From concept to launch, our team delivers innovative solutions.
                </p>
            </div>
            <div className="relative mt-16 md:mt-24 w-full max-w-7xl aspect-[4/3] md:aspect-[21/9] rounded-2xl md:rounded-[2rem] overflow-hidden z-0 group cursor-pointer transition-transform duration-700 hover:scale-[0.98]">
                <div className="hero-main-img-overlay absolute left-0 w-full bg-[#070707] z-10 pointer-events-none" />
                <div className="relative w-full h-full overflow-hidden rounded-2xl md:rounded-[2rem]">
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000"
                        alt="Team Working"
                        className="hero-main-img w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
        </section>
    );
}
