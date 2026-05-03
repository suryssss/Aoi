'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
}

const Navbar2: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAnimating = useRef(false);

  useEffect(() => {
    CustomEase.create(
      'hop',
      'M0,0 C0.354,0 0.464,0.133 0.498,0.502 0.532,0.872 0.651,1 1,1'
    );
  }, []);

  // Split text into spans for animation
  useEffect(() => {
    if (!containerRef.current) return;
    const headerH1 = containerRef.current.querySelector('.header h1');
    if (headerH1 && !headerH1.getAttribute('data-split')) {
      const text = headerH1.textContent || '';
      const splitText = text
        .split('')
        .map((char) => `<span>${char === ' ' ? '&nbsp;&nbsp;' : char}</span>`)
        .join('');
      headerH1.innerHTML = splitText;
      headerH1.setAttribute('data-split', 'true');
    }
  }, []);

  const toggleMenu = () => {
    if (isAnimating.current || !containerRef.current) return;
    const nav = containerRef.current;

    const menu = nav.querySelector('.menu');
    const links = nav.querySelectorAll('.link');
    const socialLinks = nav.querySelectorAll('.socials p');
    const videoWrapper = nav.querySelector('.video-wrapper');
    const headerSpans = nav.querySelectorAll('.header h1 span');

    if (!isMenuOpen) {
      setIsMenuOpen(true);
      isAnimating.current = true;

      gsap.to(menu, {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
        duration: 1.5,
        ease: 'hop',
        onStart: () => {
          (menu as HTMLElement).style.pointerEvents = 'all';
        },
        onComplete: () => {
          isAnimating.current = false;
        },
      });

      gsap.to(links, {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        delay: 0.85,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.to(socialLinks, {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        delay: 0.85,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.to(videoWrapper, {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
        delay: 0.5,
        duration: 1.5,
        ease: 'hop',
      });

      gsap.to(headerSpans, {
        rotateY: 0,
        stagger: 0.05,
        delay: 0.75,
        duration: 1.5,
        ease: 'power4.out',
      });

      gsap.to(headerSpans, {
        y: 0,
        scale: 1,
        stagger: 0.05,
        delay: 0.5,
        duration: 1.5,
        ease: 'power4.out',
      });
    } else {
      setIsMenuOpen(false);
      isAnimating.current = true;

      gsap.to(menu, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        duration: 1.5,
        ease: 'hop',
        onComplete: () => {
          (menu as HTMLElement).style.pointerEvents = 'none';
          gsap.set(menu, {
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          });

          gsap.set(links, { y: 30, opacity: 0 });
          gsap.set(socialLinks, { y: 30, opacity: 0 });
          gsap.set(videoWrapper, {
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          });

          gsap.set(headerSpans, {
            y: 500,
            scale: 0.75,
            rotateY: 90,
          });

          isAnimating.current = false;
        },
      });
    }
  };

  return (
    <div ref={containerRef} translate="no" className="notranslate w-full h-screen font-['Courier_New',Courier,monospace] bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat overflow-hidden">
      <style>{`
        .header h1 span {
          position: relative;
          display: inline-block;
          transform: scale(0.75) translateY(500px) rotateY(90deg);
          transform-origin: bottom;
          transform-style: preserve-3d;
        }
      `}</style>

      {/* Main Logo */}
      <div className="absolute top-8 left-8">
        <a href="#" className="no-underline uppercase font-['Gill_Sans','Gill_Sans_MT',Calibri,'Trebuchet_MS',sans-serif] text-[60px] font-light text-black">AOI</a>
      </div>

      {/* Menu Toggle */}
      <div
        className={`fixed top-8 right-8 max-[1000px]:top-6 max-[1000px]:right-6 h-[60px] bg-[#0f0f0f] rounded-[8em] transition-[width] duration-500 ease-[cubic-bezier(0.075,0.82,0.165,1)] origin-right cursor-pointer z-50 group ${isMenuOpen ? 'w-[60px]' : 'w-[120px]'}`}
        onClick={toggleMenu}
      >
        <div className={`absolute right-0 w-[60px] h-[60px] rounded-full bg-[#E29A72] transition-all duration-500 ease-[cubic-bezier(0.075,0.82,0.165,1)] z-10 overflow-hidden ${isMenuOpen ? '[clip-path:circle(50%_at_50%_50%)] scale-[1.125]' : '[clip-path:circle(10%_at_50%_50%)] group-hover:[clip-path:circle(35%_at_50%_50%)]'}`}>
          <div className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px] flex justify-center items-center transition-all duration-1000 ease-[cubic-bezier(0.075,0.82,0.165,1)] ${isMenuOpen ? 'top-1/2 opacity-100' : 'top-[60%] opacity-0 group-hover:top-1/2 group-hover:opacity-100'}`}>
            <div className={`absolute w-[15px] h-[1.5px] bg-black transition-transform duration-[250ms] ease-out ${isMenuOpen ? 'translate-y-0 rotate-45 scale-[1.05]' : '-translate-y-[3px]'}`}></div>
            <div className={`absolute w-[15px] h-[1.5px] bg-black transition-transform duration-[250ms] ease-out ${isMenuOpen ? 'translate-y-0 -rotate-45 scale-[1.05]' : 'translate-y-[3px]'}`}></div>
          </div>
        </div>
        <div className={`absolute top-1/2 -translate-y-1/2 text-white transition-all duration-500 ease-[cubic-bezier(0.075,0.82,0.165,1)] z-[1] ${isMenuOpen ? 'opacity-0 left-[30px]' : 'left-[30px] opacity-100 group-hover:left-[20px]'}`}>
          <p className="uppercase font-medium text-[12px] m-0 p-0">Menu</p>
        </div>
      </div>

      {/* Menu Area */}
      <div className="menu fixed top-0 left-0 w-screen h-screen flex max-[1000px]:flex-col max-[1000px]:overflow-y-auto max-[1000px]:overflow-x-hidden bg-[#111] pointer-events-none z-40 [transform-style:preserve-3d] [perspective:1000px] [clip-path:polygon(0%_100%,100%_100%,100%_100%,0%_100%)]">

        {/* Col 1 */}
        <div className="flex-1 relative h-full pt-[10em] px-[2em] pb-[2em] flex flex-col justify-between items-start max-[1000px]:h-auto max-[1000px]:pt-[8em] max-[1000px]:pb-[2em] max-[1000px]:px-[1.5em] max-[1000px]:flex-none">
          <div className="absolute top-8 left-8 max-[1000px]:top-6 max-[1000px]:left-6">
            <a href="#" translate="no" className="no-underline uppercase font-['Gill_Sans','Gill_Sans_MT',Calibri,'Trebuchet_MS',sans-serif] text-[60px] max-[1000px]:text-[32px] max-[1000px]:tracking-tight font-light text-white">AOI</a>
          </div>

          <div className="links max-[1000px]:w-full max-[1000px]:mt-8">
            {['Projects', 'Expertise', 'Agency', 'Contact'].map((item) => (
              <div key={item} className="link relative translate-y-[30px] opacity-0 max-[1000px]:mb-2">
                <a href="#" className="no-underline text-white text-[48px] font-light tracking-[-1.5px] leading-[125%] max-[1000px]:text-[52px] max-[1000px]:tracking-tight">{item}</a>
              </div>
            ))}
          </div>

          <div className="video-wrapper w-full aspect-video bg-[#1d1d1d] overflow-hidden p-[2em] max-[1000px]:hidden [clip-path:polygon(0%_100%,100%_100%,100%_100%,0%_100%)]">
            <video autoPlay muted loop className="w-full h-full object-cover">
              <source src="/video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Col 2 */}
        <div className="flex-[2] relative h-full pt-[4em] px-[2em] pb-[2em] overflow-hidden max-[1000px]:h-auto max-[1000px]:pt-0 max-[1000px]:px-[1.5em] max-[1000px]:pb-[2em] max-[1000px]:flex-none max-[1000px]:overflow-visible">

          <div className="hidden max-[1000px]:block w-full h-[1px] bg-[#333] mb-8"></div>

          <div className="socials-wrapper flex flex-col justify-between h-full w-full max-[1000px]:gap-16">
            <div className="socials w-full flex gap-[4em] max-[1000px]:flex-row max-[1000px]:justify-between max-[1000px]:gap-4">
              <div className="flex-1">
                <div className="mb-6">
                  {['AOI', '9 ANDROE ROCKFIELD', 'NEW YORK 10001', 'UNITED STATES'].map((t) => (
                    <p key={t} className="relative text-white translate-y-[30px] opacity-0 uppercase font-[Arial,Helvetica,sans-serif] text-[12px] max-[1000px]:text-[10px] font-bold tracking-widest mb-[2px]">{t}</p>
                  ))}
                </div>
                <div>
                  {['CONTACT@AOI.COM', 'JOB@AOI.COM'].map((t) => (
                    <p key={t} className="relative text-white translate-y-[30px] opacity-0 uppercase font-[Arial,Helvetica,sans-serif] text-[12px] max-[1000px]:text-[10px] font-bold tracking-widest mb-[2px]">{t}</p>
                  ))}
                </div>
              </div>
              <div className="flex-1 text-left max-[1000px]:text-right">
                <div className="mb-6">
                  {['INSTAGRAM', 'LINKEDIN', 'TWITTER', 'FACEBOOK'].map((t) => (
                    <p key={t} className="relative text-white translate-y-[30px] opacity-0 uppercase font-[Arial,Helvetica,sans-serif] text-[12px] max-[1000px]:text-[10px] font-bold tracking-widest mb-[2px]">{t}</p>
                  ))}
                </div>
                <div>
                  <p className="relative text-white translate-y-[30px] opacity-0 uppercase font-[Arial,Helvetica,sans-serif] text-[12px] max-[1000px]:text-[10px] font-bold tracking-widest mb-[2px]">04 82 33 85 10</p>
                </div>
              </div>
            </div>

            <div className="header max-[1000px]:w-full max-[1000px]:flex max-[1000px]:justify-center max-[1000px]:mt-10">
              <h1 translate="no" className="text-white uppercase font-[Impact,sans-serif] text-[450px] font-normal leading-[100%] h-[450px] max-[1000px]:text-[28vw] max-[1000px]:h-auto max-[1000px]:scale-y-[1.5] max-[1000px]:origin-bottom">AOI</h1>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Navbar2;

