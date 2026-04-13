"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import Image from "next/image";

gsap.registerPlugin(SplitText, CustomEase);

const PreloaderAnimation = () => {
  const preloaderCompleteRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const btnContainerRef = useRef<HTMLDivElement>(null);
  const strokeTrackRef = useRef<SVGCircleElement>(null);
  const strokeProgressRef = useRef<SVGCircleElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const outroLabelRef = useRef<HTMLParagraphElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const revealerRef = useRef<HTMLDivElement>(null);
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  const svgStrokesRef = useRef<HTMLDivElement>(null);

  const handlePreloaderClick = useCallback(() => {
    if (!preloaderCompleteRef.current) return;
    preloaderCompleteRef.current = false;

    const trackEl = strokeTrackRef.current;
    const progressEl = strokeProgressRef.current;
    if (!trackEl || !progressEl) return;

    const svgPathLength = trackEl.getTotalLength();
    const exitTl = gsap.timeline();

    exitTl
      .to(preloaderRef.current, {
        scale: 0.75,
        duration: 1.25,
        ease: "hop",
      })
      .to(
        [trackEl, progressEl],
        {
          strokeDashoffset: -svgPathLength,
          duration: 1.25,
          ease: "hop",
        },
        "<"
      )
      .to(
        labelRef.current?.querySelectorAll(".line") ?? [],
        {
          y: "-100%",
          duration: 0.75,
          ease: "power3.out",
        },
        "-=1.25"
      )
      .to(
        outroLabelRef.current?.querySelectorAll(".line") ?? [],
        {
          y: "0%",
          duration: 0.75,
          ease: "power3.out",
        },
        "-=0.75"
      )
      .to(preloaderRef.current, {
        clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
        duration: 1.5,
        ease: "hop",
      })
      .to(
        revealerRef.current,
        {
          clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
          duration: 1.5,
          ease: "hop",
          onComplete: () => {
            gsap.set(preloaderRef.current, { display: "none" });
          },
        },
        "-=1.45"
      )
      .to([heroRef.current, navRef.current], {
        scale: 1,
        opacity: 1,
        duration: 1.25,
        ease: "hop",
      })
      .to(
        heroHeadingRef.current?.querySelectorAll(".word") ?? [],
        {
          y: "0%",
          duration: 1,
          ease: "glide",
          stagger: 0.05,
        },
        "-=1.75"
      );
  }, []);

  useEffect(() => {
    CustomEase.create("hop", "0.9, 0, 0.1, 1");
    CustomEase.create("glide", "0.8, 0, 0.2, 1");

    const trackEl = strokeTrackRef.current;
    const progressEl = strokeProgressRef.current;
    if (!trackEl || !progressEl) return;

    const svgPathLength = trackEl.getTotalLength();

    // Set initial stroke values
    gsap.set([trackEl, progressEl], {
      strokeDasharray: svgPathLength,
      strokeDashoffset: svgPathLength,
    });

    // Split preloader texts
    const preloaderTexts =
      preloaderRef.current?.querySelectorAll("p") ?? [];
    preloaderTexts.forEach((p) => {
      new SplitText(p, {
        type: "lines",
        linesClass: "line",
        mask: "lines",
      });
    });

    // Split hero heading
    if (heroHeadingRef.current) {
      new SplitText(heroHeadingRef.current, {
        type: "words",
        wordsClass: "word",
        mask: "words",
      });
    }

    // Intro timeline
    const introTl = gsap.timeline({ delay: 1 });

    introTl
      .to(
        preloaderRef.current?.querySelectorAll(".p-row p .line") ?? [],
        {
          y: "0%",
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1,
        }
      )
      .to(
        trackEl,
        {
          strokeDashoffset: 0,
          duration: 2,
          ease: "hop",
        },
        "<"
      )
      .to(
        svgStrokesRef.current?.querySelector("svg") ?? [],
        {
          rotation: 270,
          duration: 1,
          ease: "hop",
        },
        "<"
      );

    // Progress stops
    const progressStops = [0.2, 0.25, 0.85, 1].map((base, i) => {
      if (i === 3) return 1;
      return base + (Math.random() - 0.5) * 0.1;
    });

    progressStops.forEach((stop, i) => {
      introTl.to(progressEl, {
        strokeDashoffset: svgPathLength - svgPathLength * stop,
        duration: 0.75,
        ease: "glide",
        delay: i === 0 ? 0.3 : 0.3 + Math.random() * 0.2,
      });
    });

    introTl
      .to(
        logoRef.current,
        {
          opacity: 0,
          duration: 0.35,
          ease: "power1.out",
        },
        "-=0.25"
      )
      .to(
        btnContainerRef.current,
        {
          scale: 0.9,
          duration: 1.5,
          ease: "hop",
        },
        "-=0.5"
      )
      .to(
        labelRef.current?.querySelectorAll(".line") ?? [],
        {
          y: "0%",
          duration: 0.75,
          ease: "power3.out",
          onComplete: () => {
            preloaderCompleteRef.current = true;
          },
        },
        "-=0.75"
      );

    return () => {
      introTl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      {/* ========== BACKDROP (white layer) ========== */}
      <div
        ref={backdropRef}
        className="fixed inset-0 w-full h-[100svh] bg-white text-[#7a7a7a] flex flex-col justify-between z-0"
      >
        {/* Top row */}
        <div className="w-full p-6 flex justify-between">
          <div>
            <div className="w-10 h-10 p-1 border border-dashed border-[#7a7a7a]">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div />
          <div />
          <div />
          <div />
        </div>

        {/* Bottom row */}
        <div className="w-full p-6 flex justify-between items-end">
          <div>
            <p className="uppercase font-mono text-xs font-medium leading-none">
              Surface Memory
            </p>
          </div>
          <div>
            <p className="uppercase font-mono text-xs font-medium leading-none">
              {"// / / ///// / / ///"}
            </p>
          </div>
          <div>
            <p className="uppercase font-mono text-xs font-medium leading-none">
              {"Phase Offset >17%"}
            </p>
          </div>
          <div>
            <p className="uppercase font-mono text-xs font-medium leading-none">
              Fragments Aligning
            </p>
            <p className="uppercase font-mono text-xs font-medium leading-none">
              Pattern Emerging
            </p>
          </div>
          <div className="hidden lg:block">
            <p className="uppercase font-mono text-xs font-medium leading-none">
              Collapse Pending
            </p>
            <p className="uppercase font-mono text-xs font-medium leading-none">
              Return --layer Zero
            </p>
          </div>
          <div>
            <p className="uppercase font-mono text-xs font-medium leading-none">
              F-9
            </p>
          </div>
        </div>
      </div>

      {/* ========== PRELOADER (black layer) ========== */}
      <div
        ref={preloaderRef}
        className="fixed inset-0 w-full h-[100svh] bg-black text-white flex flex-col justify-between z-[2]"
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          willChange: "transform, clip-path",
        }}
      >
        {/* Top row */}
        <div className="p-row w-full p-6 flex justify-between">
          <p className="uppercase font-mono text-xs font-medium leading-none">
            Initiating
          </p>
        </div>

        {/* Bottom row */}
        <div className="p-row w-full p-6 flex justify-between">
          <div className="flex gap-24 items-end">
            <div>
              <p className="uppercase font-mono text-xs font-medium leading-none">
                Phase 01
              </p>
              <p className="uppercase font-mono text-xs font-medium leading-none">
                Sequence
              </p>
            </div>
            <div>
              <p className="uppercase font-mono text-xs font-medium leading-none">
                Signal Scan
              </p>
              <p className="uppercase font-mono text-xs font-medium leading-none">
                07 Layers
              </p>
            </div>
          </div>
          <div>
            <p className="uppercase font-mono text-xs font-medium leading-none">
              PX-17
            </p>
          </div>
        </div>

        {/* Center button */}
        <div
          ref={btnContainerRef}
          onClick={handlePreloaderClick}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 cursor-pointer"
        >
          {/* Logo in center */}
          <div
            ref={logoRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[4.5rem] h-[4.5rem]"
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={72}
              height={72}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Enter label */}
          <p
            ref={labelRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 uppercase font-mono text-[0.9rem] font-medium leading-none"
          >
            Enter
          </p>

          {/* Outro label */}
          <p
            ref={outroLabelRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 uppercase font-mono text-[0.9rem] font-medium leading-none"
          >
            Access Granted
          </p>

          {/* SVG circle strokes */}
          <div
            ref={svgStrokesRef}
            className="w-full h-full"
            style={{ willChange: "transform" }}
          >
            <svg
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <circle
                ref={strokeTrackRef}
                cx="160"
                cy="160"
                r="155"
                stroke="#2b2b2b"
                strokeWidth="2"
                strokeDasharray="974"
                strokeDashoffset="974"
              />
              <circle
                ref={strokeProgressRef}
                cx="160"
                cy="160"
                r="155"
                stroke="#fff"
                strokeWidth="2"
                strokeDasharray="974"
                strokeDashoffset="974"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ========== HERO SECTION ========== */}
      <section
        ref={heroRef}
        className="relative w-full h-[100svh] p-6 bg-black text-white flex justify-center items-center text-center z-[1]"
        style={{
          transform: "scale(0.75)",
          willChange: "transform",
        }}
      >
        {/* Nav */}
        <nav
          ref={navRef}
          className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 opacity-0"
        >
          <div className="w-10 h-10">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
        </nav>

        {/* Revealer overlay */}
        <div
          ref={revealerRef}
          className="absolute top-0 left-0 w-full h-full bg-white"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            willChange: "clip-path",
          }}
        />

        {/* Hero heading */}
        <h1
          ref={heroHeadingRef}
          className="w-[90%] uppercase font-['Barlow_Condensed'] text-[clamp(5rem,15vw,15rem)] font-extrabold leading-[0.8] tracking-tight"
        >
          This is now
        </h1>
      </section>
    </div>
  );
};

export default PreloaderAnimation;
