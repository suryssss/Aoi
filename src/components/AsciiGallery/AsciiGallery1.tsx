'use client';

import React, { useEffect, useRef } from 'react';

const FONT_SIZE = 11;
const ASCII_COLUMNS = 26;
const ASPECT_W = 4;
const ASPECT_H = 5;
const IMG_STAGGER_MS = 200;
const CELL_APPEAR_MS = 1.2;
const SCRAMBLE_TICKS = 14;
const SCRAMBLE_HZ = 45;
const REVEAL_DELAY_MS = 700;
const DENSE_CUTOFF = 0.42;

const ASCII_CHARS = " .`'-_,:;\"!il1I?|tfjrxcvu+*=Y%#0M@";
const BG_COLOR = '#0d0d0d';
const COLOR_DIM: [number, number, number] = [20, 160, 140];
const COLOR_BRIGHT: [number, number, number] = [228, 232, 245];

let _charW: number | null = null;
function getCharW(): number {
  if (_charW !== null) return _charW;
  if (typeof document === 'undefined') return 7;
  const ctx = document.createElement('canvas').getContext('2d')!;
  ctx.font = `${FONT_SIZE}px monospace`;
  _charW = Math.ceil(ctx.measureText('M').width);
  return _charW;
}
const CHAR_H = Math.ceil(FONT_SIZE * 1.3);

function getAsciiRows(): number {
  return Math.round(ASCII_COLUMNS * (ASPECT_H / ASPECT_W) * (getCharW() / CHAR_H));
}

const DENSE_START = Math.floor(ASCII_CHARS.length * DENSE_CUTOFF);
const DENSE_CHARS = ASCII_CHARS.slice(DENSE_START).split('');

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function brightnessToColor(b: number): string {
  const t = Math.pow(Math.max(0, Math.min(1, b)), 0.65);
  const r = Math.round(lerp(COLOR_DIM[0], COLOR_BRIGHT[0], t));
  const g = Math.round(lerp(COLOR_DIM[1], COLOR_BRIGHT[1], t));
  const bl = Math.round(lerp(COLOR_DIM[2], COLOR_BRIGHT[2], t));
  return `rgb(${r},${g},${bl})`;
}

function waveFromCenter(cols: number, rows: number): number[] {
  const cx = cols / 2;
  const cy = rows / 2;
  return Array.from({ length: cols * rows }, (_, i) => i).sort((a, b) => {
    const da = Math.hypot(Math.floor(a / cols) - cy, (a % cols) - cx) + Math.random() * 1.8;
    const db = Math.hypot(Math.floor(b / cols) - cy, (b % cols) - cx) + Math.random() * 1.8;
    return da - db;
  });
}

interface SampledImage {
  chars: string[][];
  brightness: number[][];
  charIndex: number[][];
}

function sampleImage(img: HTMLImageElement): SampledImage {
  const ASCII_ROWS = getAsciiRows();
  const imgAspect = img.naturalWidth / img.naturalHeight;
  const itemAspect = ASPECT_W / ASPECT_H;
  let cropX = 0, cropY = 0, cropW = img.naturalWidth, cropH = img.naturalHeight;

  if (imgAspect > itemAspect) {
    cropW = img.naturalHeight * itemAspect;
    cropX = (img.naturalWidth - cropW) / 2;
  } else {
    cropH = img.naturalWidth / itemAspect;
    cropY = (img.naturalHeight - cropH) / 2;
  }

  const sc = document.createElement('canvas');
  sc.width = ASCII_COLUMNS;
  sc.height = ASCII_ROWS;
  const scCtx = sc.getContext('2d')!;
  scCtx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, ASCII_COLUMNS, ASCII_ROWS);
  const { data } = scCtx.getImageData(0, 0, ASCII_COLUMNS, ASCII_ROWS);

  const chars: string[][] = [];
  const brightness: number[][] = [];
  const charIndex: number[][] = [];

  for (let row = 0; row < ASCII_ROWS; row++) {
    const cr: string[] = [], br: number[] = [], ir: number[] = [];
    for (let col = 0; col < ASCII_COLUMNS; col++) {
      const p = (row * ASCII_COLUMNS + col) * 4;
      const bv = (data[p] * 0.299 + data[p + 1] * 0.587 + data[p + 2] * 0.114) / 255;
      const ci = Math.min(ASCII_CHARS.length - 1, Math.floor((1 - bv) * ASCII_CHARS.length));
      cr.push(ASCII_CHARS[ci]);
      br.push(bv);
      ir.push(ci);
    }
    chars.push(cr);
    brightness.push(br);
    charIndex.push(ir);
  }
  return { chars, brightness, charIndex };
}

function initCanvas(canvas: HTMLCanvasElement) {
  const CHAR_W = getCharW();
  const ASCII_ROWS = getAsciiRows();
  const dpr = window.devicePixelRatio || 2;
  canvas.width = ASCII_COLUMNS * CHAR_W * dpr;
  canvas.height = ASCII_ROWS * CHAR_H * dpr;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawChar(
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number,
  char: string,
  color: string,
  CHAR_W: number
) {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(col * CHAR_W, row * CHAR_H, CHAR_W + 1, CHAR_H + 1);
  if (char.trim()) {
    ctx.fillStyle = color;
    ctx.fillText(char, col * CHAR_W, row * CHAR_H);
  }
}

interface AnimHandle {
  stop: () => void;
}


function animateCells(
  canvas: HTMLCanvasElement,
  sampled: SampledImage,
  delay: number,
  onDone: () => void
): AnimHandle {
  const CHAR_W = getCharW();
  const ASCII_ROWS = getAsciiRows();
  const dpr = window.devicePixelRatio || 2;
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.font = `${FONT_SIZE}px monospace`;
  ctx.textBaseline = 'top';

  const { chars, brightness, charIndex } = sampled;
  const total = ASCII_COLUMNS * ASCII_ROWS;
  const scrambleState = new Array<number | null>(total).fill(null);
  let settled = 0;
  let revealScheduled = false;
  let stopped = false;
  let rafId = 0;

  const cellOrder = waveFromCenter(ASCII_COLUMNS, ASCII_ROWS);
  const startTime = performance.now();
  let nextCellIdx = 0;
  let lastScrambleTick = startTime;

  const scheduleReveal = () => {
    setTimeout(() => {
      if (!stopped) onDone();
    }, REVEAL_DELAY_MS);
  };

  const tick = (now: number) => {
    if (stopped) return;

    const elapsed = now - startTime - delay;
    if (elapsed >= 0) {
      while (nextCellIdx < total) {
        if (elapsed < nextCellIdx * CELL_APPEAR_MS) break;

        const ci = cellOrder[nextCellIdx];
        const row = Math.floor(ci / ASCII_COLUMNS);
        const col = ci % ASCII_COLUMNS;
        const bv = brightness[row][col];
        const isDark = bv < DENSE_CUTOFF;
        const color = brightnessToColor(bv);

        if (!isDark) {
          drawChar(ctx, col, row, chars[row][col], color, CHAR_W);
          scrambleState[ci] = 0;
          settled++;
          if (settled === total && !revealScheduled) {
            revealScheduled = true;
            scheduleReveal();
          }
        } else {
          drawChar(ctx, col, row, DENSE_CHARS[Math.floor(Math.random() * DENSE_CHARS.length)], color, CHAR_W);
          scrambleState[ci] = SCRAMBLE_TICKS;
        }
        nextCellIdx++;
      }
    }
    if (elapsed >= 0 && now - lastScrambleTick >= SCRAMBLE_HZ) {
      lastScrambleTick = now;
      let anyActive = false;

      for (let ci = 0; ci < total; ci++) {
        const rem = scrambleState[ci];
        if (rem == null || rem === 0) continue;
        anyActive = true;

        const row = Math.floor(ci / ASCII_COLUMNS);
        const col = ci % ASCII_COLUMNS;
        const bv = brightness[row][col];
        const progress = 1 - rem / SCRAMBLE_TICKS;

        if (rem === 1) {
          drawChar(ctx, col, row, chars[row][col], brightnessToColor(bv), CHAR_W);
          scrambleState[ci] = 0;
          settled++;
          if (settled === total && !revealScheduled) {
            revealScheduled = true;
            scheduleReveal();
          }
        } else {
          const targetIdx = charIndex[row][col];
          const randomIdx = Math.floor(Math.random() * ASCII_CHARS.length);
          const blended = Math.floor(lerp(randomIdx, targetIdx, progress * 0.6));
          const clamped = Math.max(0, Math.min(ASCII_CHARS.length - 1, blended));
          const color = brightnessToColor(bv * (0.5 + progress * 0.5));
          drawChar(ctx, col, row, ASCII_CHARS[clamped], color, CHAR_W);
          scrambleState[ci] = rem - 1;
        }
      }
      if (!anyActive && nextCellIdx >= total && settled === total) return;
    }

    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);
  return { stop: () => { stopped = true; cancelAnimationFrame(rafId); } };
}
const GRID_POSITIONS = [
  { col: 8, row: 3 }, { col: 2, row: 1 }, { col: 6, row: 2 },
  { col: 3, row: 4 }, { col: 7, row: 1 }, { col: 4, row: 3 },
  { col: 1, row: 2 }, { col: 8, row: 4 }, { col: 5, row: 1 },
  { col: 2, row: 3 }, { col: 5, row: 3 }, { col: 1, row: 4 },
  { col: 6, row: 4 }, { col: 3, row: 2 }, { col: 7, row: 3 },
];

const IMAGE_SRCS = Array.from({ length: 15 }, (_, i) => `/ascii-ani/img${i + 1}.jpg`);

const AsciiGallery1: React.FC = () => {
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const busyRef = useRef<boolean[]>(new Array(15).fill(false));
  const revealedRef = useRef<boolean[]>(new Array(15).fill(false));
  const animHandlesRef = useRef<(AnimHandle | null)[]>(new Array(15).fill(null));

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    const startEffect = (idx: number, delay: number) => {
      const img = imgRefs.current[idx];
      const canvas = canvasRefs.current[idx];
      const wrapper = wrapperRefs.current[idx];
      if (!img || !canvas || !wrapper) return;

      busyRef.current[idx] = true;
      animHandlesRef.current[idx]?.stop();

      const sampled = sampleImage(img);
      initCanvas(canvas);

      animHandlesRef.current[idx] = animateCells(canvas, sampled, delay, () => {
        busyRef.current[idx] = false;
        revealedRef.current[idx] = true;
        wrapper.classList.add('ascii-revealed');
      });
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        io.unobserve(target);
        const idx = parseInt((target as HTMLElement).dataset.idx ?? '0', 10);
        startEffect(idx, idx * IMG_STAGGER_MS);
      });
    }, { threshold: 0.08 });

    imgRefs.current.forEach((img, idx) => {
      if (!img) return;

      const register = () => io.observe(img);
      if (img.complete && img.naturalWidth) {
        register();
      } else {
        img.addEventListener('load', register);
        cleanups.push(() => img.removeEventListener('load', register));
      }

      const wrapper = wrapperRefs.current[idx];
      if (!wrapper) return;

      const onEnter = () => {
        if (busyRef.current[idx]) return;
        if (!revealedRef.current[idx]) return;
        revealedRef.current[idx] = false;
        wrapper.classList.remove('ascii-revealed');
        startEffect(idx, 0);
      };
      wrapper.addEventListener('mouseenter', onEnter);
      cleanups.push(() => wrapper.removeEventListener('mouseenter', onEnter));
    });

    cleanups.push(() => {
      io.disconnect();
      animHandlesRef.current.forEach(h => h?.stop());
    });

    return () => cleanups.forEach(fn => fn());
  }, []);

  return (
    <div style={{ background: '#0d0d0d', width: '100%' }}>
      <style>{`
        .ascii-gallery {
          position: relative;
          width: 100%;
          height: 100svh;
          padding: 2rem;
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          grid-template-rows: repeat(4, 1fr);
          gap: 1.25rem;
        }
        .ascii-img-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 4/5;
          align-self: center;
          overflow: hidden;
          border-radius: 3px;
          cursor: pointer;
          transition: box-shadow 0.4s ease;
          will-change: opacity;
        }
        .ascii-img-wrapper:hover {
          box-shadow: 0 0 0 1px rgba(78,205,196,0.35),
                      0 8px 32px rgba(0,0,0,0.6);
        }
        .ascii-img-wrapper::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, transparent 50%, rgba(0,0,0,0.45));
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
          z-index: 3;
          border-radius: inherit;
        }
        .ascii-img-wrapper:hover::after { opacity: 1; }
        .ascii-img-wrapper img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 1.4s cubic-bezier(0.4,0,0.2,1);
          z-index: 1;
        }
        .ascii-img-wrapper canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          opacity: 0;
          will-change: opacity;
          animation: asciiFadeIn 0.5s ease 0.1s forwards;
        }
        @keyframes asciiFadeIn { to { opacity: 1; } }
        .ascii-revealed img { opacity: 1; }
        .ascii-revealed canvas {
          opacity: 0 !important;
          transition: opacity 1.2s cubic-bezier(0.4,0,0.2,1) 0.2s;
          animation: none !important;
        }
        @media (max-width: 1000px) {
          .ascii-gallery {
            height: auto;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: none;
            gap: 1rem;
            padding: 1rem;
          }
          .ascii-img-wrapper {
            grid-column: auto !important;
            grid-row: auto !important;
          }
        }
      `}</style>

      <section className="ascii-gallery">
        {IMAGE_SRCS.map((src, idx) => {
          const pos = GRID_POSITIONS[idx];
          return (
            <div
              key={idx}
              ref={el => { wrapperRefs.current[idx] = el; }}
              className="ascii-img-wrapper"
              style={{ gridColumn: pos.col, gridRow: pos.row }}
            >
              <img
                ref={el => { imgRefs.current[idx] = el; }}
                src={src}
                alt={`Gallery image ${idx + 1}`}
                data-idx={String(idx)}
                crossOrigin="anonymous"
              />
              <canvas ref={el => { canvasRefs.current[idx] = el; }} />
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default AsciiGallery1;
