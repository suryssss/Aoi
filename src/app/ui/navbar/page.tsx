'use client';

import Link from 'next/link';

export default function NavbarPage() {
  return (
    <div style={{ position: 'absolute', zIndex: 1000, top: 0, padding: '10px', display: 'flex', gap: '8px' }}>
      <Link href="/ui/navbar/1">
        <button>Navbar 1</button>
      </Link>
      <Link href="/ui/navbar/2">
        <button>Navbar 2</button>
      </Link>
    </div>
  );
}
