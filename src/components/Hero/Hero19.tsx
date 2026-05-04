'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export default function Hero19() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
            lerp: 0.05, // Smoother scrolling for agency feel
        });

        lenis.on('scroll', ScrollTrigger.update);

        const raf = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        const ctx = gsap.context(() => {
            // Text Reveal Animation
            const textElements = gsap.utils.toArray<HTMLElement>('.animate-text');
            textElements.forEach((textElement) => {
                ScrollTrigger.create({
                    trigger: textElement,
                    start: 'top 60%',
                    end: 'bottom 40%',
                    scrub: 1,
                    onUpdate: (self) => {
                        const clipValue = Math.max(0, 100 - self.progress * 100);
                        textElement.style.setProperty('--clip-value', `${clipValue}%`);
                    },
                });
            });

            // Services SVG Animation
            const headers = gsap.utils.toArray<HTMLElement>('.service-header');
            ScrollTrigger.create({
                trigger: '.services',
                start: 'top bottom',
                end: 'top top',
                scrub: 1,
                onUpdate: (self) => {
                    if (headers.length >= 3) {
                        gsap.set(headers[0], { x: `${100 - self.progress * 100}%` });
                        gsap.set(headers[1], { x: `${-100 + self.progress * 100}%` });
                        gsap.set(headers[2], { x: `${100 - self.progress * 100}%` });
                    }
                },
            });

            ScrollTrigger.create({
                trigger: '.services',
                start: 'top top',
                end: () => `+=${window.innerHeight * 2.5}`, // Give it more breathing room
                pin: true,
                scrub: 1,
                pinSpacing: false,
                onUpdate: (self) => {
                    if (headers.length >= 3) {
                        if (self.progress <= 0.5) {
                            const yProgress = self.progress / 0.5;
                            gsap.set(headers[0], { y: `${yProgress * 100}%` });
                            gsap.set(headers[2], { y: `${yProgress * -100}%` });
                        } else {
                            gsap.set(headers[0], { y: '100%' });
                            gsap.set(headers[2], { y: '-100%' });

                            const scaleProgress = (self.progress - 0.5) / 0.5;
                            const minScale = window.innerWidth <= 1000 ? 0.35 : 0.15;
                            const scale = 1 - scaleProgress * (1 - minScale);

                            // Add subtle blur and fade as they scale down
                            const blurAmount = scaleProgress * 5; 
                            
                            headers.forEach((header) => gsap.set(header, { 
                                scale,
                                filter: `blur(${blurAmount}px)`,
                                opacity: 1 - (scaleProgress * 0.5) 
                            }));
                        }
                    }
                },
            });

            // Parallax Images
            const parallaxImages = gsap.utils.toArray<HTMLImageElement>('.parallax-img');
            parallaxImages.forEach(img => {
                gsap.to(img, {
                    yPercent: 20,
                    ease: "none",
                    scrollTrigger: {
                        trigger: img.parentElement,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            });

        }, containerRef);

        return () => {
            ctx.revert();
            gsap.ticker.remove(raf);
            lenis.destroy();
        };
    }, []);

    return (
        <div ref={containerRef} className="bg-[#050505] min-h-screen text-[#e0e0e0] overflow-hidden font-sans selection:bg-[#A78B3E] selection:text-black">
            
            {/* Minimal Noise Overlay */}
            <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.04] mix-blend-overlay" 
                 style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
            </div>

            {/* Safe Style Wrapper for React */}
            <div dangerouslySetInnerHTML={{
                __html: `
                    <style>
                        .animate-text {
                            --clip-value: 100%;
                        }
                        .animate-text::before {
                            content: attr(data-text);
                            position: absolute;
                            top: 0;
                            left: 0;
                            color: #e0e0e0;
                            clip-path: inset(0 0 var(--clip-value) 0);
                            will-change: clip-path;
                        }
                    </style>
                `
            }} />

            {/* Fixed Minimal Navigation/Branding */}
            <header className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-40 pointer-events-none text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-white/50">
                <div className="flex gap-4 items-center">
                    <span className="w-1.5 h-1.5 bg-[#A78B3E] rounded-full animate-pulse"></span>
                    <span>Studio®</span>
                </div>
                <div>Index [01]</div>
            </header>

            {/* Section 1: Intro Image */}
            <section className="relative w-full h-[100svh] p-8 flex items-center justify-center overflow-hidden">
                <div className="absolute left-10 top-1/2 -translate-y-1/2 rotate-[-90deg] origin-left text-[0.55rem] tracking-[0.3em] text-white/30 uppercase hidden md:block">
                    01 // The Beginning
                </div>
                <div className="w-[85vw] md:w-[350px] aspect-[4/5] overflow-hidden rounded-sm relative opacity-90 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                    <img src="/hero/img1.jpg" alt="Intro" className="parallax-img absolute top-[-10%] left-0 w-full h-[120%] object-cover grayscale-[0.2]" />
                </div>
            </section>

            {/* Section 2: Statement */}
            <section className="relative w-full min-h-[100svh] py-32 px-6 flex items-center justify-center overflow-hidden">
                <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
                    <div className="mb-16 text-[0.6rem] tracking-[0.4em] text-[#A78B3E]/60 uppercase border-b border-white/5 pb-4">
                        [ Introduction ]
                    </div>
                    <h1 className="animate-text relative w-full lg:w-[85%] mx-auto text-[#1f1f1f] text-[2.5rem] md:text-[5vw] font-light tracking-[-0.03em] leading-[1.1] text-center" data-text="A space for work shaped with clarity and intention. Each project follows a simple path from thought to form, from form to function.">
                        A space for work shaped with clarity and intention. Each project follows a simple path from thought to form, from form to function.
                    </h1>
                </div>
            </section>

            {/* Section 3: Animated Services SVGs */}
            <div className="services-wrapper w-full relative">
                <section className="services relative w-full h-[100svh] flex flex-col justify-center items-center overflow-hidden border-y border-white/[0.02]">
                    <div className="service-header relative w-full px-[2rem] lg:px-[15vw] bg-[#050505] will-change-transform -translate-x-full translate-y-0">
                        <img src="/whatido.svg" alt="Service 1" className="w-full h-full object-contain opacity-80" />
                    </div>
                    <div className="service-header relative w-full px-[2rem] lg:px-[15vw] bg-[#050505] will-change-transform -translate-x-full translate-y-0 z-[2]">
                        <img src="/whatido.svg" alt="Service 2" className="w-full h-full object-contain opacity-80" />
                    </div>
                    <div className="service-header relative w-full px-[2rem] lg:px-[15vw] bg-[#050505] will-change-transform -translate-x-full translate-y-0">
                        <img src="/whatido.svg" alt="Service 3" className="w-full h-full object-contain opacity-80" />
                    </div>
                </section>
            </div>

            {/* Section 4: Deep Copy */}
            <section className="services-copy relative w-full h-full mt-[165svh] py-[25svh] px-6 flex items-center justify-center">
                <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
                    <div className="mb-16 text-[0.6rem] tracking-[0.4em] text-[#A78B3E]/60 uppercase border-b border-white/5 pb-4">
                        [ Philosophy ]
                    </div>
                    <h1 className="animate-text relative w-full lg:w-[85%] mx-auto text-[#1f1f1f] text-[2.5rem] md:text-[5vw] font-light tracking-[-0.03em] leading-[1.1] text-center" data-text="I create websites for digital experiences that value clarity above excess. Through minimal form and precise detail, I aim to build work that lasts and offers a quiet sense of order.">
                        I create websites for digital experiences that value clarity above excess. Through minimal form and precise detail, I aim to build work that lasts and offers a quiet sense of order.
                    </h1>
                </div>
            </section>

            {/* Section 5: Outro Image */}
            <section className="relative w-full h-[100svh] p-8 flex items-center justify-center overflow-hidden">
                <div className="w-[85vw] md:w-[350px] aspect-[4/5] overflow-hidden rounded-sm relative opacity-90 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                    <img src="/hero/img2.jpg" alt="Outro" className="parallax-img absolute top-[-10%] left-0 w-full h-[120%] object-cover grayscale opacity-70 transition-all duration-1000 hover:grayscale-0 hover:opacity-100" />
                </div>
                <div className="absolute right-10 top-1/2 -translate-y-1/2 rotate-90 origin-right text-[0.55rem] tracking-[0.3em] text-white/30 uppercase hidden md:block">
                    02 // The End
                </div>
            </section>
        </div>
    );
}
