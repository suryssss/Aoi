'use client';

import Link from 'next/link';

export default function NavbarPage() {
  return (
    <div style={{ position: 'absolute', zIndex: 1000, top: 0, padding: '10px' }}>
      <Link href="/ui/navbar/1">
        <button>Navbar 1</button>
      </Link>
    </div>
  );
}
