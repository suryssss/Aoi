'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// ─── ASCII Art Constants ───────────────────────────────────────────
const ASCII_CHARS = " . ... .......:::=+xX#0369";
const FONT_SIZE = 18;
const CELL_SIZE = 20;
const ASCII_COLUMNS = 80;
const DPR = 2;

const CHAR_COLOR = "#803500";
const HOVER_COLOR = "#ff6a00";
const HOVER_CHAR_COLOR = "#0f0f0f";

const HOVER_RADIUS = 8;
const CLUSTER_SIZE = 10;
const HIGHLIGHT_LIFETIME = 300;

const PARALLAX_STRENGTH = 20;
const PARALLAX_EASE = 0.05;

const backgroundCharIndex = ASCII_CHARS.lastIndexOf(" ");

// ─── Types ─────────────────────────────────────────────────────────
interface Cell {
  col: number;
  row: number;
  char: string;
  highlightEndTime: number;
}

interface HandData {
  canvas: HTMLCanvasElement;
  cells: Map<string, Cell>;
  cellList: Cell[];
  rows: number;
}

// ─── Helper Functions ──────────────────────────────────────────────
const sampleImagePixels = (image: HTMLImageElement, gridRows: number): Uint8ClampedArray => {
  const canvas = document.createElement("canvas");
  canvas.width = ASCII_COLUMNS;
  canvas.height = gridRows;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(image, 0, 0, ASCII_COLUMNS, gridRows);
  return ctx.getImageData(0, 0, ASCII_COLUMNS, gridRows).data;
};

const pixelToCharIndex = (pixels: Uint8ClampedArray, pixelOffset: number): number => {
  const brightness =
    (pixels[pixelOffset] * 0.299 +
      pixels[pixelOffset + 1] * 0.587 +
      pixels[pixelOffset + 2] * 0.114) /
    255;

  return Math.min(
    ASCII_CHARS.length - 1,
    Math.floor((1 - brightness) * ASCII_CHARS.length)
  );
};

const buildCells = (image: HTMLImageElement): { rows: number; cells: Map<string, Cell> } => {
  const rows = Math.round(
    ASCII_COLUMNS / (image.naturalWidth / image.naturalHeight)
  );

  const pixels = sampleImagePixels(image, rows);
  const cells = new Map<string, Cell>();

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < ASCII_COLUMNS; col++) {
      const pixelOffset = (row * ASCII_COLUMNS + col) * 4;

      if (pixels[pixelOffset + 3] < 128) continue;

      const charIndex = pixelToCharIndex(pixels, pixelOffset);

      if (charIndex <= backgroundCharIndex) continue;

      cells.set(`${col},${row}`, {
        col,
        row,
        char: ASCII_CHARS[charIndex],
        highlightEndTime: 0,
      });
    }
  }

  return { rows, cells };
};

const setupHand = (image: HTMLImageElement, canvasEl: HTMLCanvasElement): HandData => {
  const { rows, cells } = buildCells(image);
  const cellList = [...cells.values()];

  canvasEl.width = ASCII_COLUMNS * CELL_SIZE * DPR;
  canvasEl.height = rows * CELL_SIZE * DPR;

  const ctx = canvasEl.getContext("2d")!;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.font = `${FONT_SIZE}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const metrics = ctx.measureText("X");
  const glyphHeight =
    metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  const baselineOffset =
    CELL_SIZE / 2 +
    glyphHeight / 2 -
    metrics.actualBoundingBoxDescent;

  const canvasWidth = ASCII_COLUMNS * CELL_SIZE;
  const canvasHeight = rows * CELL_SIZE;

  const render = () => {
    const now = Date.now();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (const cell of cellList) {
      const x = cell.col * CELL_SIZE;
      const y = cell.row * CELL_SIZE;
      const isHighlighted = cell.highlightEndTime > now;

      if (isHighlighted) {
        ctx.fillStyle = HOVER_COLOR;
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      }

      ctx.fillStyle = isHighlighted ? HOVER_CHAR_COLOR : CHAR_COLOR;
      ctx.fillText(
        cell.char,
        x + CELL_SIZE / 2,
        y + baselineOffset
      );
    }

    requestAnimationFrame(render);
  };

  render();

  return { canvas: canvasEl, cells, cellList, rows };
};

const highlightCluster = (cells: Map<string, Cell>, startCell: Cell): void => {
  const now = Date.now();
  startCell.highlightEndTime = now + HIGHLIGHT_LIFETIME;

  const steps = Math.floor(Math.random() * CLUSTER_SIZE) + 1;
  const litCells = [startCell];
  let current = startCell;

  for (let step = 0; step < steps; step++) {
    const neighbours: Cell[] = [];

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;

        const neighbour = cells.get(
          `${current.col + dx},${current.row + dy}`
        );

        if (neighbour && !litCells.includes(neighbour)) {
          neighbours.push(neighbour);
        }
      }
    }

    if (neighbours.length === 0) break;

    const next =
      neighbours[Math.floor(Math.random() * neighbours.length)];

    next.highlightEndTime = now + HIGHLIGHT_LIFETIME + step * 10;
    litCells.push(next);
    current = next;
  }
};

const hoverHand = (hand: HandData, clientX: number, clientY: number): void => {
  const rect = hand.canvas.getBoundingClientRect();
  const mouseCol = ((clientX - rect.left) / rect.width) * ASCII_COLUMNS;
  const mouseRow = ((clientY - rect.top) / rect.height) * hand.rows;

  let closest: Cell | null = null;
  let closestDist = Infinity;

  for (const cell of hand.cellList) {
    const dx = mouseCol - cell.col;
    const dy = mouseRow - cell.row;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < closestDist) {
      closestDist = dist;
      closest = cell;
    }
  }

  if (closest && closestDist <= HOVER_RADIUS) {
    highlightCluster(hand.cells, closest);
  }
};

// ─── Component ─────────────────────────────────────────────────────
const Footer1: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const revealerRef = useRef<HTMLDivElement>(null);
  const leftImgRef = useRef<HTMLImageElement>(null);
  const rightImgRef = useRef<HTMLImageElement>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<HandData[]>([]);

  const headingCharsRef = useRef<HTMLElement[]>([]);
  const contentLinesRef = useRef<HTMLElement[]>([]);

  const revealRef = useRef({ left: -125, right: 125 });
  const pointerRef = useRef({ x: 0, y: 0 });
  const driftRef = useRef({ x: 0, y: 0 });

  const handWrappersRef = useRef<HTMLDivElement[]>([]);
  const leftWrapperRef = useRef<HTMLDivElement>(null);
  const rightWrapperRef = useRef<HTMLDivElement>(null);

  const parallaxScale = 1 + (PARALLAX_STRENGTH * 2) / 200;

  const setPointerTarget = useCallback((clientX: number, clientY: number) => {
    const footer = footerRef.current;
    if (!footer) return;
    const rect = footer.getBoundingClientRect();
    pointerRef.current.x =
      ((clientX - rect.left) / rect.width - 0.5) * PARALLAX_STRENGTH * 2;
    pointerRef.current.y =
      ((clientY - rect.top) / rect.height - 0.5) * PARALLAX_STRENGTH * 2;
  }, []);

  useEffect(() => {
    // ── Lenis smooth scroll ──
    let lenis: InstanceType<typeof import('lenis').default> | null = null;

    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis();
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time: number) => lenis!.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    });

    // ── SplitText heading chars ──
    const headings = document.querySelectorAll<HTMLElement>('.footer-header-cg20 h1');
    const chars: HTMLElement[] = [];

    headings.forEach((heading) => {
      const split = SplitText.create(heading, {
        type: 'chars',
        charsClass: 'char',
      });
      chars.push(...(split.chars as HTMLElement[]));
    });

    gsap.set(chars, { position: 'relative', yPercent: 125 });
    headingCharsRef.current = chars;

    // ── SplitText content lines ──
    const elements = document.querySelectorAll<HTMLElement>(
      '.footer-links-cg20 a, .footer-text-cg20 p'
    );
    const lines: HTMLElement[] = [];

    elements.forEach((element) => {
      const split = SplitText.create(element, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'line',
      });
      lines.push(...(split.lines as HTMLElement[]));
    });

    gsap.set(lines, { yPercent: 100 });
    contentLinesRef.current = lines;

    // ── Setup ASCII hands ──
    const initHand = (
      image: HTMLImageElement,
      canvas: HTMLCanvasElement
    ) => {
      const hand = setupHand(image, canvas);
      handsRef.current.push(hand);
    };

    const setupImage = (
      imgEl: HTMLImageElement | null,
      canvasEl: HTMLCanvasElement | null
    ) => {
      if (!imgEl || !canvasEl) return;
      if (imgEl.complete && imgEl.naturalWidth) {
        initHand(imgEl, canvasEl);
      } else {
        imgEl.addEventListener('load', () => initHand(imgEl, canvasEl));
      }
    };

    setupImage(leftImgRef.current, leftCanvasRef.current);
    setupImage(rightImgRef.current, rightCanvasRef.current);

    // ── Hand wrappers for parallax ──
    const wrappers: HTMLDivElement[] = [];
    if (leftWrapperRef.current) wrappers.push(leftWrapperRef.current);
    if (rightWrapperRef.current) wrappers.push(rightWrapperRef.current);
    handWrappersRef.current = wrappers;

    // ── Mouse events ──
    const onMouseMove = (event: MouseEvent) => {
      handsRef.current.forEach((hand) =>
        hoverHand(hand, event.clientX, event.clientY)
      );
      setPointerTarget(event.clientX, event.clientY);
    };

    window.addEventListener('mousemove', onMouseMove);

    // ── Parallax render loop ──
    let parallaxRafId: number;
    const renderParallax = () => {
      driftRef.current.x +=
        (pointerRef.current.x - driftRef.current.x) * PARALLAX_EASE;
      driftRef.current.y +=
        (pointerRef.current.y - driftRef.current.y) * PARALLAX_EASE;

      handWrappersRef.current.forEach((wrapper, i) => {
        const direction = i === 0 ? 1 : -1;
        const revealX =
          i === 0 ? revealRef.current.left : revealRef.current.right;
        const x = driftRef.current.x * direction;
        const y = -driftRef.current.y;

        wrapper.style.transform = `translate(calc(${x}px + ${revealX}%), ${y}px) scale(${parallaxScale})`;
      });

      parallaxRafId = requestAnimationFrame(renderParallax);
    };

    renderParallax();

    // ── ScrollTrigger animations ──
    const charStagger = { each: 0.04, from: 'center' as const };

    const animateIn = () => {
      gsap.to(revealRef.current, {
        left: 0,
        right: 0,
        duration: 1,
        ease: 'power3.out',
        overwrite: true,
      });

      gsap.to(headingCharsRef.current, {
        yPercent: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: charStagger,
        overwrite: true,
      });

      gsap.to(contentLinesRef.current, {
        yPercent: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
        overwrite: true,
      });
    };

    const animateOut = () => {
      gsap.to(revealRef.current, {
        left: -125,
        right: 125,
        duration: 0.4,
        ease: 'power2.in',
        overwrite: true,
      });

      gsap.to(headingCharsRef.current, {
        yPercent: 125,
        duration: 0.4,
        ease: 'power2.in',
        stagger: { each: 0.01, from: 'center' as const },
        overwrite: true,
      });

      gsap.to(contentLinesRef.current, {
        yPercent: 100,
        duration: 0.4,
        ease: 'power2.in',
        stagger: 0.02,
        overwrite: true,
      });
    };

    const triggerEnter = ScrollTrigger.create({
      trigger: revealerRef.current,
      start: 'top 50%',
      onEnter: animateIn,
    });

    const triggerLeave = ScrollTrigger.create({
      trigger: revealerRef.current,
      start: 'top 85%',
      onLeaveBack: animateOut,
    });

    // ── Cleanup ──
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(parallaxRafId);
      triggerEnter.kill();
      triggerLeave.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (lenis) lenis.destroy();
    };
  }, [setPointerTarget, parallaxScale]);

  return (
    <div style={{ background: '#1a1a1a', width: '100%' }}>
      <style>{`
        /* ── Sections ── */
        .cg20-section {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100svh;
          background-color: #1a1a1a;
          color: #ffa600;
          padding: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        .cg20-section h1 {
          font-size: clamp(2rem, 5vw, 8rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        }

        /* ── Footer Revealer ── */
        .footer-revealer-cg20 {
          position: relative;
          width: 100%;
          height: 100svh;
        }

        /* ── Footer ── */
        .footer-cg20 {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100svh;
          background-color: #0f0f0f;
          overflow: hidden;
          z-index: 0;
          font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        }

        .footer-images-cg20 {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-hand-img-cg20 {
          position: relative;
          width: 40%;
          min-width: 200px;
          will-change: transform;
        }

        .footer-hand-img-cg20 img {
          display: block;
          width: 100%;
          opacity: 0;
        }

        .footer-hand-img-cg20 canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .footer-content-cg20 {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          gap: 2rem;
          color: #fff;
        }

        .footer-links-cg20 {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .footer-links-cg20 a {
          color: #fff;
          text-decoration: none;
          font-size: 1.1rem;
        }

        .footer-text-cg20 {
          max-width: 28rem;
        }

        .footer-text-cg20 p {
          font-size: 1.1rem;
          line-height: 1.4;
        }

        .footer-header-cg20 {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          color: #fff;
        }

        .footer-header-cg20 h1 {
          font-size: clamp(4rem, 15vw, 15rem);
          font-weight: 500;
          line-height: 1;
          letter-spacing: -0.02em;
          overflow: hidden;
        }

        @media (max-width: 1000px) {
          .footer-content-cg20 {
            flex-direction: column;
          }

          .footer-text-cg20 {
            max-width: 100%;
          }

          .footer-header-cg20 h1 {
            font-size: 3rem;
          }
        }
      `}</style>

      {/* Scrollable sections to demonstrate the reveal */}
      <section className="cg20-section">
        <h1>One</h1>
      </section>
      <section className="cg20-section">Two</section>
      <section className="cg20-section">Three</section>

      {/* Revealer trigger element */}
      <div className="footer-revealer-cg20" ref={revealerRef} />

      {/* Fixed footer */}
      <footer className="footer-cg20" ref={footerRef}>
        <div className="footer-images-cg20">
          <div className="footer-hand-img-cg20" ref={leftWrapperRef}>
            <img
              src="/footer/left.png"
              alt="ASCII left hand"
              className="ascii-hand"
              ref={leftImgRef}
              crossOrigin="anonymous"
            />
            <canvas ref={leftCanvasRef} />
          </div>
          <div className="footer-hand-img-cg20" ref={rightWrapperRef}>
            <img
              src="/footer/right.png"
              alt="ASCII right hand"
              className="ascii-hand"
              ref={rightImgRef}
              crossOrigin="anonymous"
            />
            <canvas ref={rightCanvasRef} />
          </div>
        </div>

        <div className="footer-content-cg20">
          <nav className="footer-links-cg20">
            <a href="#">Work</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Journal</a>
          </nav>

          <div className="footer-text-cg20">
            <p>
              A multidisplinary studio working across direction, design and motion
              we build considered digital experience for brands that care
              about the details
            </p>
          </div>
        </div>

        <div className="footer-header-cg20">
          <h1>Blank</h1>
          <h1>Canvas</h1>
        </div>
      </footer>
    </div>
  );
};

export default Footer1;
