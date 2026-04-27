import React from 'react';
import { notFound } from 'next/navigation';

import Navbar1 from '@/components/Navbar/Navbar1';

const navbars: Record<string, React.FC> = {
  '1': Navbar1,
};

export default async function NavbarDynamicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const NavbarComponent = navbars[id];

  if (!NavbarComponent) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen">
      <NavbarComponent />
    </div>
  );
}
