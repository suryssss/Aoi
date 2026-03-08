'use client'
import Hero1 from "@/components/Hero/Hero1"
import Hero13 from "@/components/Hero/Hero13"
import Link from "next/link"


type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <div style={{ position: 'absolute', zIndex: 1000, top: 0, padding: '10px' }}>
        <Link href="/ui/hero/1"><button>Hero 1</button></Link>
        <Link href="/ui/hero/2"><button>Hero 2</button></Link>
        <Link href="/ui/hero/3"><button>Hero 3</button></Link>
        <Link href="/ui/hero/13"><button>Hero 13</button></Link>
      </div>

    </div>
  )
}

export default page