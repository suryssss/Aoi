import React from 'react';
import { notFound } from 'next/navigation';

import Hero1 from '@/components/Hero/Hero1';
import Hero2 from '@/components/Hero/Hero2';
import Hero3 from '@/components/Hero/Hero3';
import Hero4 from '@/components/Hero/Hero4';
import Hero5 from '@/components/Hero/Hero5';
import Hero6 from '@/components/Hero/Hero6';
import Hero7 from '@/components/Hero/Hero7';
import Hero8 from '@/components/Hero/Hero8';
import Hero9 from '@/components/Hero/Hero9';
import Hero10 from '@/components/Hero/Hero10';
import Hero11 from '@/components/Hero/Hero11';
import Hero12 from '@/components/Hero/Hero12';
import Hero13 from '@/components/Hero/Hero13';
import Hero14 from '@/components/Hero/Hero14';
import Hero15 from '@/components/Hero/Hero15';
import Hero16 from '@/components/Hero/Hero16';

const heroes: Record<string, React.FC> = {
    '1': Hero1,
    '2': Hero2,
    '3': Hero3,
    '4': Hero4,
    '5': Hero5,
    '6': Hero6,
    '7': Hero7,
    '8': Hero8,
    '9': Hero9,
    '10': Hero10,
    '11': Hero11,
    '12': Hero12,
    '13': Hero13,
    '14': Hero14,
    '15': Hero15,
    '16': Hero16,
};

export default async function HeroDynamicPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const HeroComponent = heroes[id];

    if (!HeroComponent) {
        notFound();
    }

    return (
        <div className="w-full min-h-screen">
            <HeroComponent />
        </div>
    );
}
