'use client';

import React, { useEffect, useRef } from 'react';

// GSAP + SplitText are loaded from CDN at runtime — access via (window as any)

// ─── Component ────────────────────────────────────────────────────────────────
const Navbar1: React.FC = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const gsapLoaded = useRef(false);

  useEffect(() => {
    // Inject Google Fonts (Boldonse + DM Sans) once
    const fontId = 'cg12-fonts';
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Boldonse&family=DM+Sans:wght@400;600&display=swap';
      document.head.appendChild(link);
    }

    // Load GSAP + SplitText from CDN
    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => resolve();
        s.onerror = reject;
        document.head.appendChild(s);
      });

    const init = () => {
      if (gsapLoaded.current) return;
      gsapLoaded.current = true;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gsap = (window as any).gsap;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SplitText = (window as any).SplitText;
      gsap.registerPlugin(SplitText);

      const nav = navRef.current;
      if (!nav) return;

      // ── DOM refs (same selectors as codegrid-12, driven by data-* attrs) ──
      const navToggle = nav.querySelector('[data-nav-toggle]') as HTMLElement;
      const navToggleMenu = nav.querySelector('[data-toggle-menu]') as HTMLElement;
      const navToggleClose = nav.querySelector('[data-toggle-close]') as HTMLElement;
      const menu = nav.querySelector('[data-menu]') as HTMLElement;
      const menuBg = nav.querySelector('[data-menu-path]') as SVGPathElement;
      const menuBgSvg = nav.querySelector('[data-menu-svg]') as SVGSVGElement;
      const menuLogo = nav.querySelector('[data-menu-logo]') as HTMLElement;
      const menuLinks = nav.querySelectorAll('[data-menu-links] a');
      const menuInfoItems = nav.querySelectorAll('[data-menu-info] p, [data-menu-info] h3, [data-menu-info] h6');

      // ── SVG path constants (identical to codegrid-12/script.js) ──
      const svgWidth = menuBgSvg.viewBox.baseVal.width;
      const svgHeight = menuBgSvg.viewBox.baseVal.height;
      const svgCenterX = svgWidth / 2;

      const OPEN_HIDDEN = `M${svgWidth},0 Q${svgCenterX},0 0,0 L0,0 L${svgWidth},0 Z`;
      const OPEN_BULGE = `M${svgWidth},345 Q${svgCenterX},620 0,345 L0,0 L${svgWidth},0 Z`;
      const OPEN_FULL = `M${svgWidth},${svgHeight} Q${svgCenterX},${svgHeight} 0,${svgHeight} L0,0 L${svgWidth},0 Z`;
      const CLOSE_START = `M${svgWidth},0 Q${svgCenterX},0 0,0 L0,${svgHeight} L${svgWidth},${svgHeight} Z`;
      const CLOSE_BULGE = `M${svgWidth},350 Q${svgCenterX},130 0,350 L0,${svgHeight} L${svgWidth},${svgHeight} Z`;
      const CLOSE_HIDDEN = `M${svgWidth},${svgHeight} Q${svgCenterX},${svgHeight} 0,${svgHeight} L0,${svgHeight} L${svgWidth},${svgHeight} Z`;

      gsap.set(menuBg, { attr: { d: OPEN_HIDDEN } });

      const splits: { chars: Element[] }[] = [];
      menuLinks.forEach((link) => {
        const split = new SplitText(link, { type: 'chars', charsClass: 'char' });
        splits.push(split);
        gsap.set(split.chars, { opacity: 0, x: '750%' });
      });

      gsap.set(menuInfoItems, { opacity: 0, y: 100 });

      let isOpen = false;
      let currentTl: GSAPTimeline | null = null;

      // ── openMenu (identical logic to codegrid-12) ──
      const openMenu = () => {
        menu.style.pointerEvents = 'all'; // replaces .is-open CSS class

        gsap.to(navToggleMenu, { duration: 0.25, opacity: 0, ease: 'none' });
        gsap.to(navToggleClose, { duration: 0.25, opacity: 1, ease: 'none', delay: 0.25 });

        const tl = gsap.timeline();
        currentTl = tl;

        tl.to(menuBg, { duration: 0.5, attr: { d: OPEN_BULGE }, ease: 'power4.in' })
          .to(menuBg, { duration: 0.5, attr: { d: OPEN_FULL }, ease: 'power4.out' });

        tl.to(menuLogo, { duration: 0.1, opacity: 1, ease: 'none' }, '-=0.75');

        tl.to(
          menuInfoItems,
          { duration: 0.75, opacity: 1, y: 0, ease: 'power3.out', stagger: 0.075 },
          '-=0.35'
        );

        const menuLinksChars = splits.flatMap((s) => s.chars);

        tl.to(
          menuLinksChars,
          { duration: 1.5, x: '0%', ease: 'elastic.out(1, 0.25)', stagger: 0.01 },
          0.45
        );

        tl.to(
          menuLinksChars,
          { duration: 0.75, opacity: 1, ease: 'power2.out', stagger: 0.01 },
          0.45
        );
      };

      // ── closeMenu (identical logic to codegrid-12) ──
      const closeMenu = () => {
        gsap.set(menuBg, { attr: { d: CLOSE_START } });

        gsap.to(navToggleClose, { duration: 0.3, opacity: 0, ease: 'none' });
        gsap.to(navToggleMenu, { duration: 0.3, opacity: 1, ease: 'none', delay: 0.25 });

        const tl = gsap.timeline({
          onComplete: () => {
            menu.style.pointerEvents = 'none'; // replaces .is-open removal
            gsap.set(menuBg, { attr: { d: OPEN_HIDDEN } });
            splits.forEach((split) => gsap.set(split.chars, { opacity: 0, x: '750%' }));
            gsap.set(menuLinks, { opacity: 1 });
            gsap.set(menuInfoItems, { opacity: 0, y: 100 });
            currentTl = null;
          },
        });
        currentTl = tl;

        tl.to(menuLogo, { duration: 0.3, opacity: 0 })
          .to(menuLinks, { duration: 0.3, opacity: 0 }, '<')
          .to(menuInfoItems, { duration: 0.3, opacity: 0 }, '<');

        tl.to(menuBg, { duration: 0.5, attr: { d: CLOSE_BULGE }, ease: 'power3.in' }, '<')
          .to(menuBg, { duration: 0.5, attr: { d: CLOSE_HIDDEN }, ease: 'power3.out' });
      };

      navToggle.addEventListener('click', () => {
        isOpen = !isOpen;
        if (currentTl) currentTl.kill();
        gsap.killTweensOf([navToggleMenu, navToggleClose, menuLogo, menuInfoItems]);
        splits.forEach((s) => gsap.killTweensOf(s.chars));
        isOpen ? openMenu() : closeMenu();
      });
    };

    loadScript('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js')
      .then(() => loadScript('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js'))
      .then(init)
      .catch(console.error);
  }, []);

  // ─── JSX — all styling via Tailwind arbitrary values ─────────────────────
  return (
    <div ref={navRef} className="relative w-full h-svh">

      {/* ── Fixed nav shell ── */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10">

        {/* Logo */}
        <div className="absolute top-8 left-8 w-24 p-2 pointer-events-auto">
          <a href="/" className="no-underline text-[#222225] font-['DM_Sans'] font-semibold text-base">
            Hello
          </a>
        </div>

        {/* Toggle */}
        <div
          data-nav-toggle
          className="absolute top-8 right-8 p-2 cursor-pointer z-[100] pointer-events-auto"
        >
          <p
            data-toggle-menu
            className="uppercase font-['DM_Sans'] text-[0.7rem] font-semibold tracking-[0.25rem] text-[#222225]"
          >
            Menu
          </p>
          <p
            data-toggle-close
            className="absolute top-2 right-2 uppercase font-['DM_Sans'] text-[0.7rem] font-semibold tracking-[0.25rem] text-[#222225] opacity-0"
          >
            Close
          </p>
        </div>

        {/* Full-screen menu panel */}
        <div
          data-menu
          className="absolute top-0 left-0 w-full h-svh p-10 flex max-[1000px]:flex-col-reverse gap-8 text-[#222225] pointer-events-none z-10"
        >
          {/* SVG morphing background */}
          <svg
            data-menu-svg
            viewBox="0 0 1131 861"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: -1 }}
          >
            <path
              data-menu-path
              fill="#f0eeee"
              d="M1131,0 Q565.5,0 0,0 L0,0 L1131,0 Z"
            />
          </svg>

          {/* Menu logo */}
          <div
            data-menu-logo
            className="absolute top-8 left-8 w-24 p-2 opacity-0"
          >
            <a href="/" className="no-underline text-[#222225] font-['DM_Sans'] font-semibold text-base">
              Hello
            </a>
          </div>

          {/* Info column */}
          <div
            data-menu-info
            className="flex-1 flex flex-col justify-end"
          >
            <p className="uppercase font-['DM_Sans'] text-[0.7rem] font-semibold tracking-[0.25rem] text-[#a374ff] mb-4 [will-change:transform,opacity]">
              Get in Touch
            </p>
            <h3 className="font-serif font-normal leading-[1.35] tracking-[-0.02em] text-[clamp(1.5rem,3vw,3rem)] m-0 [will-change:transform,opacity]">
              studio@aoi.co
            </h3>
            <h3 className="font-serif font-normal leading-[1.35] tracking-[-0.02em] text-[clamp(1.5rem,3vw,3rem)] m-0 [will-change:transform,opacity]">
              +91 7012983764
            </h3>
            <br />
            <h6 className="font-serif font-normal leading-[1.35] tracking-[-0.02em] text-[clamp(1rem,1.25vw,1.5rem)] m-0 [will-change:transform,opacity]">
              42 Mercer Street
            </h6>
            <h6 className="font-serif font-normal leading-[1.35] tracking-[-0.02em] text-[clamp(1rem,1.25vw,1.5rem)] m-0 [will-change:transform,opacity]">
              Toronto, ON M5V
            </h6>
          </div>

          {/* Links column */}
          <div
            data-menu-links
            className="flex-1 max-[1000px]:flex-[1.5] flex flex-col justify-end"
          >
            {['Work', 'Services', 'About', 'Insights', 'Careers', 'Contact'].map((label) => (
              <a
                key={label}
                href={`/${label.toLowerCase()}`}
                className="no-underline text-[#222225] font-['Boldonse'] text-[clamp(2.5rem,5vw,5rem)] leading-[1.35] block w-max overflow-visible [will-change:transform,opacity]"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hero section (background image) ── */}
      <section className="relative w-full h-svh bg-[url('/bg1.jpg')] bg-no-repeat bg-center bg-cover" />
    </div>
  );
};

export default Navbar1;
