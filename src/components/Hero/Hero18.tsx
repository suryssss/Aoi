'use client';

import React, { useEffect, useRef, useCallback } from 'react';

// ── Constants ─────────────────────────────────────────────────────────────────
const GRID_COLOR = '#171717';
const CHAR_COLOR = '#dadada';
const ASCII_CHARS = ' .:*#%@0369';
const THRESHOLD = 0.5;
const PUSH_RADIUS = 5;
const PUSH_FORCE = 30;
const SPRING = 0.025;
const DAMPING = 0.5;

// Types
interface Cell {
    col: number;
    row: number;
    char: string;
    isLit: boolean;
    offsetX: number;
    offsetY: number;
    velX: number;
    velY: number;
}

// Component
const Hero18 = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);

    const cellsRef = useRef<Cell[]>([]);
    const colsRef = useRef(0);
    const rowsRef = useRef(0);
    const cellSizeRef = useRef(8);
    const cellGapRef = useRef(2);
    const cellStepRef = useRef(10);
    const mouseRef = useRef({ col: -999, row: -999, isMoving: false });
    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rafIdRef = useRef<number>(0);
    const charIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const dprRef = useRef(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);

    // Canvas setup
    const setupCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = dprRef.current;
        const isMobile = window.innerWidth < 768;

        cellSizeRef.current = isMobile ? 3 : 8;
        cellGapRef.current = isMobile ? 1 : 2;
        cellStepRef.current = cellSizeRef.current + cellGapRef.current;

        colsRef.current = Math.floor(window.innerWidth / cellStepRef.current);
        rowsRef.current = Math.floor(window.innerHeight / cellStepRef.current);

        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }, []);

    const sampleLogoIntoCells = useCallback(() => {
        const canvas = canvasRef.current;
        const logoImg = logoRef.current;
        if (!canvas || !logoImg) return;

        const step = cellStepRef.current;
        const cols = colsRef.current;
        const rows = rowsRef.current;

        const rect = logoImg.getBoundingClientRect();
        const logoCols = Math.ceil(rect.width / step);
        const logoRows = Math.ceil(rect.height / step);
        const startCol = Math.floor(rect.left / step);
        const startRow = Math.floor(rect.top / step);

        const sampleCanvas = document.createElement('canvas');
        sampleCanvas.width = logoCols;
        sampleCanvas.height = logoRows;
        const sampleCtx = sampleCanvas.getContext('2d');
        if (!sampleCtx) return;

        sampleCtx.fillStyle = '#000';
        sampleCtx.fillRect(0, 0, logoCols, logoRows);
        sampleCtx.drawImage(logoImg, 0, 0, logoCols, logoRows);

        const { data } = sampleCtx.getImageData(0, 0, logoCols, logoRows);
        const newCells: Cell[] = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const inLogo =
                    col >= startCol &&
                    col < startCol + logoCols &&
                    row >= startRow &&
                    row < startRow + logoRows;

                let isLit = false;
                let char = ' ';

                if (inLogo) {
                    const idx = ((row - startRow) * logoCols + (col - startCol)) * 4;
                    const brightness =
                        (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114) / 255;

                    isLit = brightness > THRESHOLD;
                    char = isLit
                        ? ASCII_CHARS[Math.min(ASCII_CHARS.length - 1, Math.floor(brightness * ASCII_CHARS.length))]
                        : ' ';
                }

                newCells.push({ col, row, char, isLit, offsetX: 0, offsetY: 0, velX: 0, velY: 0 });
            }
        }

        cellsRef.current = newCells;
    }, []);

    const renderFrame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        const step = cellStepRef.current;
        const size = cellSizeRef.current;
        const cells = cellsRef.current;

        ctx.font = `${size + 2}px monospace`;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // Draw base grid dots
        ctx.fillStyle = GRID_COLOR;
        for (const { col, row } of cells)
            ctx.fillRect(col * step, row * step, size, size);

        // Draw ASCII characters for lit cells
        ctx.fillStyle = CHAR_COLOR;
        for (const { col, row, char, isLit, offsetX, offsetY } of cells) {
            if (!isLit) continue;
            const x = (col + Math.round(offsetX)) * step;
            const y = (row + Math.round(offsetY)) * step;
            ctx.fillText(char, x + size / 2, y);
        }
    }, []);

    //  Physics update
    const updatePhysics = useCallback(() => {
        const mouse = mouseRef.current;
        for (const cell of cellsRef.current) {
            if (!cell.isLit) continue;

            if (mouse.isMoving) {
                const dx = cell.col + cell.offsetX - mouse.col;
                const dy = cell.row + cell.offsetY - mouse.row;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < PUSH_RADIUS && dist > 0) {
                    const force = (1 - dist / PUSH_RADIUS) ** 2 * PUSH_FORCE;
                    cell.velX += (dx / dist) * force;
                    cell.velY += (dy / dist) * force;
                }
            }

            cell.velX += -cell.offsetX * SPRING;
            cell.velY += -cell.offsetY * SPRING;
            cell.velX *= DAMPING;
            cell.velY *= DAMPING;
            cell.offsetX += cell.velX;
            cell.offsetY += cell.velY;

            if (Math.abs(cell.offsetX) < 0.01 && Math.abs(cell.velX) < 0.01)
                cell.offsetX = cell.velX = 0;
            if (Math.abs(cell.offsetY) < 0.01 && Math.abs(cell.velY) < 0.01)
                cell.offsetY = cell.velY = 0;
        }
    }, []);

    //  Animation loop
    const animationLoop = useCallback(() => {
        updatePhysics();
        renderFrame();
        rafIdRef.current = requestAnimationFrame(animationLoop);
    }, [updatePhysics, renderFrame]);

    const init = useCallback(() => {
        setupCanvas();
        sampleLogoIntoCells();
        renderFrame();
    }, [setupCanvas, sampleLogoIntoCells, renderFrame]);

    useEffect(() => {
        const logoImg = logoRef.current;
        if (!logoImg) return;

        const handleLoad = () => {
            init();
            charIntervalRef.current = setInterval(() => {
                for (const cell of cellsRef.current)
                    if (cell.isLit)
                        cell.char = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
                renderFrame();
            }, 50);

            rafIdRef.current = requestAnimationFrame(animationLoop);
        };

        if (logoImg.complete) {
            handleLoad();
        } else {
            logoImg.addEventListener('load', handleLoad);
        }

        const step = () => cellStepRef.current;

        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current.col = e.clientX / step();
            mouseRef.current.row = e.clientY / step();
            mouseRef.current.isMoving = true;

            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            idleTimerRef.current = setTimeout(() => {
                mouseRef.current.isMoving = false;
            }, 50);
        };

        const onMouseLeave = () => {
            mouseRef.current.col = -999;
            mouseRef.current.row = -999;
            mouseRef.current.isMoving = false;
        };

        const onResize = () => init();

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseleave', onMouseLeave);
        window.addEventListener('resize', onResize);

        return () => {
            logoImg.removeEventListener('load', handleLoad);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseleave', onMouseLeave);
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(rafIdRef.current);
            if (charIntervalRef.current) clearInterval(charIntervalRef.current);
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        };
    }, [init, animationLoop, renderFrame]);

    return (
        <section className="relative w-full h-[100svh] bg-[#0f0f0f] overflow-hidden">
            <img
                ref={logoRef}
                src="/image.png"
                alt="Logo source"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-auto object-contain block invisible pointer-events-none"
            />
            <canvas
                ref={canvasRef}
                className="block w-full h-full"
            />
        </section>
    );
};

export default Hero18;
