"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

type Props = {};

const Hero7 = (props: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLHeadingElement>(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            CustomEase.create("hop", "0.85,0,0.15,1");

            const counter = { value: 0 };
            const counterTl = gsap.timeline({ delay: 0.5 });
            const overlayTextTl = gsap.timeline({ delay: 0.75 });
            const revealTl = gsap.timeline({ delay: 0.5 });

            counterTl.to(counter, {
                value: 100,
                duration: 5,
                ease: "power2.out",
                onUpdate: () => {
                    if (counterRef.current) {
                        counterRef.current.textContent = Math.floor(counter.value).toString();
                    }
                },
            });

            overlayTextTl
                .to(".overlay-text", { y: "0", duration: 0.75, ease: "hop" })
                .to(".overlay-text", { y: "-2rem", duration: 0.75, ease: "hop", delay: 0.75 })
                .to(".overlay-text", { y: "-4rem", duration: 0.75, ease: "hop", delay: 0.75 })
                .to(".overlay-text", { y: "-6rem", duration: 0.75, ease: "hop", delay: 1 });

            revealTl
                .to(".img", {
                    y: 0,
                    opacity: 1,
                    stagger: 0.05,
                    duration: 1,
                    ease: "hop",
                })
                .to(".hero-images", { gap: "0.75rem", delay: 0.5, ease: "hop" })
                .to(".img", { scale: 1, duration: 1, ease: "hop" }, "<")
                .to(".img:not(.hero-img)", {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                    duration: 1,
                    stagger: 0.1,
                    ease: "hop",
                }, "-=0.4")
                .to(".hero-img", { scale: 2.2, duration: 1.2, ease: "hop" }, "<")
                .to(".hero-overlay", {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                    duration: 1.2,
                    ease: "hop",
                }, "<0.2")
                .to(
                    ".hero-header h1 .word",
                    {
                        y: "0",
                        duration: 1.2,
                        stagger: 0.05,
                        ease: "power3.out",
                    },
                    "-=0.8"
                );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const splitText = (text: string) => {
        return text.split(" ").map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-1">
                <span className="word inline-block translate-y-[100%] will-change-transform leading-none">
                    {word}
                </span>
                {i < text.split(" ").length - 1 && "\u00A0"}
            </span>
        ));
    };

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-white text-black overflow-hidden font-medium">
            <nav className="fixed top-0 w-full p-6 md:p-8 flex justify-between items-start z-10 font-mono text-sm leading-tight text-black mix-blend-difference text-white">
                <div className="nav-logo">
                    <a href="#" className="uppercase tracking-tighter mix-blend-difference text-white">Nature</a>
                </div>
                <div className="nav-items flex flex-col items-end uppercase mix-blend-difference text-white">
                    <a href="#">Home</a>
                    <a href="#">Forests</a>
                    <a href="#">Oceans</a>
                    <a href="#">Mountains</a>
                    <a href="#">Wildlife</a>
                </div>
            </nav>

            <section className="hero absolute w-full h-screen">
                <div
                    className="hero-overlay absolute top-0 left-0 w-full h-screen bg-[#0f0f0f] z-[2] will-change-[clip-path]"
                    style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
                >
                    <div className="counter absolute right-4 md:right-8 bottom-4 md:bottom-8 text-white">
                        <h1 ref={counterRef} className="text-[4rem] font-medium leading-[1]">0</h1>
                    </div>

                    <div className="overlay-text-container absolute top-4 md:top-8 left-4 md:left-8 h-8 overflow-hidden font-mono text-sm uppercase font-medium">
                        <div className="overlay-text flex flex-col translate-y-[2rem] will-change-transform text-white">
                            <p className="h-8 flex items-center">Vibrant</p>
                            <p className="h-8 flex items-center">Serene</p>
                            <p className="h-8 flex items-center">Untamed</p>
                            <p className="h-8 flex items-center"></p>
                        </div>
                    </div>
                </div>

                <div className="hero-images absolute top-1/2 left-0 -translate-y-1/2 w-full px-2 md:px-8 flex justify-center gap-[2.5vw] md:gap-[10vw] z-[3] will-change-[gap]">
                    <div
                        className="img w-[20vw] md:w-[10vw] aspect-[5/7] translate-y-[50%] scale-50 opacity-0 bg-[#333] will-change-[opacity,transform,clip-path]"
                        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
                    >
                        <img src="/hero/hero7/img3.jpg" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div
                        className="img w-[20vw] md:w-[10vw] aspect-[5/7] translate-y-[50%] scale-50 opacity-0 bg-[#333] will-change-[opacity,transform,clip-path]"
                        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
                    >
                        <img src="/hero/hero7/img2.png" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div
                        className="img hero-img w-[20vw] md:w-[10vw] aspect-[5/7] translate-y-[50%] scale-50 opacity-0 bg-[#333] will-change-[opacity,transform,clip-path]"
                        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
                    >
                        <img src="/hero/hero7/img1.jpg" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div
                        className="img w-[20vw] md:w-[10vw] aspect-[5/7] translate-y-[50%] scale-50 opacity-0 bg-[#333] will-change-[opacity,transform,clip-path]"
                        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
                    >
                        <img src="/hero/hero7/img4.jpg" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div
                        className="img w-[20vw] md:w-[10vw] aspect-[5/7] translate-y-[50%] scale-50 opacity-0 bg-[#333] will-change-[opacity,transform,clip-path]"
                        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
                    >
                        <img src="/hero/hero7/img5.jpg" alt="" className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="hero-header absolute bottom-8 md:bottom-12 left-0 w-full z-[1]">
                    <h1 className="uppercase text-center text-[13vw] leading-[0.85] font-medium tracking-tighter">
                        {splitText("WildLife")}
                    </h1>
                </div>
            </section>
        </div>
    );
};

export default Hero7;