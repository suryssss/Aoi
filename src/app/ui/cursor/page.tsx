'use client'
import Link from "next/link"

type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <div style={{ position: 'absolute', zIndex: 1000, top: 0, padding: '10px' }}>
        <Link href="/ui/cursor/1"><button>Cursor 1</button></Link>
      </div>

    </div>
  )
}

export default page
