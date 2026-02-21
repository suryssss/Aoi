'use client'
import Hero1 from "@/components/Hero/Hero1"
import Link from "next/link"


type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <Link href="/ui/hero/hero1"><button>Hero 1</button></Link>
      <Link href="/ui/hero/hero2"><button>Hero 2</button></Link>
      <Link href="/ui/hero/hero3"><button>Hero 3</button></Link>
    </div>
  )
}

export default page