'use client'
import Link from 'next/link'

const page = () => {
  return (
    <div>
      <div style={{ position: 'absolute', zIndex: 1000, top: 0, padding: '10px' }}>
        <Link href="/ui/gallery/1"><button>ASCII Gallery 1</button></Link>
      </div>
    </div>
  )
}

export default page
