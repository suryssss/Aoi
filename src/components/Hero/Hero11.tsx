'use client'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Image from 'next/image'

const SLIDE_WIDTH = 320
const SLIDE_HEIGHT = 440
const SLIDE_GAP = 150
const SLIDE_COUNT = 9
const ARC_DEPTH = 200
const CENTER_LIFT = 100
const SCROLL_LERP = 0.05

const slideSources = [
    '/hero/hero8/img1.jpg',
    '/hero/hero8/img2.jpg',
    '/hero/hero8/img3.jpg',
    '/hero/hero8/img4.jpg',
    '/hero/hero8/img5.jpg',
    '/hero/hero8/img6.jpg',
    '/hero/hero8/img7.jpg',
    '/hero/hero8/img8.jpg',
    '/hero/hero8/img9.jpg',
]

const SlideTitles = [
    "The City",
    "The Forest",
    "The Mountain",
    "The River",
    "The Ocean",
    "The Desert",
    "The Sky",
    "The Stars",
    "The Universe",
]

const Hero11 = () => {
    const sliderContainerRef = useRef<HTMLDivElement>(null)
    const [activeTitle, setActiveTitle] = useState(SlideTitles[0])
    const [activeIndex, setActiveIndex] = useState(0)

    const slideRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const sliderContainer = sliderContainerRef.current
        if (!sliderContainer) return

        let trackWidth = SLIDE_COUNT * SLIDE_GAP;
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        let windowCenterX = windowWidth / 2
        let arcBaseLineY = windowHeight * 0.55

        let scrollTarget = 0;
        let scrollCurrent = 0
        let activeSlideIndex = -1
        let animationFrameId: number;
        let touchStartX = 0

        const computeSlideTransform = (slideIndex: number, scrollOffset: number) => {
            let wrappedOffsetX =
                (((slideIndex * SLIDE_GAP - scrollOffset) % trackWidth) + trackWidth) % trackWidth;
            if (wrappedOffsetX > trackWidth / 2) wrappedOffsetX -= trackWidth

            const slideCenterX = windowCenterX + wrappedOffsetX;
            const normalizedDist = (slideCenterX - windowCenterX) / (windowWidth * 0.5)
            const absDist = Math.min(Math.abs(normalizedDist), 1.3)

            const scaleFator = Math.max(1 - absDist, 0.8, 0.25);
            const scaledWidth = SLIDE_WIDTH * scaleFator;
            const scaledHeight = SLIDE_HEIGHT * scaleFator;

            const clampedDist = Math.min(absDist, 1)
            const arcDropY = (1 - Math.cos(clampedDist * Math.PI) * 0.5 * ARC_DEPTH)

            const centerLiftY = Math.max(1 - absDist * 2, 0) * CENTER_LIFT

            return {
                x: slideCenterX - scaledWidth / 2,
                y: arcBaseLineY - scaledHeight / 2 + arcDropY - centerLiftY,
                width: scaledWidth,
                height: scaledHeight,
                zIndex: Math.round((1 - absDist) * 100),
                distanceFromCenter: Math.abs(wrappedOffsetX)
            }
        }

        const layoutSlides = (scrollOffset: number) => {
            slideRefs.current.forEach((slideEl, i) => {
                if (!slideEl) return;
                const { x, y, width, height, zIndex } = computeSlideTransform(i, scrollOffset)

                gsap.set(slideEl, {
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    zIndex: zIndex,
                })
            })
        }

        const syncActiveTitle = (scrollOffset: number) => {
            let closestIndex = 0
            let closestDis = Infinity

            slideRefs.current.forEach((_, i) => {
                const { distanceFromCenter } = computeSlideTransform(i, scrollOffset)

                if (distanceFromCenter < closestDis) {
                    closestDis = distanceFromCenter
                    closestIndex = i
                }
            })
            if (closestIndex !== activeSlideIndex) {
                activeSlideIndex = closestIndex
                setActiveTitle(SlideTitles[closestIndex])
                setActiveIndex(closestIndex)
            }
        }

        const animate = () => {

            scrollCurrent += (scrollTarget - scrollCurrent) * SCROLL_LERP
            layoutSlides(scrollCurrent)
            syncActiveTitle(scrollCurrent)
            animationFrameId = requestAnimationFrame(animate)
        }

        layoutSlides(0)
        animate()
        gsap.fromTo(
            sliderContainer.querySelectorAll(".slide-inner"),
            { y: 200, opacity: 0, rotation: 5 },
            { y: 0, opacity: 1, rotation: 0, duration: 1.5, stagger: 0.05, ease: 'power4.out', delay: 0.1 }
        )

        gsap.fromTo(
            sliderContainer.querySelectorAll(".nav-item, .bottom-utility"),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.8 }
        )

        gsap.fromTo(
            sliderContainer.querySelector("#slide-title"),
            { opacity: 0, scale: 0.9, y: 50 },
            { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'expo.out', delay: 0.5 }
        )

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault()
            scrollTarget += e.deltaY * 0.5
        }

        const handleTouchStart = (e: TouchEvent) => {
            touchStartX = e.touches[0].clientX
        }

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault()
            const touchCurrentX = e.touches[0].clientX
            const deltaX = (touchStartX - touchCurrentX) * 1.2
            scrollTarget += deltaX
            touchStartX = touchCurrentX
        }

        const handleResize = () => {
            windowWidth = window.innerWidth;
            windowHeight = window.innerHeight;
            windowCenterX = windowWidth / 2
            arcBaseLineY = windowHeight * 0.55
        }

        sliderContainer.addEventListener("wheel", handleWheel, { passive: false })
        sliderContainer.addEventListener("touchstart", handleTouchStart)
        sliderContainer.addEventListener("touchmove", handleTouchMove, { passive: false })
        window.addEventListener("resize", handleResize)

        return () => {
            cancelAnimationFrame(animationFrameId)
            sliderContainer.removeEventListener("wheel", handleWheel)
            sliderContainer.removeEventListener("touchstart", handleTouchStart)
            sliderContainer.removeEventListener("touchmove", handleTouchMove)
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return (
        <section
            ref={sliderContainerRef}
            className="slider relative w-full h-[100svh] overflow-hidden bg-[#dedcd5] text-[#121212]"
        >
            <div
                className="absolute inset-0 z-0 opacity-30 pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
            ></div>
            <nav className="nav-item absolute top-0 left-0 w-full p-6 lg:p-10 flex justify-between items-center z-[1001] pointer-events-none">
                <div className="font-bold text-xl tracking-tighter uppercase pointer-events-auto cursor-pointer" style={{ fontFamily: 'PP Neue Montreal, sans-serif' }}>
                    AURA
                </div>
                <div className="flex gap-6 text-xs lg:text-sm font-bold uppercase tracking-widest pointer-events-auto">
                    <span className="cursor-pointer hover:opacity-50 transition-opacity duration-300">Journal</span>
                    <span className="cursor-pointer hover:opacity-50 transition-opacity duration-300">Catalog</span>
                    <span className="cursor-pointer hover:opacity-50 transition-opacity duration-300">Connect</span>
                </div>
            </nav>

            <div className="nav-item absolute bottom-[10svh] lg:bottom-[15svh] left-1/2 -translate-x-1/2 flex flex-col items-center z-[1000] pointer-events-none w-full px-4">
                <p className="text-xs lg:text-sm font-bold tracking-[0.3em] mb-4 uppercase opacity-50">
                    Curated Collection
                </p>
                <p
                    id="slide-title"
                    className="font-medium text-3xl lg:text-4xl xl:text-5xl whitespace-nowrap uppercase tracking-widest mix-blend-difference text-black"
                    style={{ fontFamily: 'PP Neue Montreal, sans-serif' }}
                >
                    {activeTitle}
                </p>
                <div className="mt-8 lg:mt-12 flex items-center gap-4 text-xs font-bold font-mono tracking-widest opacity-80">
                    <span className="w-4 text-right">{String(activeIndex + 1).padStart(2, '0')}</span>
                    <div className="w-16 h-[1px] bg-black/40"></div>
                    <span className="w-4 text-left">{String(SLIDE_COUNT).padStart(2, '0')}</span>
                </div>
            </div>
            <div className="bottom-utility absolute bottom-6 left-6 lg:bottom-10 lg:left-10 z-[1001] text-[10px] lg:text-xs font-bold tracking-[0.2em] uppercase opacity-60 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-black/80 animate-pulse"></div>
                Scroll to see the Magic
            </div>
            <div className="bottom-utility absolute bottom-6 right-6 lg:bottom-10 lg:right-10 z-[1001] text-[10px] lg:text-xs font-bold tracking-[0.2em] uppercase opacity-60 flex gap-4 lg:gap-6 pointer-events-auto">
                <span className="cursor-pointer hover:opacity-100 transition-opacity">IG</span>
                <span className="cursor-pointer hover:opacity-100 transition-opacity">X</span>
                <span className="cursor-pointer hover:opacity-100 transition-opacity">YT</span>
            </div>
            {slideSources.map((src, i) => (
                <div
                    key={`slide-${i}`}
                    ref={(el) => { slideRefs.current[i] = el }}
                    className="slide absolute will-change-transform top-0 left-0"
                    style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT }}
                >
                    <div className="slide-inner w-full h-full relative overflow-clip group cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                        <Image
                            src={src}
                            alt={SlideTitles[i]}
                            fill
                            sizes="(max-width: 768px) 100vw, 320px"
                            priority={i < 5}
                            className="object-cover brightness-[0.85] contrast-125 saturate-110 group-hover:scale-110 group-hover:brightness-100 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 pointer-events-none z-10"></div>
                    </div>
                </div>
            ))}
        </section>
    )
}

export default Hero11