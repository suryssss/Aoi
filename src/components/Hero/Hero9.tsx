'use client'
import { useEffect, useRef } from 'react'
import { useLenis } from 'lenis/react'

const Hero9 = () => {
    const imagesRef = useRef<(HTMLImageElement | null)[]>([])
    const mapContentsRef = useRef<(HTMLDivElement | null)[]>([])
    const sectionsRef = useRef<(HTMLDivElement | null)[]>([])
    const assetsRef = useRef<(HTMLDivElement | null)[]>([])
    const assetImagesRef = useRef<(HTMLImageElement | null)[]>([])
    const mapRef = useRef<HTMLDivElement>(null)

    const lenis = useLenis()

    useEffect(() => {
        if (!lenis) return;

        const updateParallax = () => {
            imagesRef.current.forEach(img => {
                if (!img) return;
                const page = img.closest('.page-section') as HTMLElement
                if (!page) return;
                const rect = page.getBoundingClientRect()
                const scrollProgress = (rect.top / window.innerHeight)
                const translateY = -scrollProgress * 200

                const viewportCenter = window.innerHeight / 2
                const imageCenter = rect.top + (rect.height / 2)
                const distFromCenter = Math.abs(viewportCenter - imageCenter)
                const maxDist = window.innerHeight
                const scaleProgress = 1 - Math.min(distFromCenter / maxDist, 1)
                const scale = 1.1 + (scaleProgress * 0.1)

                img.style.transform = `translateY(${translateY}px) scale(${scale})`
            })
        }

        const updateMap = () => {
            const scrollY = lenis.scroll
            const totalHeight = document.body.scrollHeight - window.innerHeight
            const scrollProgress = totalHeight > 0 ? scrollY / totalHeight : 0

            mapContentsRef.current.forEach(content => {
                if (!content) return;
                const translateY = -scrollProgress * (mapContentsRef.current.length - 1) * 100
                content.style.transform = `translateY(${translateY}%)`
            })

            assetsRef.current.forEach((asset) => {
                if (!asset) return;
                const translateY = -scrollProgress * (assetsRef.current.length - 1) * 100
                asset.style.transform = `translateY(${translateY}%)`
            })

            assetImagesRef.current.forEach((img, index) => {
                if (!img) return;
                const activeIndexFloat = scrollProgress * (assetImagesRef.current.length - 1);
                const distance = activeIndexFloat - index;
                const innerTranslateY = distance * 25;
                const scale = 1.05 + Math.abs(distance) * 0.15;
                img.style.transform = `translateY(${innerTranslateY}px) scale(${scale})`
            })
        }

        lenis.on('scroll', () => {
            updateParallax()
            updateMap()
        })
        let isSnapping = false
        let scrollTimeout: NodeJS.Timeout | null = null

        function snapToSection(section: HTMLElement) {
            if (!section || isSnapping) return;
            isSnapping = true;

            const safetyTimeout = setTimeout(() => {
                if (isSnapping) isSnapping = false;
            }, 1000)

            const viewportHeight = window.innerHeight
            const sectionHeight = section.offsetHeight
            const centerPosition = section.offsetTop - (viewportHeight - sectionHeight) / 2

            lenis?.scrollTo(centerPosition, {
                duration: 0.5,
                easing: (t: number) => 1 - Math.pow(1 - t, 3),
                onComplete: () => {
                    isSnapping = false
                    clearTimeout(safetyTimeout)
                }
            })
        }

        function checkAndSnap() {
            if (isSnapping) return;

            let mostVisibleSection: HTMLElement | null = null
            let maxVisibleArea = 0

            sectionsRef.current.forEach(section => {
                if (!section) return;
                const rect = section.getBoundingClientRect()
                const viewportHeight = window.innerHeight

                const visibleArea = rect.height - Math.max(0, -rect.top) - Math.max(0, rect.bottom - viewportHeight)

                if (visibleArea > maxVisibleArea) {
                    maxVisibleArea = visibleArea
                    mostVisibleSection = section
                }
            })

            if (mostVisibleSection) {
                const sectionEl = mostVisibleSection as HTMLElement;
                const viewportHeight = window.innerHeight
                const targetPos = sectionEl.offsetTop - (viewportHeight - sectionEl.offsetHeight) / 2
                const difference = Math.abs(window.scrollY - targetPos)

                if (difference > 1) {
                    snapToSection(sectionEl)
                }
            }
        }

        const handleScrollEnd = () => {
            if (isSnapping) return
            if (scrollTimeout) clearTimeout(scrollTimeout)
            scrollTimeout = setTimeout(checkAndSnap, 50)
        }

        lenis.on('scroll', handleScrollEnd)

        return () => {
            if (scrollTimeout) clearTimeout(scrollTimeout)
        }
    }, [lenis])

    useEffect(() => {
        const map = mapRef.current
        if (!map) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const opacity = entry.intersectionRatio
                const blur = (1 - opacity) * 10

                const target = entry.target as HTMLElement
                target.style.opacity = opacity.toString()
                target.style.filter = `blur(${blur}px)`
            })
        }, {
            root: map,
            rootMargin: "-30px",
            threshold: [0, 0.25, 0.5, 0.75, 1]
        })

        mapContentsRef.current.forEach(content => {
            if (!content) return;
            content.querySelectorAll('.title1, .title2').forEach(title => {
                observer.observe(title)
            })
        })

        return () => {
            observer.disconnect()
        }
    }, [])

    const pages = [1, 2, 3, 4, 1]
    const bgImages = [
        '/hero/hero9/1.jpg',
        '/hero/hero9/2.jpg',
        '/hero/hero9/3.jpg',
        '/hero/hero9/4.jpg',
        '/hero/hero9/1.jpg',
    ]
    const assetImages = [
        '/hero/hero9/3.jpg',
        '/hero/hero9/1.jpg',
        '/hero/hero9/4.jpg',
        '/hero/hero9/2.jpg',
        '/hero/hero9/3.jpg',
    ]

    const contentData = [
        { num1: '01', num2: '04', t1: 'NATURE — FOREST WHISPERS', t2: 'ADV' },
        { num1: '02', num2: '04', t1: 'MAJESTY — MOUNTAIN PEAKS', t2: 'ADV' },
        { num1: '03', num2: '04', t1: 'SERENITY — OCEAN WAVES', t2: 'ADV' },
        { num1: '04', num2: '04', t1: 'VIBRANCE — AUTUMN COLORS', t2: 'ADV' },
        { num1: '01', num2: '04', t1: 'NATURE — FOREST WHISPERS', t2: 'ADV' }
    ]

    return (
        <div className="relative w-full overflow-x-clip bg-[#ececec]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            {bgImages.map((src, i) => (
                <div
                    key={`page-${i}`}
                    className="page-section h-screen w-full overflow-clip relative"
                    ref={(el) => { sectionsRef.current[i] = el }}
                >
                    <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none transition-opacity duration-500"></div>
                    <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover will-change-transform origin-center scale-110 brightness-95 contrast-125 saturate-110"
                        ref={(el) => { imagesRef.current[i] = el }}
                    />
                </div>
            ))}
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] lg:w-[60vw] h-[30vh] lg:h-[25vh] overflow-clip bg-white z-50 text-black pointer-events-none shadow-2xl"
                ref={mapRef}
            >
                {contentData.map((item, i) => (
                    <div
                        key={`content-${i}`}
                        className="h-full w-full flex justify-between p-5 lg:p-8 will-change-transform"
                        ref={(el) => { mapContentsRef.current[i] = el }}
                    >
                        <div className="title1 flex flex-col justify-between h-full">
                            <span className="text-xs lg:text-[10px] font-bold">{item.num1}</span>
                            <div className="flex items-center gap-3">
                                <span className="text-xs lg:text-[11px] font-bold uppercase tracking-tight">{item.t1}</span>
                            </div>
                        </div>
                        <div className="title2 flex flex-col justify-between h-full text-right">
                            <span className="text-xs lg:text-[10px] font-bold">{item.num2}</span>
                            <span className="text-xs lg:text-[11px] font-bold uppercase tracking-tight">{item.t2}</span>
                        </div>
                    </div>
                ))}
                <div className="absolute bottom-[20%] left-[50%] -translate-x-[4.5rem] lg:-translate-x-[6.5rem] flex items-center gap-2 z-10">
                    <div className="w-2.5 h-2.5 bg-blue-700 rounded-full"></div>
                    <div className="bg-blue-700 text-white text-[8px] lg:text-[9px] font-bold px-2 py-1 leading-none">KEEP SCROLLING</div>
                </div>
                <div className="w-[35vw] lg:w-[16vw] h-[65%] bg-black overflow-clip absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/10 group">
                    {assetImages.map((src, i) => (
                        <div
                            key={`asset-${i}`}
                            className="h-full w-full overflow-clip will-change-transform"
                            ref={(el) => { assetsRef.current[i] = el }}
                        >
                            <img
                                src={src}
                                alt=""
                                className="h-full w-full object-cover will-change-transform brightness-[0.85] contrast-125 saturate-110 group-hover:brightness-100 transition-[filter] duration-700 ease-out"
                                ref={(el) => { assetImagesRef.current[i] = el }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Hero9
