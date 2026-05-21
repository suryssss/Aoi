import React from 'react';
import { notFound } from 'next/navigation';
import PreloaderAnimation from '@/components/Preloader/PreloaderAnimation';

export default async function PreloaderDynamicPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (id !== '1') {
        notFound();
    }

    return (
        <div className="w-full min-h-screen relative overflow-hidden bg-black">
            <PreloaderAnimation />
        </div>
    );
}
