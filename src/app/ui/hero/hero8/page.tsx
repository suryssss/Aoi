'use client'
import Hero8 from '@/components/Hero/Hero8'
import { ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type Props = {}

const page = (props: Props) => {
    const lenisRef = useRef<any>(null)

    useEffect(() => {
        function update(time: number) {
            lenisRef.current?.lenis?.raf(time * 1000)
        }
        gsap.ticker.add(update)
        gsap.ticker.lagSmoothing(0)

        return () => gsap.ticker.remove(update)

    }, [])

    return (
        <main style={{ fontFamily: '"Poppins", sans-serif' }}>
            <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
            <section className='relative w-full h-screen flex flex-col justify-center items-center overflow-hidden bg-zinc-50 text-zinc-900'>
                <h1 className="uppercase text-5xl md:text-6xl font-medium tracking-tighter leading-none mb-6">Intro</h1>
                <div className="flex flex-col items-center gap-3 mt-8 text-zinc-400">
                    <p className="uppercase text-xs md:text-sm font-semibold tracking-[0.2em] leading-none">Scroll down to see the animation</p>
                    <div className="animate-bounce text-xl mt-2">↓</div>
                </div>
            </section>
            <Hero8 />

            <section className='relative w-full h-screen flex flex-col justify-center items-center overflow-hidden text-zinc-900'>
                <h1 className="uppercase text-5xl md:text-6xl font-medium tracking-tighter leading-none">Outro</h1>
                <p className="uppercase text-xs md:text-sm font-semibold tracking-[0.2em] leading-none mt-8 text-zinc-400">The End</p>
            </section>
        </main>
    )
}

export default page