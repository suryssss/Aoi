'use client'
import Hero9 from '@/components/Hero/Hero9'
import { ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const page = () => {
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
        <main>
            <ReactLenis
                root
                options={{
                    autoRaf: false,
                    infinite: true,
                    lerp: 0.05,
                    wheelMultiplier: 0.8,
                    smoothWheel: true,
                    syncTouch: true
                }}
                ref={lenisRef}
            >
                <Hero9 />
            </ReactLenis>
        </main>
    )
}

export default page
