'use client'
import { useEffect, useRef } from "react"
import { PROJECTS } from "@/data/projects"
import { gsap } from "gsap"
import Image from "next/image"

type Props = {}

const PROJECT_PER_ROWS = 9
const TOTAL_ROWS = 10

const Hero8 = (props: Props) => {
    const sectionRef = useRef<HTMLDivElement>(null)
    const rowsRef = useRef<(HTMLDivElement | null)[]>([])


    const rowsData: any[] = []
    let currentProjectIndex = 0
    const rowStartWidth = useRef<number>(125)
    const rowEndWidth = useRef<number>(500)

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const rows = rowsRef.current;
        const isMobile = window.innerWidth < 1000;
        rowStartWidth.current = isMobile ? 250 : 125;
        rowEndWidth.current = isMobile ? 750 : 500;

        const firstRow = rows[0]
        if (!firstRow) return;
        firstRow.style.width = `${rowEndWidth.current}%`
        const expandedRowHeight = firstRow.offsetHeight
        firstRow.style.width = ""

        const SectionGap = parseFloat(getComputedStyle(section).gap) || 0
        const sectionPadding =
            parseFloat(getComputedStyle(section).paddingTop) || 0

        const expandedSectionHeight =
            expandedRowHeight * rows.length +
            SectionGap * (rows.length - 1) +
            sectionPadding * 2

        section.style.height = `${expandedSectionHeight}px`


        function onScrollUpdate() {
            const scrollY = window.scrollY
            const viewportHeight = window.innerHeight

            rows.forEach((row) => {
                if (!row) return;
                const rect = row.getBoundingClientRect()
                const rowTop = rect.top + scrollY
                const rowBottom = rowTop + rect.height

                const scrollStart = rowTop - viewportHeight
                const scrollEnd = rowBottom

                let progress = (scrollY - scrollStart) / (scrollEnd - scrollStart)
                progress = Math.max(0, Math.min(1, progress))

                const width =
                    rowStartWidth.current +
                    (rowEndWidth.current - rowStartWidth.current) * progress

                row.style.width = `${width}%`
            })
        }

        gsap.ticker.add(onScrollUpdate)

        const handleResize = () => {
            const isMobile = window.innerWidth < 1000
            rowStartWidth.current = isMobile ? 250 : 125
            rowEndWidth.current = isMobile ? 750 : 500

            if (!firstRow) return;
            firstRow.style.width = `${rowEndWidth.current}%`
            const newRowsHeight = firstRow.offsetHeight
            firstRow.style.width = ""

            const newSectionHeight =
                newRowsHeight * rows.length +
                SectionGap * (rows.length - 1) +
                sectionPadding * 2

            section.style.height = `${newSectionHeight}px`
        }

        window.addEventListener("resize", handleResize)

        return () => {
            gsap.ticker.remove(onScrollUpdate)
            window.removeEventListener("resize", handleResize)
        }

    }, [])

    for (let r = 0; r < TOTAL_ROWS; r++) {
        const projects: any[] = []
        for (let c = 0; c < PROJECT_PER_ROWS; c++) {
            projects.push(PROJECTS[currentProjectIndex % PROJECTS.length])
            currentProjectIndex++
        }
        rowsData.push(projects)
    }

    return (
        <section ref={sectionRef} className='relative w-full py-2 flex flex-col items-center gap-2 overflow-hidden' style={{ fontFamily: '"Poppins", sans-serif' }}>
            {rowsData.map((rowProjects, rowIndex) => (
                <div
                    key={rowIndex}
                    className="w-[125%] flex gap-4 will-change-[width]"
                    ref={(el) => {
                        if (el) rowsRef.current[rowIndex] = el;
                    }}
                >
                    {rowProjects.map((project: any, colIndex: number) => (
                        <div key={colIndex} className="flex-1 aspect-[7/5] flex flex-col overflow-hidden">
                            <div className="flex-1 min-h-0 overflow-hidden relative">
                                <Image src={project.image} alt={project.title} fill className="object-cover" sizes="(max-width: 1000px) 50vw, 33vw" priority={rowIndex <= 1} />
                            </div>
                            <div className="flex justify-between py-1">
                                <p className="text-xs uppercase font-medium tracking-[-0.02rem] leading-none">{project.title}</p>
                                <p className="text-xs uppercase font-medium tracking-[-0.02rem] leading-none">{project.year}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </section>
    )
}

export default Hero8