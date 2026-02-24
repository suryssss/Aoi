"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, Pause, Play, Sparkles } from "lucide-react";

const PHRASES = [
    "an infinite canvas",
    "anything possible",
    "it together",
    "magic happen"
];

const CAROUSEL_ITEMS = [
    {
        id: 1,
        type: "poster",
        bg: "bg-[#EFFF04]",
        title: "FOOD MENU WORKS",
        src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop",
        className: "w-[300px] md:w-[380px] aspect-[3/4]",
    },
    {
        id: 2,
        type: "dark",
        bg: "bg-[#111111]",
        title: "collectiv",
        src: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=600&auto=format&fit=crop",
        className: "w-[350px] md:w-[480px] aspect-[4/5]",
    },
    {
        id: 3,
        type: "image",
        src: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800&auto=format&fit=crop",
        className: "w-[280px] md:w-[350px] aspect-[3/4] rounded-sm",
    },
    {
        id: 4,
        type: "stack",
        bg: "bg-[#D1D1D1]",
        className: "w-[400px] md:w-[500px] aspect-[4/5]",
        items: [
            "https://images.unsplash.com/photo-1498837167922-41c53bbfedab?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop"
        ]
    },
    {
        id: 5,
        type: "editorial",
        bg: "bg-[#3D1445]",
        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
        className: "w-[320px] md:w-[420px] aspect-square",
    }
];

const Typewriter = () => {
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const cursorRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!cursorRef.current) return;
        gsap.to(cursorRef.current, {
            opacity: 0,
            duration: 0.6,
            repeat: -1,
            yoyo: true,
            ease: "steps(1)"
        });
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        const i = loopNum % PHRASES.length;
        const fullText = PHRASES[i];

        if (isDeleting) {
            timer = setTimeout(() => {
                setText(fullText.substring(0, text.length - 1));
                if (text === "") {
                    setIsDeleting(false);
                    setLoopNum((prev) => prev + 1);
                }
            }, 40);
        } else {
            if (text === fullText) {
                timer = setTimeout(() => {
                    setIsDeleting(true);
                }, 3500);
            } else {
                timer = setTimeout(() => {
                    setText(fullText.substring(0, text.length + 1));
                }, Math.random() * 50 + 70);
            }
        }

        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum]);

    return (
        <span className="relative inline-block text-[#5a3bf7] font-semibold">
            {text}
            <span ref={cursorRef} className="absolute -right-2 top-[10%] w-[3px] md:w-[4px] h-[80%] bg-[#5a3bf7]" />
        </span>
    );
};

const CardElement = ({ item }: { item: typeof CAROUSEL_ITEMS[0] }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleHover = () => {
        gsap.to(cardRef.current, { scale: 1.05, filter: "brightness(1.1)", duration: 0.4, ease: "power3.out" });
    };

    const handleLeave = () => {
        gsap.to(cardRef.current, { scale: 1, filter: "brightness(1)", duration: 0.4, ease: "power3.out" });
    };

    if (item.type === "poster") {
        return (
            <div ref={cardRef} onMouseEnter={handleHover} onMouseLeave={handleLeave} className={`relative flex-shrink-0 flex items-center justify-center overflow-hidden transition-all duration-300 shadow-xl rounded-sm ${item.bg} ${item.className}`}>
                <div className="absolute top-8 left-0 right-0 z-10 text-center pointer-events-none">
                    <span className="text-[#2071FF] font-black text-6xl md:text-[80px] tracking-tighter w-full leading-[0.8] mix-blend-multiply flex flex-col items-center">
                        {item.title?.split(' ').map((word, i) => <div key={i}>{word}</div>)}
                    </span>
                </div>
                <img src={item.src} className="absolute bottom-[-10%] left-[-10%] w-[120%] h-[80%] object-cover grayscale opacity-90 scale-105 pointer-events-none" alt="poster" />
            </div>
        );
    }

    if (item.type === "dark") {
        return (
            <div ref={cardRef} onMouseEnter={handleHover} onMouseLeave={handleLeave} className={`relative flex-shrink-0 overflow-hidden shadow-2xl rounded-sm ${item.bg} ${item.className}`}>
                <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-widest uppercase font-serif w-full text-center">{item.title}</div>
                <div className="absolute inset-x-8 bottom-8 top-20 border border-neutral-700/50 overflow-hidden rounded overflow-hidden">
                    <img src={item.src} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" alt="dark showcase" />
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-48 h-10 bg-neutral-900 rounded-full flex items-center px-4 border border-neutral-800 shadow-[inset_0_1px_rgba(255,255,255,0.1)]">
                    <div className="w-5 h-5 rounded-full bg-neutral-700 mr-3 shadow-inner"></div>
                    <div className="text-neutral-500 text-xs text-center flex-1">Search</div>
                </div>
            </div>
        );
    }

    if (item.type === "stack") {
        return (
            <div ref={cardRef} onMouseEnter={handleHover} onMouseLeave={handleLeave} className={`relative flex-shrink-0 flex items-center justify-center p-10 overflow-hidden shadow-xl rounded-sm ${item.bg} ${item.className}`}>
                <div className="absolute top-8 left-8 text-2xl tracking-tight font-serif italic text-black/80">Gallerette</div>
                <div className="absolute top-8 right-8 text-xs font-medium uppercase tracking-widest text-black/60 flex gap-4">
                    <span className="hover:text-black cursor-pointer transition-colors">About</span>
                    <span className="hover:text-black cursor-pointer transition-colors">Contact</span>
                </div>
                <div className="relative w-full h-[60%] flex items-center justify-center -rotate-12 translate-x-12 translate-y-6">
                    {item.items?.map((src, idx) => (
                        <div key={idx} className="absolute w-[80%] h-full shadow-[0_20px_40px_rgba(0,0,0,0.3)] overflow-hidden border border-black/10 origin-bottom-right transition-all duration-300 hover:-translate-y-4 hover:rotate-3"
                            style={{
                                transform: `translate(${idx * -60}px, ${idx * -60}px)`,
                                zIndex: 10 - idx
                            }}>
                            <img src={src} className="w-full h-full object-cover rounded-sm" alt="stack item" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (item.type === "editorial") {
        return (
            <div ref={cardRef} onMouseEnter={handleHover} onMouseLeave={handleLeave} className={`relative flex-shrink-0 flex items-center overflow-hidden shadow-2xl rounded-sm ${item.bg} ${item.className}`}>
                <img src={item.src} className="w-1/2 h-full object-cover transition-transform duration-700 hover:scale-105" alt="editorial" />
                <div className="w-1/2 p-6 md:p-8 grid gap-4 place-content-start">
                    <div className="text-white/30 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" /> A/REPS
                    </div>
                    <div className="flex gap-2">
                        <div className="h-2 w-16 bg-white/20 rounded-full overflow-hidden relative">
                            <div className="absolute top-0 left-0 h-full w-1/3 bg-white/60 animate-[slide_1.5s_infinite]" />
                        </div>
                        <div className="h-2 w-16 bg-white/30 rounded-full" />
                    </div>
                    <div className="mt-8 space-y-3">
                        <div className="h-3 w-full bg-white/10 rounded-full" />
                        <div className="h-3 w-4/5 bg-white/10 rounded-full" />
                        <div className="h-3 w-1/2 bg-white/10 rounded-full" />
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div ref={cardRef} onMouseEnter={handleHover} onMouseLeave={handleLeave} className={`relative flex-shrink-0 overflow-hidden rounded-sm shadow-xl ${item.className}`}>
            <img src={item.src} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" alt="showcase" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
    );
}

const Hero6 = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const parallaxWrapperRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const setRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const [isPlaying, setIsPlaying] = useState(true);
    const tweenRef = useRef<gsap.core.Tween | null>(null);
    useEffect(() => {
        if (!boxRef.current || !buttonRef.current || !trackRef.current) return;

        const tl = gsap.timeline();
        gsap.set(parallaxWrapperRef.current, { scale: 0.95, opacity: 0 });
        tl.to(parallaxWrapperRef.current, {
            scale: 1,
            opacity: 1,
            duration: 1.5,
            ease: "power3.inOut"
        }, 0);
        gsap.fromTo(
            boxRef.current,
            { y: 60, opacity: 0, scale: 0.95, rotationX: 10 },
            { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 1.2, ease: "expo.out", delay: 0.4 }
        );
        gsap.fromTo(
            buttonRef.current,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.8, ease: "power2.out", delay: 1.2 }
        );
    }, []);
    useEffect(() => {
        if (!trackRef.current || !setRef.current) return;

        const singleWidth = setRef.current.scrollWidth + 32;

        tweenRef.current = gsap.to(trackRef.current, {
            x: -singleWidth,
            duration: CAROUSEL_ITEMS.length * 8,
            ease: "none",
            repeat: -1,
            paused: !isPlaying
        });

        return () => {
            tweenRef.current?.kill();
        };
    }, []);
    useEffect(() => {
        if (tweenRef.current) {
            if (isPlaying) {
                gsap.to(tweenRef.current, { timeScale: 1, duration: 0.5 });
            } else {
                gsap.to(tweenRef.current, { timeScale: 0, duration: 0.5 });
            }
        }
    }, [isPlaying]);
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!parallaxWrapperRef.current) return;

        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const xAxis = (clientX - centerX) * 0.02;
        const yAxis = (clientY - centerY) * 0.02;

        gsap.to(parallaxWrapperRef.current, {
            x: -xAxis,
            y: -yAxis,
            rotateX: yAxis * 0.05,
            rotateY: -xAxis * 0.05,
            duration: 1.5,
            ease: "power2.out",
        });
    };

    const handleMouseLeaveContainer = () => {
        if (!parallaxWrapperRef.current) return;
        gsap.to(parallaxWrapperRef.current, {
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            duration: 1.5,
            ease: "power3.out"
        });
    };

    const handleNext = () => {
        if (tweenRef.current) {
            gsap.to(tweenRef.current, { totalTime: tweenRef.current.totalTime() + 2, duration: 0.6, ease: "power2.out" });
        }
    };

    const handlePrev = () => {
        if (tweenRef.current) {
            gsap.to(tweenRef.current, { totalTime: tweenRef.current.totalTime() - 2, duration: 0.6, ease: "power2.out" });
        }
    };
    const handleMarqueeEnter = () => {
        if (isPlaying && tweenRef.current) {
            gsap.to(tweenRef.current, { timeScale: 0.3, duration: 0.8 });
        }
    };

    const handleMarqueeLeave = () => {
        if (isPlaying && tweenRef.current) {
            gsap.to(tweenRef.current, { timeScale: 1, duration: 0.8 });
        }
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeaveContainer}
            className="relative w-full h-[100dvh] bg-[#f2f2f2] overflow-hidden flex items-center justify-center font-sans tracking-tight pt-[72px]"
        >
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-300/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

            <div
                className="absolute inset-0 flex items-center justify-center w-full h-full pointer-events-none perspective-[1000px]"
            >
                <div
                    ref={parallaxWrapperRef}
                    onMouseEnter={handleMarqueeEnter}
                    onMouseLeave={handleMarqueeLeave}
                    className="w-full h-full flex items-center justify-center pointer-events-auto origin-center"
                >
                    <div ref={trackRef} className="flex gap-8 px-4 w-max h-[75vh] items-center">
                        <div ref={setRef} className="flex gap-8 h-full items-center">
                            {CAROUSEL_ITEMS.map((item) => (
                                <CardElement key={`og-${item.id}`} item={item} />
                            ))}
                        </div>
                        {CAROUSEL_ITEMS.map((item) => <CardElement key={`dup1-${item.id}`} item={item} />)}
                        {CAROUSEL_ITEMS.map((item) => <CardElement key={`dup2-${item.id}`} item={item} />)}
                        {CAROUSEL_ITEMS.map((item) => <CardElement key={`dup3-${item.id}`} item={item} />)}
                    </div>
                </div>
            </div>
            <div
                ref={boxRef}
                className="relative z-30 bg-white/95 backdrop-blur-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),_inset_0_1px_1px_rgba(255,255,255,1),_0_0_0_1px_rgba(0,0,0,0.03)] rounded-[24px] p-8 md:p-14 w-[92%] max-w-[840px] mx-auto min-h-[360px] flex flex-col justify-between overflow-hidden"
            >
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-purple-200/40 to-blue-200/40 blur-[50px] rounded-full pointer-events-none" />

                <div className="relative z-10 w-full flex flex-col h-full justify-between">
                    <h1 className="text-5xl md:text-[68px] lg:text-[76px] font-medium text-neutral-900 leading-[1.05] relative text-left min-h-[160px] md:min-h-0">
                        Make <br className="md:hidden" />
                        <Typewriter />
                    </h1>

                    <div className="flex justify-start md:justify-end mt-16 md:mt-12 w-full border-t border-neutral-100 pt-8" style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}>
                        <button
                            ref={buttonRef}
                            className="group relative overflow-hidden bg-black hover:bg-neutral-900 text-white px-8 py-4 rounded-[16px] font-semibold text-[17px] transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2"
                        >
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                            <Sparkles size={18} className="text-yellow-400" />
                            Start designing free
                        </button>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-10 right-10 z-40 flex items-center gap-3 bg-white/50 backdrop-blur-xl p-2 rounded-full border border-white/50 shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                <button
                    onClick={handlePrev}
                    className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-50 active:scale-95 transition-all outline-none"
                    aria-label="Previous image"
                >
                    <ArrowLeft size={18} strokeWidth={2} />
                </button>
                <div className="relative flex items-center justify-center group">
                    <div className={`absolute inset-[-4px] rounded-full border border-[#5a3bf7] transition-all duration-700 ${isPlaying ? 'scale-110 opacity-30 animate-pulse' : 'scale-100 opacity-0'}`} />
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-[52px] h-[52px] rounded-full bg-black flex items-center justify-center text-white hover:bg-neutral-900 active:scale-95 transition-all outline-none z-10"
                        aria-label={isPlaying ? "Pause animation" : "Play animation"}
                    >
                        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                    </button>
                </div>
                <button
                    onClick={handleNext}
                    className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-50 active:scale-95 transition-all outline-none"
                    aria-label="Next image"
                >
                    <ArrowRight size={18} strokeWidth={2} />
                </button>
            </div>

            <style jsx global>{`
                @keyframes slide {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(200%); }
                }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default Hero6;