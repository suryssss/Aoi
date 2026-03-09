"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Image from "next/image";
import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
    weight: "400",
    style: ["normal", "italic"],
    subsets: ["latin"],
});

const CONFIG = {
    cardCount: 15,
    cardWidth: 250,
    cardHeight: 300,
    animationDuration: 0.8,
    headingFadeDuration: 0.5,
    headings: [
        "Whispers of dawn awaken the slumbering woods",
        "Golden leaves scatter in the gentle autumn breeze",
        "The river carves its story through the ancient stone",
        "Roots dig deeper as the canopy stretches to the sky",
    ],
};

const Hero12 = () => {
    const galleryRef = useRef<HTMLDivElement>(null);
    const galleryHeadingRef = useRef<HTMLHeadingElement>(null);
    const cardsRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
            smoothWheel: true,
            lerp: 0.1
        });
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        const gallery = galleryRef.current;
        const galleryHeading = galleryHeadingRef.current;
        if (!gallery || !galleryHeading) return;

        let viewPort = {
            centerX: window.innerWidth / 2,
            centerY: window.innerHeight / 2,
            rangeMin: Math.min(window.innerWidth, window.innerHeight) * 0.35,
            rangeMax: Math.max(window.innerWidth, window.innerHeight) * 0.7,
        };

        let state = {
            activeCards: [] as any[],
            currentSection: 0,
            isAnimating: false,
        };

        const allCards = cardsRefs.current.filter((c) => c !== null).map((el) => ({
            element: el as HTMLDivElement,
            active: false,
            centerX: 0,
            centerY: 0,
        }));

        function updateViewport() {
            viewPort.centerX = window.innerWidth / 2;
            viewPort.centerY = window.innerHeight / 2;
            viewPort.rangeMin = Math.min(window.innerWidth, window.innerHeight) * 0.35;
            viewPort.rangeMax = Math.max(window.innerWidth, window.innerHeight) * 0.7;
        }

        function getEdgePosition(centerX: number, centerY: number) {
            const distance = {
                left: centerX,
                right: window.innerWidth - centerX,
                top: centerY,
                bottom: window.innerHeight - centerY,
            };

            const minDistance = Math.min(...Object.values(distance));
            const cardCenterOffsetX = CONFIG.cardWidth / 2;
            const cardCenterOffsetY = CONFIG.cardHeight / 2;
            const offsetVariation = () => (Math.random() - 0.5) * 400;

            if (minDistance === distance.left) {
                return {
                    x: -300 - Math.random() * 200,
                    y: centerY - cardCenterOffsetY + offsetVariation(),
                };
            }
            if (minDistance === distance.right) {
                return {
                    x: window.innerWidth + 50 + Math.random() * 200,
                    y: centerY - cardCenterOffsetY + offsetVariation(),
                };
            }
            if (minDistance === distance.top) {
                return {
                    x: centerX - cardCenterOffsetX + offsetVariation(),
                    y: -300 - Math.random() * 200,
                };
            }
            return {
                x: centerX - cardCenterOffsetX + offsetVariation(),
                y: window.innerHeight + 50 + Math.random() * 200,
            };
        }

        function createCard(setNumber: number) {
            const cards = [];
            const inactiveCards = allCards.filter((c) => !c.active);

            for (let i = 0; i < CONFIG.cardCount; i++) {
                if (!inactiveCards[i]) break;
                const cardObj = inactiveCards[i];
                cardObj.active = true;
                const card = cardObj.element;

                const angle = Math.random() * Math.PI * 2;
                const radius =
                    viewPort.rangeMin +
                    Math.random() * (viewPort.rangeMax - viewPort.rangeMin);
                const centerX = viewPort.centerX + Math.cos(angle) * radius;
                const centerY = viewPort.centerY + Math.sin(angle) * radius;
                gsap.set(card, {
                    left: centerX - CONFIG.cardWidth / 2,
                    top: centerY - CONFIG.cardHeight / 2,
                    rotation: Math.random() * 50 - 25,
                    display: "block",
                    opacity: 0,
                    transformPerspective: 1000,
                    zIndex: Math.floor(Math.random() * 50)
                });

                cardObj.centerX = centerX;
                cardObj.centerY = centerY;

                cards.push(cardObj);
            }
            return cards;
        }

        function animateHeading(newText: string) {
            return gsap
                .timeline()
                .to(galleryHeading, {
                    opacity: 0,
                    scale: 0.95,
                    filter: "blur(8px)",
                    y: -20,
                    duration: CONFIG.headingFadeDuration,
                    ease: "power2.inOut",
                })
                .call(() => {
                    if (galleryHeading) galleryHeading.textContent = newText;
                })
                .set(galleryHeading, { y: 20 })
                .to(galleryHeading, {
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                    y: 0,
                    duration: CONFIG.headingFadeDuration * 1.4,
                    ease: "power3.out",
                });
        }

        function animateCards(exitingCards: any[], enteringCards: any[]) {
            const t1 = gsap.timeline();

            exitingCards.forEach(({ element, centerX, centerY }, i) => {
                const targetEdge = getEdgePosition(centerX, centerY);
                t1.to(
                    element,
                    {
                        left: targetEdge.x,
                        top: targetEdge.y,
                        rotation: Math.random() * 180 - 90,
                        rotationX: Math.random() * 60 - 30,
                        rotationY: Math.random() * 60 - 30,
                        scale: 0.5,
                        opacity: 0,
                        filter: "blur(15px) brightness(0.4)",
                        duration: CONFIG.animationDuration * 1.2,
                        ease: "power3.inOut",
                        onComplete: () => {
                            gsap.set(element, { display: "none", filter: "none", rotationX: 0, rotationY: 0 });
                            const poolObj = allCards.find((c) => c.element === element);
                            if (poolObj) poolObj.active = false;
                        },
                    },
                    i * 0.03
                );
            });

            enteringCards.forEach(({ element, centerX, centerY }, i) => {
                const targetEdge = getEdgePosition(centerX, centerY);

                gsap.set(element, {
                    left: targetEdge.x,
                    top: targetEdge.y,
                    rotation: Math.random() * 180 - 90,
                    rotationX: Math.random() * 80 - 40,
                    rotationY: Math.random() * 80 - 40,
                    opacity: 0,
                    scale: 1.5,
                    filter: "blur(25px) brightness(2)",
                    transformPerspective: 1000,
                    zIndex: Math.floor(Math.random() * 50)
                });

                t1.to(
                    element,
                    {
                        left: centerX - CONFIG.cardWidth / 2,
                        top: centerY - CONFIG.cardHeight / 2,
                        rotation: Math.random() * 50 - 25,
                        rotationX: 0,
                        rotationY: 0,
                        opacity: 1,
                        scale: 1,
                        filter: "blur(0px) brightness(1)",
                        duration: CONFIG.animationDuration * 1.6,
                        ease: "power4.out",
                    },
                    0.2 + i * 0.05
                );
            });
            return t1;
        }

        function getSectionIndex(progress: number) {
            if (progress < 0.25) return 0;
            if (progress < 0.5) return 1;
            if (progress < 0.75) return 2;
            return 3;
        }

        function reinitialize() {
            state.activeCards.forEach((c) => {
                gsap.set(c.element, { display: "none" });
                c.active = false;
            });
            updateViewport();
            state.activeCards = createCard(state.currentSection + 1);

            state.activeCards.forEach(c => {
                gsap.set(c.element, {
                    left: c.centerX - CONFIG.cardWidth / 2,
                    top: c.centerY - CONFIG.cardHeight / 2,
                    rotation: Math.random() * 50 - 25,
                    rotationX: 0,
                    rotationY: 0,
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px) brightness(1)",
                    display: "block",
                    transformPerspective: 1000,
                    zIndex: Math.floor(Math.random() * 50)
                });
            });
        }
        state.activeCards = createCard(1);
        state.activeCards.forEach(c => {
            gsap.to(c.element, { opacity: 1, duration: 0.5 });
        });

        if (galleryHeading) {
            galleryHeading.textContent = CONFIG.headings[0];
            gsap.set(galleryHeading, { opacity: 1, filter: "blur(0px)", scale: 1, y: 0 });
        }

        const st = ScrollTrigger.create({
            trigger: ".h12-gallery-wrap",
            start: "top top",
            end: () => `+=${window.innerHeight * 6}`,
            pin: true,
            pinSpacing: true,
            onUpdate: ({ progress }) => {
                if (state.isAnimating) return;

                const targetSection = getSectionIndex(progress);
                if (targetSection === state.currentSection) return;

                state.isAnimating = true;
                const newCards = createCard(targetSection + 1);

                Promise.all([
                    animateCards(state.activeCards, newCards).then(),
                    animateHeading(CONFIG.headings[targetSection]).then(),
                ]).then(() => {
                    state.activeCards = newCards;
                    state.currentSection = targetSection;
                    state.isAnimating = false;
                });
            },
        });

        const handleResize = () => {
            reinitialize();
            ScrollTrigger.refresh();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            st.kill();
            lenis.destroy();
            gsap.ticker.remove((time) => lenis.raf(time * 1000));
        };
    }, []);
    const poolSize = 45;

    return (
        <div style={instrumentSerif.style} className={`h12-container relative bg-neutral-950 text-white overflow-x-hidden ${instrumentSerif.className}`}>
            <style>{`
        .h12-container {
            /* local wrapper */
        }
        .h12-section {
          position: relative;
          width: 100%;
          height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .h12-heading {
          position: relative;
          font-size: clamp(3rem, 5vw, 7vw);
          font-weight: 500;
          line-height: 0.9;
          letter-spacing: -0.025rem;
          width: 45%;
          text-align: center;
          will-change: opacity, transform, filter;
          z-index: 200;
          color: #fff;
          text-shadow: 0 10px 40px rgba(0,0,0,0.8);
          pointer-events: none;
        }
        @media(max-width:1000px) {
          .h12-heading {
            width: 100%;
            padding: 2rem;
          }
        }
        .h12-intro, .h12-outro {
          background-color: #0f0f0f;
          z-index: 10;
        }
        .h12-gallery-wrap {
          background-color: #141414;
        }
        .h12-card {
          position: absolute;
          width: 250px;
          height: 300px;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), inset 0 0 15px rgba(255,255,255,0.05);
          will-change: transform, opacity, filter, left, top;
          overflow: hidden;
          display: none;
          z-index: 1;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          transition: border-color 0.4s ease, box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        
        .h12-card:hover {
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 35px 70px rgba(0, 0, 0, 0.9), inset 0 0 30px rgba(255,255,255,0.25);
          z-index: 100 !important;
        }

        .h12-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 60%);
          z-index: 2;
          pointer-events: none;
          transition: opacity 0.5s ease;
        }
        
        .h12-card:hover::after {
          opacity: 0.9; 
        }

        .h12-scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          opacity: 0.6;
          animation: bounce 2s infinite ease-in-out;
          color: #fff;
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-10px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
          }
        }
      `}</style>

            <section className="h12-section h12-intro">
                <h1 className="h12-heading">Whispers of dawn awaken the slumbering woods</h1>
                <div className="h12-scroll-indicator">Scroll to see the magic ↓</div>
            </section>

            <section className="h12-section h12-gallery-wrap" ref={galleryRef}>
                <h1 className="h12-heading" ref={galleryHeadingRef}></h1>

                {Array.from({ length: poolSize }).map((_, i) => (
                    <div
                        key={i}
                        className="h12-card"
                        ref={(el) => {
                            if (el) cardsRefs.current[i] = el;
                        }}
                    >
                        <Image
                            src={"/hero/hero8/img" + ((i % 14) + 1) + ".jpg"}
                            alt={"Gallery image " + (i + 1)}
                            fill
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                            sizes="(max-width: 768px) 100vw, 250px"
                            className="object-cover"
                            quality={75}
                            priority={i < 15}
                        />
                    </div>
                ))}
            </section>

            <section className="h12-section h12-outro">
                <h1 className="h12-heading">A quiet dusk settles, and the stars begin their vigil</h1>
            </section>
        </div>
    );
};

export default Hero12;
