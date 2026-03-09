'use client'
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import Image from 'next/image';

const clients = [
    "Native Instruments,",
    "Oura,",
    "Hender Scheme,",
    "B&O Play,",
    "Nothing,",
    "Gentle Monster,",
    "Officine Panerai,",
    "Polestar,",
    "Fragent Design,",
    "SuperFuture,",
    "Bang & Olufsen,",
    "Sonos."
];

const Hero14 = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const clientsPreviewRef = useRef<HTMLDivElement>(null);
    const imgWrappersRef = useRef<(HTMLDivElement | null)[]>([]);
    const imgsRef = useRef<(HTMLImageElement | null)[]>([]);

    const zIndexCounter = useRef(1);
    const activeClientIndex = useRef(-1);

    useEffect(() => {
        gsap.registerPlugin(CustomEase);
        CustomEase.create("hop", "M0,0,C0.071,0.505 0.192,0.726 0.318,0.852,0.45,0.984 0.504,1 1,1");
        imgsRef.current.forEach((img) => {
            if (img) gsap.set(img, { scale: 1.25, opacity: 0, filter: "blur(10px)" });
        });
        const handleMouseMove = (e: MouseEvent) => {
            if (activeClientIndex.current === -1) return;

            const { clientX, clientY } = e;
            const xMove = (clientX / window.innerWidth - 0.5) * 40;
            const yMove = (clientY / window.innerHeight - 0.5) * 40;

            const currentImg = imgsRef.current[activeClientIndex.current];
            const currentWrapper = imgWrappersRef.current[activeClientIndex.current];

            if (currentImg && currentWrapper) {
                gsap.to(currentImg, {
                    x: xMove,
                    y: yMove,
                    duration: 1.5,
                    ease: "power2.out",
                    overwrite: "auto"
                });
                gsap.to(currentWrapper, {
                    x: xMove * 0.5,
                    y: yMove * 0.5,
                    duration: 1.5,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const handleMouseOver = (index: number) => {
        if (activeClientIndex.current === index) return;

        if (activeClientIndex.current !== -1) {
            handleMouseOut(activeClientIndex.current);
        }

        activeClientIndex.current = index;

        const currentWrapper = imgWrappersRef.current[index];
        const currentImg = imgsRef.current[index];

        if (currentWrapper && currentImg) {
            zIndexCounter.current += 1;
            currentWrapper.style.zIndex = zIndexCounter.current.toString();
            gsap.fromTo(currentWrapper,
                {
                    clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
                    rotation: -3 + Math.random() * 6,
                    scale: 0.95
                },
                {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    rotation: 0,
                    scale: 1,
                    duration: 0.7,
                    ease: "hop",
                    overwrite: "auto"
                }
            );
            gsap.fromTo(currentImg,
                {
                    opacity: 0,
                    scale: 1.3,
                    filter: "blur(10px)",
                },
                {
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 0.9,
                    ease: "power3.out",
                    overwrite: "auto"
                }
            );
            gsap.to(".client-name", {
                opacity: 0.2,
                x: 0,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
            });
            gsap.to(`.client-name:nth-child(${index + 1})`, {
                opacity: 1,
                x: 16,
                duration: 0.5,
                ease: "power3.out",
                overwrite: "auto"
            });
        }
    };

    const handleMouseOut = (index: number) => {
        if (activeClientIndex.current === index) {
            activeClientIndex.current = -1;
        }

        const currentWrapper = imgWrappersRef.current[index];
        const currentImg = imgsRef.current[index];

        if (currentWrapper && currentImg) {
            gsap.to(".client-name", {
                opacity: 1,
                x: 0,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
            });
            gsap.to(currentWrapper, {
                clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
                rotation: -1.5,
                scale: 0.95,
                x: 0,
                y: 0,
                duration: 0.6,
                ease: "power3.inOut",
                overwrite: "auto"
            });
            gsap.to(currentImg, {
                opacity: 0,
                scale: 1.15,
                filter: "blur(8px)",
                x: 0,
                y: 0,
                duration: 0.6,
                ease: "power3.inOut",
                overwrite: "auto",
                onComplete: () => {
                    gsap.set(currentWrapper, {
                        clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
                        rotation: 0,
                        scale: 1
                    });
                    gsap.set(currentImg, {
                        scale: 1.25,
                        filter: "blur(10px)"
                    });
                }
            });
        }
    };

    return (
        <div ref={containerRef} className="relative w-full h-[100svh] bg-white overflow-hidden text-white font-['Lucida_Sans',_'Lucida_Sans_Regular',_'Lucida_Grande',_'Lucida_Sans_Unicode',_Geneva,_Verdana,_sans-serif]">

            <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-start mix-blend-difference z-20">
                <div className="logo uppercase text-[0.85rem] font-semibold tracking-wide">
                    <a href="#" className="text-white hover:opacity-75 transition-opacity">Nord Objects</a>
                </div>
                <div className="nav-links flex gap-3 text-[0.85rem] font-semibold tracking-wide uppercase">
                    <a href="#" className="text-white hover:opacity-75 transition-opacity">Home</a>
                    <a href="#" className="text-white hover:opacity-75 transition-opacity">About</a>
                    <a href="#" className="text-white hover:opacity-75 transition-opacity">Contact</a>
                </div>
            </nav>

            <section className="clients relative w-full h-full p-8 flex flex-col justify-end items-start gap-8">

                <div
                    ref={clientsPreviewRef}
                    className="clients-preview absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full lg:w-[65%] lg:h-[75%] z-0 pointer-events-none"
                >
                    {clients.map((client, index) => (
                        <div
                            key={index}
                            ref={(el) => { imgWrappersRef.current[index] = el; }}
                            className="client-img-wrapper absolute top-0 left-0 w-full h-full overflow-hidden"
                            style={{ clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)', willChange: 'clip-path, transform' }}
                        >
                            <Image
                                ref={(el) => { imgsRef.current[index] = el; }}
                                src={`/hero/hero8/img${index + 1}.jpg`}
                                alt={client}
                                fill
                                className="absolute w-full h-full object-cover"
                                style={{ willChange: 'transform, opacity, filter' }}
                                priority={index < 4}
                            />
                        </div>
                    ))}
                </div>

                <div className="clients-header relative z-10 text-white text-[0.85rem] font-semibold uppercase mix-blend-difference" style={{ color: '#acacac' }}>
                    <p>Trusted Us</p>
                </div>

                <div className="clients-list relative w-full lg:w-[80%] mb-32 flex flex-wrap justify-start gap-3 mix-blend-difference z-20">
                    {clients.map((client, index) => (
                        <div
                            key={index}
                            className="client-name relative inline-block cursor-pointer group"
                            onMouseEnter={() => handleMouseOver(index)}
                            onMouseLeave={() => handleMouseOut(index)}
                        >
                            <h1 className="text-white text-[2rem] lg:text-[3rem] font-medium leading-none m-0 p-0">
                                {client}
                            </h1>
                            <div className="absolute bottom-0 left-0 w-full h-[0.15rem] bg-white scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left"></div>
                        </div>
                    ))}
                </div>

            </section>

            <footer className="fixed bottom-0 left-0 w-full p-8 flex justify-between items-start mix-blend-difference z-20 uppercase text-[0.85rem] font-semibold tracking-wide text-white">
                <p>Experiment 503</p>
                <p>Developed by Suryss</p>
            </footer>

        </div>
    );
};

export default Hero14;
