import React from 'react';
import { notFound } from 'next/navigation';
import AsciiGallery1 from '@/components/AsciiGallery/AsciiGallery1';

const galleries: Record<string, React.FC> = {
  '1': AsciiGallery1,
};

export default async function GalleryDynamicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const GalleryComponent = galleries[id];

  if (!GalleryComponent) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen">
      <GalleryComponent />
    </div>
  );
}
