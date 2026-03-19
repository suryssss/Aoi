'use client';

import React, { useLayoutEffect, useRef, useCallback, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const Hero15 = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const heroImgRef = useRef<HTMLDivElement>(null);
    const heroHeaderRef = useRef<HTMLDivElement>(null);
    const heroCopyRef = useRef<HTMLDivElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLDivElement>(null);
    const outroRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const rafId = useRef<number>(0);

    const [scrollProgress, setScrollProgress] = useState(0);

    const colData = [
        { id: "about-imgs-cols-1", images: [1, 2, 3, 4], x: -500, y: 1000, targetY: -500 },
        { id: "about-imgs-cols-2", images: [5, 6, 7, 8], x: -225, y: 500, targetY: -250 },
        { id: "about-imgs-cols-3", images: [9, 10, 11, 12], x: 225, y: 500, targetY: -250 },
        { id: "about-imgs-cols-4", images: [13, 14, 3, 4], x: 500, y: 1000, targetY: -500 },
    ];

    // Parallax mouse tracking for hero image
    const handleMouseMove = useCallback((e: MouseEvent) => {
        mousePos.current = {
            x: (e.clientX / window.innerWidth - 0.5) * 2,
            y: (e.clientY / window.innerHeight - 0.5) * 2,
        };
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        const animate = () => {
            if (heroImgRef.current) {
                const img = heroImgRef.current.querySelector('img');
                if (img) {
                    gsap.to(img, {
                        x: mousePos.current.x * 15,
                        y: mousePos.current.y * 15,
                        duration: 1.2,
                        ease: 'power2.out',
                        overwrite: 'auto',
                    });
                }
            }
            rafId.current = requestAnimationFrame(animate);
        };
        rafId.current = requestAnimationFrame(animate);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(rafId.current);
        };
    }, [handleMouseMove]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.registerPlugin(ScrollTrigger);
            const lenis = new Lenis();
            lenis.on("scroll", ScrollTrigger.update);
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);

            // --- Entrance animations ---
            const tl = gsap.timeline({ delay: 0.3 });
            if (heroImgRef.current) {
                tl.fromTo(heroImgRef.current,
                    { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.15 },
                    { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.6, ease: 'power4.inOut' }
                );
            }
            const heroH1 = heroHeaderRef.current?.querySelector('h1');
            if (heroH1) {
                tl.fromTo(heroH1,
                    { yPercent: 120, opacity: 0 },
                    { yPercent: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
                    '-=0.8'
                );
            }
            if (navRef.current) {
                tl.fromTo(navRef.current,
                    { yPercent: -100, opacity: 0 },
                    { yPercent: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
                    '-=0.6'
                );
            }
            if (counterRef.current) {
                tl.fromTo(counterRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.6, ease: 'power2.out' },
                    '-=0.4'
                );
            }

            // --- Split words for hero-copy ---
            const copyH3 = heroCopyRef.current?.querySelector('h3');
            let wordElements: NodeListOf<HTMLElement> | null = null;

            if (copyH3) {
                const text = copyH3.innerText;
                copyH3.innerHTML = text.split(' ').map(word =>
                    `<span class="word" style="display:inline-block;margin-right:0.3em;opacity:0;will-change:opacity;transform:translateY(8px);transition:transform 0.3s ease">${word}</span>`
                ).join('');
                wordElements = copyH3.querySelectorAll('.word');
            }

            // --- Scroll-driven hero animation ---
            // PERFORMANCE FIX: Using clip-path + scale instead of width/height
            // clip-path and scale are GPU-composited, avoiding layout reflows
            let isHeroCopyHidden = false;

            ScrollTrigger.create({
                trigger: heroRef.current,
                start: "top top",
                end: `+${window.innerHeight * 3.5}px`,
                pin: true,
                pinSpacing: false,
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    setScrollProgress(progress);

                    // Hero header slides up
                    if (heroHeaderRef.current) {
                        const heroHeaderProgress = Math.min(progress / 0.29, 1);
                        gsap.set(heroHeaderRef.current, {
                            yPercent: -heroHeaderProgress * 100,
                            opacity: 1 - heroHeaderProgress,
                        });
                    }

                    // Words fade in sequentially
                    const heroWordsProgress = Math.max(0, Math.min((progress - 0.29) / 0.21, 1));
                    if (wordElements) {
                        const totalWords = wordElements.length;
                        wordElements.forEach((word, i) => {
                            const wordStart = i / totalWords;
                            const wordEnd = (i + 1) / totalWords;
                            const wordOpacity = Math.max(0, Math.min((heroWordsProgress - wordStart) / (wordEnd - wordStart), 1));
                            gsap.set(word, {
                                opacity: wordOpacity,
                                y: (1 - wordOpacity) * 8,
                            });
                        });
                    }

                    // Hide copy text
                    if (copyH3) {
                        if (progress > 0.64 && !isHeroCopyHidden) {
                            isHeroCopyHidden = true;
                            gsap.to(copyH3, { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' });
                        } else if (progress <= 0.64 && isHeroCopyHidden) {
                            isHeroCopyHidden = false;
                            gsap.to(copyH3, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
                        }
                    }

                    // PERFORMANCE FIX: Hero image shrinks via clip-path inset + scale
                    // instead of animating width/height which triggers layout recalculation
                    if (heroImgRef.current) {
                        const heroImgProgress = Math.max(0, Math.min((progress - 0.71) / 0.29, 1));

                        // Calculate the inset so it shrinks from full-screen to ~150px centered
                        const vw = window.innerWidth;
                        const vh = window.innerHeight;
                        const targetW = 150;
                        const targetH = 150;

                        const insetX = ((vw - targetW) / 2 / vw) * 100 * heroImgProgress;
                        const insetY = ((vh - targetH) / 2 / vh) * 100 * heroImgProgress;
                        const radius = gsap.utils.interpolate(0, 10, heroImgProgress);

                        gsap.set(heroImgRef.current, {
                            clipPath: `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`,
                        });
                    }
                }
            });

            // --- About section column animations ---
            colData.forEach((col) => {
                const el = document.getElementById(col.id);
                if (el) {
                    gsap.set(el, { x: col.x, y: col.y });

                    gsap.to(el, {
                        y: col.targetY,
                        scrollTrigger: {
                            trigger: aboutRef.current,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                        }
                    });
                }
            });

            // --- About header reveal ---
            const aboutHeader = aboutRef.current?.querySelector('.about-header h3');
            if (aboutHeader) {
                gsap.fromTo(aboutHeader,
                    { opacity: 0, y: 60, scale: 0.96 },
                    {
                        opacity: 1, y: 0, scale: 1,
                        scrollTrigger: {
                            trigger: aboutRef.current,
                            start: 'top 60%',
                            end: 'center center',
                            scrub: 1,
                        }
                    }
                );
            }

            // --- Outro reveal ---
            if (outroRef.current) {
                const outroH3 = outroRef.current.querySelector('h3');
                const outroLine = outroRef.current.querySelector('.outro-line');
                if (outroH3) {
                    gsap.fromTo(outroH3,
                        { opacity: 0, y: 80 },
                        {
                            opacity: 1, y: 0,
                            scrollTrigger: {
                                trigger: outroRef.current,
                                start: 'top 70%',
                                end: 'center center',
                                scrub: 1,
                            }
                        }
                    );
                }
                if (outroLine) {
                    gsap.fromTo(outroLine,
                        { scaleX: 0 },
                        {
                            scaleX: 1,
                            scrollTrigger: {
                                trigger: outroRef.current,
                                start: 'top 65%',
                                end: 'center 40%',
                                scrub: 1,
                            }
                        }
                    );
                }
            }

        }, containerRef);

        return () => {
            ctx.revert();
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, []);

    const progressPercent = Math.round(scrollProgress * 100);

    return (
        <main ref={containerRef} className="bg-[#e3e3db] text-black overflow-x-hidden selection:bg-black selection:text-white">
            <style jsx global>{`
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { background-color: #e3e3db; overflow-x: hidden; }
                img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: inherit; }

                h1, h3 { font-weight: 400; letter-spacing: -0.05rem; line-height: 1; font-family: 'Inter', sans-serif; }
                h1 { font-size: 5rem; }
                h3 { font-size: 3rem; }

                .hero { position: relative; width: 100%; height: 100svh; overflow: hidden; }
                .hero-img {
                    position: absolute; top: 0; left: 0;
                    width: 100%; height: 100%;
                    overflow: hidden;
                    will-change: clip-path;
                    clip-path: inset(0% 0% 0% 0%);
                }
                .hero-img img {
                    transform: scale(1.08);
                    will-change: transform;
                }
                .hero-header, .hero-copy {
                    position: absolute; width: 100%; height: 100%; padding: 4rem;
                    color: #fff; display: flex; align-items: flex-end; pointer-events: none;
                    z-index: 2;
                }
                .hero-header h1 { width: 75%; overflow: hidden; }
                .hero-copy h3 { width: 50%; }

                /* Frosted glass nav */
                .hero-nav {
                    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 1.5rem 4rem;
                    color: #fff; mix-blend-mode: difference;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase;
                }
                .hero-nav a {
                    color: inherit; text-decoration: none;
                    position: relative; cursor: pointer;
                    transition: opacity 0.3s ease;
                }
                .hero-nav a:hover { opacity: 0.6; }
                .hero-nav a::after {
                    content: '';
                    position: absolute; bottom: -4px; left: 0; width: 0; height: 1px;
                    background: currentColor;
                    transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .hero-nav a:hover::after { width: 100%; }
                .nav-links { display: flex; gap: 2.5rem; }

                /* Scroll progress counter */
                .scroll-counter {
                    position: fixed; bottom: 2rem; right: 4rem; z-index: 100;
                    font-family: 'Inter', monospace; font-size: 0.75rem;
                    color: #fff; mix-blend-mode: difference;
                    letter-spacing: 0.1em;
                    display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;
                }
                .scroll-counter .progress-bar {
                    width: 2px; height: 60px; background: rgba(255,255,255,0.15);
                    position: relative; overflow: hidden;
                }
                .scroll-counter .progress-fill {
                    position: absolute; bottom: 0; left: 0; width: 100%;
                    background: #fff; transition: height 0.15s linear;
                }

                /* Tag / detail labels */
                .hero-tag {
                    position: absolute; z-index: 3;
                    font-family: 'Inter', sans-serif; font-size: 0.7rem;
                    letter-spacing: 0.15em; text-transform: uppercase;
                    color: #fff; mix-blend-mode: difference;
                    opacity: 0.7; pointer-events: none;
                }
                .hero-tag-left { bottom: 4rem; left: 4rem; writing-mode: vertical-lr; transform: rotate(180deg); }
                .hero-tag-right { top: 50%; right: 4rem; writing-mode: vertical-lr; }

                .about { position: relative; width: 100%; height: 100svh; margin-top: 275svh; }
                .about-images {
                    width: 100%; height: 100%; display: flex; justify-content: center;
                    align-items: center; position: absolute; top: 0; left: 0;
                }
                .about-imgs-col {
                    position: absolute; height: 125%; display: flex; flex-direction: column;
                    justify-content: space-around; will-change: transform;
                }
                .about-imgs-col .img {
                    width: 125px; height: 125px; border-radius: 10px;
                    overflow: hidden; flex-shrink: 0;
                    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s ease;
                }
                .about-imgs-col .img:hover {
                    transform: scale(1.12);
                    box-shadow: 0 20px 50px rgba(0,0,0,0.25);
                }

                .about-header {
                    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    width: 40%; text-align: center; pointer-events: none; z-index: 10;
                }

                .outro {
                    position: relative; width: 100%; height: 100svh;
                    display: flex; flex-direction: column; justify-content: center; align-items: center;
                    text-align: center; background-color: #1a1a18;
                    gap: 2rem; overflow: hidden;
                }
                .outro h3 { width: 35%; color: #e3e3db; }
                .outro-line {
                    width: 120px; height: 1px; background: rgba(227,227,219,0.3);
                    transform-origin: center;
                }
                .outro-cta {
                    margin-top: 1rem;
                    padding: 1rem 3rem;
                    border: 1px solid rgba(227,227,219,0.3);
                    color: #e3e3db;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.85rem;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    text-decoration: none;
                    cursor: pointer;
                    background: transparent;
                    transition: background 0.4s ease, color 0.4s ease, border-color 0.4s ease;
                }
                .outro-cta:hover {
                    background: #e3e3db;
                    color: #1a1a18;
                    border-color: #e3e3db;
                }

                @media(max-width:1000px) {
                    h1 { font-size: 3rem; }
                    h3 { font-size: 2rem; }
                    .hero-nav { padding: 1.2rem 2rem; font-size: 0.75rem; }
                    .nav-links { gap: 1.5rem; }
                    .hero-header, .hero-copy { padding: 2rem; }
                    .about-header, .outro h3 { width: 100%; padding: 2rem; }
                    .about-imgs-col .img { width: 75px; height: 75px; opacity: 0.25; filter: grayscale(100%); }
                    .hero-tag { display: none; }
                    .scroll-counter { right: 2rem; bottom: 1.5rem; }
                }
            `}</style>

            {/* Fixed Navigation */}
            <nav ref={navRef} className="hero-nav">
                <a href="#">Studio</a>
                <div className="nav-links">
                    <a href="#">Work</a>
                    <a href="#">About</a>
                    <a href="#">Contact</a>
                </div>
            </nav>

            {/* Scroll Progress Indicator */}
            <div ref={counterRef} className="scroll-counter">
                <span>{String(progressPercent).padStart(3, '0')}</span>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ height: `${progressPercent}%` }} />
                </div>
            </div>

            <section ref={heroRef} className="hero">
                <div ref={heroImgRef} className="hero-img">
                    <img src="/hero/hero8/img1.jpg" alt="Hero" />
                </div>
                <div ref={heroHeaderRef} className="hero-header">
                    <h1>A study of motion unfolding inside a single frame</h1>
                </div>
                <div ref={heroCopyRef} className="hero-copy">
                    <h3>The moment where stillness transforms into movement</h3>
                </div>

                {/* Vertical detail tags */}
                <span className="hero-tag hero-tag-left">Concept N°15 — 2026</span>
                <span className="hero-tag hero-tag-right">Scroll to Explore ↓</span>
            </section>

            <section ref={aboutRef} className="about">
                <div className="about-images">
                    {colData.map((col) => (
                        <div key={col.id} id={col.id} className="about-imgs-col">
                            {col.images.map((imgIdx, i) => (
                                <div key={i} className="img">
                                    <img src={`/hero/hero8/img${imgIdx}.jpg`} alt="" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="about-header">
                    <h3>Fragments of motion and atmosphere gathered into a drifting collection of quiet visual moments</h3>
                </div>
            </section>

            <section ref={outroRef} className="outro">
                <div className="outro-line" />
                <h3>The frame settles back into quiet stillness</h3>
                <div className="outro-line" />
                <a className="outro-cta" href="#">Begin Again</a>
            </section>
        </main>
    );
};

export default Hero15;
