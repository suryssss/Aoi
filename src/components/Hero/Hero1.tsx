'use client'
import RippleGrid from "@/animations/RippleGrid"
import Image from "next/image"
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Props = {}

const Hero1 = (props: Props) => {
    const textRef = useRef<HTMLDivElement>(null)
    const imagesRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Text animation
        if (textRef.current) {
            const elements = textRef.current.children
            gsap.fromTo(elements,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: textRef.current,
                        start: "top 80%",
                    }
                }
            )
        }

        // Images animation
        if (imagesRef.current) {
            const images = imagesRef.current.children
            gsap.fromTo(images,
                { y: 150, opacity: 0 },
                {
                    y: (index, target) => {
                        return 0
                    },
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: imagesRef.current,
                        start: "top 75%",
                    }
                }
            )
        }
    }, [])

    return (
        <div className='bg-[#000000] w-full'>
            <div className='relative overflow-hidden flex flex-col items-center justify-center min-h-screen gap-8 pb-20'>
                <div className='absolute inset-0 z-0 pointer-events-auto'>
                    <RippleGrid
                        enableRainbow={true}
                        gridColor="#5227FF"
                        rippleIntensity={0.02}
                        gridSize={20}
                        gridThickness={25}
                        mouseInteraction={true}
                        mouseInteractionRadius={1.0}
                        opacity={0.8}
                    />
                </div>

                <div ref={textRef} className='z-10 relative flex flex-col items-center gap-8 pointer-events-none'>
                    <h1 className='text-white font-semibold text-6xl text-center pointer-events-auto leading-tight'>Build Better Products With <br /> Powerful Analytics</h1>
                    <p className='text-white/80 text-2xl  text-center pointer-events-auto'>Get deep insights into user behavior and make data-driven <br></br>decisions that accelerate your product growth</p>
                    <div className='flex gap-6 pointer-events-auto mt-4'>
                        <button className='bg-white px-8 py-4 text-black font-medium rounded-full hover:bg-gray-200 transition-colors'>Start free trial</button>
                        <button className='px-8 py-4 bg-white/10 text-white font-medium rounded-full hover:bg-white/20 transition-colors'>See how it works</button>
                    </div>
                </div>
            </div>

            {/* Images */}
            <div ref={imagesRef} className="relative w-full overflow-hidden flex justify-center items-start gap-6 pointer-events-none mt-[-250px] pb-40">
                {/* 1. Far Left */}
                <div className="relative w-[280px] h-[500px] shrink-0 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl mt-[-40px]">
                    <Image src="/hero/heroimg1.png" alt="Hero Image 1" fill className="object-cover grayscale" />
                </div>

                {/* 2. Mid Left */}
                <div className="relative w-[280px] h-[450px] shrink-0 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl mt-[80px]">
                    <Image src="/hero/heroimg2.avif" alt="Hero Image 2" fill className="object-cover object-left-top grayscale" />
                </div>

                {/* 3. Center */}
                <div className="relative w-[280px] h-[350px] shrink-0 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl mt-[140px]">
                    <Image src="/hero/heroimg3.avif" alt="Hero Image 3" fill className="object-cover object-center grayscale" />
                </div>

                {/* 4. Mid Right */}
                <div className="relative w-[280px] h-[450px] shrink-0 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl mt-[50px]">
                    <Image src="/hero/heroimg4.avif" alt="Hero Image 4" fill className="object-cover object-center grayscale" />
                </div>

                {/* 5. Far Right */}
                <div className="relative w-[280px] h-[500px] shrink-0 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl mt-[-60px]">
                    <Image src="/hero/heroimg5.avif" alt="Hero Image 5" fill className="object-cover object-left-top grayscale" />
                </div>
            </div>
        </div>
    )
}

export default Hero1