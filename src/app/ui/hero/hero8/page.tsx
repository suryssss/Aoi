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
        <>
            <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
            <section className='relative w-full h-screen flex justify-center items-center overflow-hidden'>
                <p className="uppercase text-[0.9rem] font-medium tracking-[-0.02rem] leading-none">Intro Section</p>
            </section>
            <Hero8 />

            <section className='relative w-full h-screen flex justify-center items-center overflow-hidden'>
                <p className="uppercase text-[0.9rem] font-medium tracking-[-0.02rem] leading-none">Outro Section</p>
            </section>
        </>
    )
}

export default page