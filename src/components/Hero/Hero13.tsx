'use client'
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

const Hero13 = () => {
    const counterRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set([".nav", ".hero-img", ".hero-content"], { y: "35svh" });
            gsap.set(".hero-img img", { scale: 1.3 });

            const animateCounter = (duration = 5, delay = 0) => {
                const counterElement = counterRef.current;
                if (!counterElement) return;

                let currentValue = 0;
                const updateInterval = 200;
                const maxDuration = duration * 1000;
                const startTime = Date.now();

                setTimeout(() => {
                    const updateCounter = () => {
                        const elapsedTime = Date.now() - startTime;
                        const progress = elapsedTime / maxDuration;

                        if (currentValue < 100 && elapsedTime < maxDuration) {
                            const target = Math.floor(progress * 100);
                            const jump = Math.floor(Math.random() * 25) + 5;
                            currentValue = Math.min(currentValue + jump, target, 100);

                            counterElement.textContent = currentValue.toString().padStart(2, "0");
                            setTimeout(updateCounter, updateInterval + Math.random() * 100);
                        } else {
                            counterElement.textContent = "100";
                        }
                    };
                    updateCounter();
                }, delay * 1000);
            };

            animateCounter(4.5, 2);

            const t1 = gsap.timeline();

            t1.to([".preloader-copy .line", ".preloader-counter .line"], {
                y: "0%",
                duration: 1.2,
                stagger: 0.05,
                ease: "expo.out",
                delay: 0.5,
            })
                .to(".preloader-reveal", {
                    scale: 0.05,
                    duration: 0.8,
                    ease: "power2.inOut"
                }, "<0.5")
                .to(".preloader-reveal", {
                    scale: 0.2,
                    duration: 1,
                    ease: "power3.inOut",
                })
                .to(".preloader-reveal", {
                    scale: 0.45,
                    duration: 0.8,
                    ease: "power3.inOut",
                })
                .to(".preloader-reveal", {
                    scale: 0.8,
                    duration: 0.6,
                    ease: "power2.inOut",
                })
                .to(".preloader-reveal", {
                    scale: 1,
                    duration: 1.2,
                    ease: "power4.inOut",
                })
                .to(".preloader", {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                    duration: 1.5,
                    ease: "power4.inOut"
                }, "-=0.8")
                .to([".nav", ".hero-img", ".hero-content"], {
                    y: "0%",
                    duration: 1.5,
                    ease: "power4.out",
                    stagger: 0.05
                }, "<")
                .to(".hero-img img", {
                    scale: 1,
                    duration: 2.5,
                    ease: "power3.out"
                }, "<");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="w-screen h-screen overflow-hidden relative bg-[#F6F4F0] text-[#100F0D] font-['Outfit',sans-serif] antialiased box-border">
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Outfit:wght@300;400;500;600&display=swap');
                
                @keyframes rotateAura {
                    0% { transform: rotate(0deg) scale(1); }
                    50% { transform: rotate(180deg) scale(1.05); }
                    100% { transform: rotate(360deg) scale(1); }
                }
            `}} />

            <div className="preloader fixed inset-0 flex flex-col justify-between p-8 lg:p-16 bg-[#100F0D] text-[#F6F4F0] z-[100] [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)] overflow-hidden">
                {/* noise */}
                <div className="absolute inset-0 opacity-[0.12] z-[15] pointer-events-none mix-blend-color-dodge" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}></div>

                <div className="preloader-reveal absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-0 w-[max(150vw,150vh)] aspect-square rounded-full bg-[radial-gradient(circle,rgba(230,220,209,0.95)_0%,rgba(140,124,107,0.4)_30%,transparent_65%)] shadow-[inset_0_0_100px_rgba(246,244,240,0.2),0_0_250px_rgba(140,124,107,0.4)] mix-blend-screen z-10 pointer-events-none">
                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0%,rgba(246,244,240,0.6)_25%,transparent_50%,rgba(140,124,107,0.8)_75%,transparent_100%)] mix-blend-overlay blur-[30px]" style={{ animation: 'rotateAura 5s linear infinite' }}></div>
                </div>

                <div className="preloader-copy flex flex-col lg:flex-row w-full justify-between relative z-20 mt-[10vh] lg:mt-[20vh] gap-12 lg:gap-0">
                    <div className="w-full lg:w-[35%]">
                        <p className="text-xl lg:text-[1.4rem] leading-relaxed font-light text-[rgba(246,244,240,0.7)]">
                            <span className="line-wrapper overflow-hidden block">
                                <span className="line block translate-y-[120%]">HandPicked collections shaped by artistry,</span>
                            </span>
                            <span className="line-wrapper overflow-hidden block">
                                <span className="line block translate-y-[120%]">balancing rare elements with a focus on purity</span>
                            </span>
                        </p>
                    </div>
                    <div className="w-full lg:w-[35%]">
                        <p className="text-xl lg:text-[1.4rem] leading-relaxed font-light text-[rgba(246,244,240,0.7)]">
                            <span className="line-wrapper overflow-hidden block">
                                <span className="line block translate-y-[120%]">Explore timeless essentials build with care,</span>
                            </span>
                            <span className="line-wrapper overflow-hidden block">
                                <span className="line block translate-y-[120%]">thoughtfully designed to guide you.</span>
                            </span>
                        </p>
                    </div>
                </div>

                <div className="preloader-counter self-start lg:self-end relative z-20 mt-auto">
                    <p className="font-['Bodoni_Moda',serif] text-[clamp(8rem,15vw,16rem)] leading-[0.75] font-normal text-[#F6F4F0] tracking-[-0.05em]">
                        <span className="line-wrapper overflow-hidden block">
                            <span className="line block translate-y-[120%]" ref={counterRef}>00</span>
                        </span>
                    </p>
                </div>
            </div>

            <nav className="nav fixed top-0 left-0 w-full flex justify-between items-center p-8 lg:p-10 z-10 uppercase text-xs tracking-wider font-medium text-[#F6F4F0]">
                <div className="nav-logo flex-1 flex">
                    <a href="#" className="text-[#F6F4F0] mix-blend-exclusion transition-opacity duration-300 hover:opacity-70">Aura</a>
                </div>
                <div className="nav-links hidden lg:flex flex-[2] justify-center gap-12">
                    <a href="#" className="text-[#F6F4F0] mix-blend-exclusion transition-opacity duration-300 hover:opacity-70">Home</a>
                    <a href="#" className="text-[#F6F4F0] mix-blend-exclusion transition-opacity duration-300 hover:opacity-70">About</a>
                    <a href="#" className="text-[#F6F4F0] mix-blend-exclusion transition-opacity duration-300 hover:opacity-70">Contact</a>
                    <a href="#" className="text-[#F6F4F0] mix-blend-exclusion transition-opacity duration-300 hover:opacity-70">Collections</a>
                </div>
                <div className="nav-cta hidden lg:flex flex-1 justify-end">
                    <a href="#" className="text-[#F6F4F0] mix-blend-exclusion transition-opacity duration-300 hover:opacity-70">Create Account</a>
                </div>
            </nav>

            <section className="hero relative w-full h-[100svh] overflow-hidden">
                <div className="hero-img absolute inset-0 w-full h-full after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-t after:from-[rgba(16,15,13,0.6)] after:to-transparent after:to-40% after:pointer-events-none">
                    <Image src="/img1.avif" alt="hero image" layout="fill" objectFit="cover" className="w-full h-full object-cover" />
                </div>
                <div className="hero-content absolute left-8 right-8 bottom-8 lg:left-16 lg:right-16 lg:bottom-16 flex flex-col lg:flex-row justify-between lg:align-bottom lg:items-end text-[#F6F4F0] gap-8 lg:gap-0 z-10 w-auto">
                    <div className="product-name flex flex-col gap-6">
                        <div className="meta-label font-light uppercase tracking-[0.15em] text-xs opacity-75 relative pl-12 flex items-center before:content-[''] before:absolute before:left-0 before:w-8 before:h-[1px] before:bg-[#F6F4F0] before:opacity-50">
                            SS / 26 — New Arrivals
                        </div>
                        <p className="font-['Bodoni_Moda',serif] text-[clamp(4rem,8vw,9rem)] leading-[0.85] tracking-[-0.04em] font-normal italic whitespace-nowrap">
                            Ember No.04
                        </p>
                    </div>
                    <div className="product-link group flex items-center gap-4 pb-2 cursor-pointer">
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"
                            className="arrow-icon text-[#F6F4F0] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:[transform:rotateX(180deg)_rotate(-45deg)_scale(1.1)] group-hover:opacity-70">
                            <circle cx="17" cy="17" r="16" stroke="currentColor" strokeOpacity="0.3" />
                            <path d="M12 17L22 17M22 17L18 13M22 17L18 21" stroke="currentColor" strokeWidth="1.2"
                                strokeLinejoin="round" />
                        </svg>
                        <a href="#" className="text-[#F6F4F0] uppercase text-sm tracking-wider relative no-underline pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[rgba(246,244,240,0.4)] after:origin-right after:transition-all after:duration-500 after:ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:after:scale-x-0 group-hover:after:origin-left transition-opacity duration-300 hover:opacity-70 mix-blend-exclusion">
                            View the Collection
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Hero13;
