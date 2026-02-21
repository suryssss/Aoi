import React from 'react'
import Hero2 from '@/components/Hero/Hero2'

type Props = {}

const page = (props: Props) => {
    return (
        <div className="bg-[#0a0a0a] h-screen max-h-screen w-full overflow-hidden">
            <Hero2 />
        </div>
    )
}

export default page