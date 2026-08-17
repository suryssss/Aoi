import React from 'react';
import { notFound } from 'next/navigation';
import Footer1 from '@/components/Footer/Footer1';

const footers: Record<string, React.FC> = {
  '1': Footer1,
};

export default async function FooterDynamicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const FooterComponent = footers[id];

  if (!FooterComponent) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen">
      <FooterComponent />
    </div>
  );
}
