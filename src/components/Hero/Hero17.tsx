'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const splitTextToWords = (text: string) => {
    return text.split(' ').map((word) =>
        `<span class="inline-block overflow-hidden align-top mr-1">
            <span class="word inline-block will-change-transform opacity-0 translate-y-[110%]">${word}</span>
         </span>`
    ).join('');
};

const slides = [
    {
        title: "Under the soft hum of streetlights she watches the world ripple through glass, her calm expression mirrored in the fragments of drifting light.",
        image: "/hero/hero9/1.jpg",
    },
    {
        title: "A car slices through the desert, shadow chasing the wind as clouds of dust rise behind, blurring the horizon into gold and thunder.",
        image: "/hero/hero9/2.jpg",
    },
    {
        title: "Reflections ripple across mirrored faces, each one a fragment of identity, caught between defiance, doubt, and the silence of thought.",
        image: "/hero/hero9/3.jpg",
    },
    {
        title: "Soft light spills through the café windows as morning settles into wood and metal, capturing the rhythm of quiet human routine.",
        image: "/hero/hero9/4.jpg",
    },
    {
        title: "Every serve becomes a battle between focus and instinct, movement flowing like rhythm as the court blurs beneath the sunlight.",
        image: "/hero/hero9/1.jpg",
    },
    {
        title: "Amber light spills over the stage as guitars cry into smoke and shadow, where music and motion merge into pure energy.",
        image: "/hero/hero9/2.jpg",
    },
    {
        title: "Dust erupts beneath his stride as sweat glints under floodlights, every step pushing closer to victory, grit, and pure determination.",
        image: "/hero/hero9/3.jpg",
    },
];

gsap.registerPlugin(ScrollTrigger);

const Hero17: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const sliderImagesRef = useRef<HTMLDivElement>(null);
    const sliderTitleRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {

            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);

            const pinDistance = window.innerHeight * slides.length;
            let activeSlide = 0;

            const animateNewTitle = (index: number) => {
                if (!sliderTitleRef.current) return;

                sliderTitleRef.current.innerHTML = `<h1 class="text-[clamp(2rem,4vw,3.5rem)] font-light tracking-tight leading-[1.15] text-white">${splitTextToWords(slides[index].title)}</h1>`;

                const words = sliderTitleRef.current.querySelectorAll('.word');
                gsap.fromTo(words,
                    { yPercent: 110, opacity: 0 },
                    {
                        yPercent: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.03,
                        ease: 'power4.out',
                        overwrite: true
                    }
                );
            };

            const animateIndicators = (index: number) => {
                if (!containerRef.current) return;
                const indicators = containerRef.current.querySelectorAll('.slider-indicator-item');

                indicators.forEach((indicator, i) => {
                    const marker = indicator.querySelector('.marker');
                    const idxEl = indicator.querySelector('.index');

                    if (i === index) {
                        gsap.to(idxEl, { opacity: 1, duration: 0.4, ease: "power3.out" });
                        gsap.to(marker, { scaleX: 1, duration: 0.4, ease: "power3.out" });
                    } else {
                        gsap.to(idxEl, { opacity: 0.35, duration: 0.4, ease: "power3.out" });
                        gsap.to(marker, { scaleX: 0, duration: 0.4, ease: "power3.out" });
                    }
                });
            };

            const animateNewSlide = (index: number) => {
                if (!sliderImagesRef.current) return;

                const newImg = document.createElement("img");
                newImg.src = slides[index].image;
                newImg.alt = `Slide ${index + 1}`;
                newImg.className = "absolute top-0 left-0 w-full h-full object-cover will-change-transform origin-center";

                gsap.set(newImg, { opacity: 0, scale: 1.15, filter: 'blur(10px)' });
                sliderImagesRef.current.appendChild(newImg);

                gsap.to(newImg, {
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 0.8,
                    ease: "power3.out"
                });
                gsap.to(newImg, {
                    scale: 1,
                    duration: 1.6,
                    ease: "power2.out"
                });

                const allImages = sliderImagesRef.current.querySelectorAll("img");
                if (allImages.length > 3) {
                    const removeCount = allImages.length - 3;
                    for (let i = 0; i < removeCount; i++) {
                        sliderImagesRef.current.removeChild(allImages[i]);
                    }
                }

                animateNewTitle(index);
                animateIndicators(index);
            };

            // Initialize Slide 0
            animateNewTitle(0);
            animateIndicators(0);

            ScrollTrigger.create({
                trigger: sliderRef.current,
                start: "top top",
                end: `+=${pinDistance}px`,
                scrub: 1,
                pin: true,
                pinSpacing: true,
                onUpdate: (self) => {
                    if (progressBarRef.current) {
                        gsap.set(progressBarRef.current, { scaleY: self.progress });
                    }

                    const currentSlide = Math.floor(self.progress * slides.length);

                    if (activeSlide !== currentSlide && currentSlide < slides.length) {
                        activeSlide = currentSlide;
                        animateNewSlide(currentSlide);
                    }
                }
            });

            // Intro out / Outro in parallax
            const introH1 = containerRef.current?.querySelector('.intro-section h1');
            const outroH1 = containerRef.current?.querySelector('.outro-section h1');

            if (introH1) {
                gsap.to(introH1, {
                    yPercent: 50,
                    opacity: 0,
                    scrollTrigger: {
                        trigger: '.intro-section',
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true
                    }
                });
            }

            if (outroH1) {
                gsap.from(outroH1, {
                    yPercent: -50,
                    opacity: 0,
                    scrollTrigger: {
                        trigger: '.outro-section',
                        start: 'top bottom',
                        end: 'center center',
                        scrub: true
                    }
                });
            }

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="font-[Inter,Arial,Helvetica,sans-serif] bg-[#0f0f0f] text-white overflow-x-hidden w-full">

            {/* Nav */}
            <nav className="fixed top-0 w-full flex justify-between items-center p-8 z-50 pointer-events-none">
                <div className="border border-white/10 rounded-lg bg-black/40 backdrop-blur-[20px] px-5 py-3 pointer-events-auto hover:bg-white/10 transition-colors duration-300">
                    <p className="uppercase text-xs tracking-widest text-white font-light">Aura</p>
                </div>
                <div>
                    <p className="uppercase text-xs tracking-widest text-white font-light">[Scroll motion slider]</p>
                </div>
            </nav>

            {/* Intro */}
            <section className="intro-section relative w-full h-svh overflow-hidden p-8 flex items-center justify-center bg-[#0f0f0f]">
                <h1 className="w-[60%] max-lg:w-[90%] mx-auto text-center text-white font-light text-[clamp(2rem,4vw,3.5rem)] tracking-tight leading-[1.15]">
                    Scroll to explore the rhythm of still images move quickly between story and sensation
                </h1>
            </section>

            {/* Slider */}
            <section className="relative w-full h-svh overflow-hidden" ref={sliderRef}>
                {/* Images container with gradient overlay */}
                <div
                    className="absolute w-full h-full after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:z-[1] after:pointer-events-none after:bg-gradient-to-r after:from-black/60 after:to-black/10 max-lg:after:bg-gradient-to-b max-lg:after:from-black/60 max-lg:after:to-black/30"
                    ref={sliderImagesRef}
                >
                    <img
                        src={slides[0].image}
                        alt="Slide 1"
                        className="absolute top-0 left-0 w-full h-full object-cover origin-center will-change-transform"
                        style={{ opacity: 1 }}
                    />
                </div>

                {/* Title */}
                <div
                    className="absolute top-1/2 left-16 -translate-y-1/2 w-[45%] z-[2] max-lg:top-20 max-lg:left-0 max-lg:translate-y-0 max-lg:w-full max-lg:p-8"
                    ref={sliderTitleRef}
                >
                    <h1
                        className="text-[clamp(2rem,4vw,3.5rem)] font-light tracking-tight leading-[1.15] text-white"
                        dangerouslySetInnerHTML={{ __html: splitTextToWords(slides[0].title) }}
                    />
                </div>

                {/* Indicators */}
                <div className="absolute top-1/2 right-16 -translate-y-1/2 z-[2] max-lg:top-auto max-lg:translate-y-0 max-lg:bottom-8 max-lg:right-8">
                    <div className="flex flex-col gap-6 p-6">
                        {slides.map((_, i) => (
                            <p key={i} className="slider-indicator-item flex items-center gap-4 text-white m-0">
                                <span
                                    className="marker relative w-4 h-px bg-white origin-right will-change-transform"
                                    style={{ transform: i === 0 ? 'scaleX(1)' : 'scaleX(0)' }}
                                ></span>
                                <span
                                    className="index relative w-5 flex justify-end will-change-[opacity] tabular-nums tracking-widest text-sm"
                                    style={{ opacity: i === 0 ? 1 : 0.35 }}
                                >
                                    {(i + 1).toString().padStart(2, '0')}
                                </span>
                            </p>
                        ))}
                    </div>
                    <div className="absolute top-0 right-0 w-px h-full bg-white/20">
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-white origin-top will-change-transform"
                            style={{ transform: 'scaleY(0)' }}
                            ref={progressBarRef}
                        ></div>
                    </div>
                </div>
            </section>

            {/* Outro */}
            <section className="outro-section relative w-full h-svh overflow-hidden p-8 flex items-center justify-center bg-[#0f0f0f]">
                <h1 className="w-[60%] max-lg:w-[90%] mx-auto text-center text-white font-light text-[clamp(2rem,4vw,3.5rem)] tracking-tight leading-[1.15]">
                    As the sequence slows the silence takes over, holding the last traces of motion in the air
                </h1>
            </section>
        </div>
    );
};

export default Hero17;
