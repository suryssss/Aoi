import React from 'react';
import { notFound } from 'next/navigation';

import Cursor1 from '@/components/Cursor/Cursor1';

const cursors: Record<string, React.FC> = {
    '1': Cursor1,
};

export default async function CursorDynamicPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const CursorComponent = cursors[id];

    if (!CursorComponent) {
        notFound();
    }

    return (
        <div className="w-full min-h-screen">
            <CursorComponent />
        </div>
    );
}
