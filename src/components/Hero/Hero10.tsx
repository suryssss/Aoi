"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const slides = [
    { name: 'contour', img: '/hero/hero8/img1.jpg' },
    { name: 'texture', img: '/hero/hero8/img2.jpg' },
    { name: 'color', img: '/hero/hero8/img3.jpg' },
    { name: 'normal', img: '/hero/hero8/img4.jpg' },
    { name: 'depth', img: '/hero/hero8/img5.jpg' },
    { name: 'Warm', img: '/hero/hero8/img6.jpg' },
    { name: 'Cold', img: '/hero/hero8/img7.jpg' },
    { name: 'Bright', img: '/hero/hero8/img8.jpg' },
    { name: 'Dark', img: '/hero/hero8/img9.jpg' },
    { name: 'Soft', img: '/hero/hero8/img10.jpg' },
];

const config = {
    minHeight: 1.5,
    maxHeight: 3.2,
    aspectRatio: 1.8,
    gap: 0.03,
    smoothing: 0.08,
    distortionStrength: 2.5,
    distortionSmoothing: 0.1,
    momentumFriction: 0.95,
    momentumThreshold: 0.001,
    wheelSpeed: 0.01,
    wheelMax: 150,
    dragSpeed: 0.01,
    dragMomentum: 0.01,
    touchSpeed: 0.01,
    touchMomentum: 0.1,
};

const wrap = (value: number, range: number) => ((value % range) + range) % range;
const zeroPad = (n: number) => String(n).padStart(2, '0');

export default function Hero10() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        const canvas = canvasRef.current;
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x141414);

        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );

        camera.position.z = 5;

        const totalSlides = slides.length;

        const slideHeights = Array.from(
            { length: totalSlides },
            () => config.minHeight + Math.random() * (config.maxHeight - config.minHeight)
        );

        const slideOffsets: number[] = [];
        let stackPosition = 0;
        for (let i = 0; i < totalSlides; i++) {
            if (i === 0) {
                slideOffsets.push(0);
                stackPosition = slideHeights[0] / 2;
            } else {
                stackPosition += config.gap + slideHeights[i] / 2;
                slideOffsets.push(stackPosition);
                stackPosition += slideHeights[i] / 2;
            }
        }

        const loopLength = stackPosition + config.gap + slideHeights[0] / 2;
        const halfLoop = loopLength / 2;

        const meshes: THREE.Mesh[] = [];

        const textureLoader = new THREE.TextureLoader();
        for (let i = 0; i < totalSlides; i++) {
            const height = slideHeights[i];
            const width = height * config.aspectRatio;

            const geometry = new THREE.PlaneGeometry(width, height, 32, 16);
            const material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0x999999,
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.userData = {
                originalVertices: { ...geometry.attributes.position.array },
                offset: slideOffsets[i],
                name: slides[i].name,
                index: i,
            };

            textureLoader.load(slides[i].img, (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                material.map = texture;
                material.color.set(0xffffff);
                material.needsUpdate = true;

                const imageAspect = texture.image.width / texture.image.height;
                const planeAspect = width / height;
                const ratio = imageAspect / planeAspect;

                if (ratio > 1) {
                    mesh.scale.y = 1 / ratio;
                } else {
                    mesh.scale.x = ratio;
                }
            });
            scene.add(mesh);
            meshes.push(mesh);
        }

        function applyDistortion(mesh: THREE.Mesh, positionY: number, strength: number) {
            const geometry = mesh.geometry as THREE.BufferGeometry;
            const positions = geometry.attributes.position;
            const original = mesh.userData.originalVertices;

            for (let i = 0; i < positions.count; i++) {
                const x = original[i * 3];
                const y = original[i * 3 + 1];

                const distance = Math.sqrt(x * x + Math.pow(positionY + y, 2));

                const falloff = Math.max(0, 1 - distance / 2);

                const bend = Math.pow(Math.sin((falloff * Math.PI) / 2), 1.5);
                positions.setZ(i, bend * strength);
            }
            positions.needsUpdate = true;
            geometry.computeVertexNormals();
        }

        let scrollPosition = 0;
        let scrollTarget = 0;
        let scrollMomentum = 0;
        let isScrolling = false;
        let lastFrameTime = 0;

        let distortionAmount = 0;
        let distortionTarget = 0;
        let velocityPeak = 0;
        let scrollDirection = 0;
        let directionTarget = 0;
        const velocityHistory = [0, 0, 0, 0, 0];

        let isDragging = false;
        let dragStartY = 0;
        let dragDelta = 0;
        let touchStartY = 0;
        let touchLastY = 0;

        let activeSlideIndex = -1;
        let scrollTimeout: NodeJS.Timeout;
        let animationFrameId: number;
        let isUnmounted = false;

        const addDistortionBurst = (amount: number) => {
            distortionTarget = Math.min(1, distortionTarget + amount);
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            const clampedDelta = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), config.wheelMax);

            addDistortionBurst(Math.abs(clampedDelta) * 0.001);
            scrollTarget += clampedDelta * config.wheelSpeed;
            isScrolling = true;

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => (isScrolling = false), 150);
        };

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = touchLastY = e.touches[0].clientY;
            isScrolling = false;
            scrollMomentum = 0;
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            const deltaY = e.touches[0].clientY - touchLastY;
            touchLastY = e.touches[0].clientY;

            addDistortionBurst(Math.abs(deltaY) * 0.02);
            scrollTarget -= deltaY * config.touchSpeed;
            isScrolling = true;
        };

        const handleTouchEnd = () => {
            const swipeVelocity = (touchLastY - touchStartY) * 0.005;

            if (Math.abs(swipeVelocity) > 0.5) {
                scrollMomentum = -swipeVelocity * config.touchMomentum;
                addDistortionBurst(Math.abs(swipeVelocity) * 0.45);
                isScrolling = true;
                setTimeout(() => (isScrolling = false), 800);
            }
        };

        const handleMouseDown = (e: MouseEvent) => {
            isDragging = true;
            dragStartY = e.clientY;
            dragDelta = 0;
            scrollMomentum = 0;
            canvas.style.cursor = 'grabbing';
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const deltaY = e.clientY - dragStartY;
            dragStartY = e.clientY;
            dragDelta = deltaY;

            addDistortionBurst(Math.abs(deltaY) * 0.02);
            scrollTarget -= deltaY * config.dragSpeed;
            isScrolling = true;
        };

        const handleMouseUp = () => {
            if (!isDragging) return;
            isDragging = false;
            canvas.style.cursor = 'grab';

            if (Math.abs(dragDelta) > 2) {
                scrollMomentum = -dragDelta * config.dragMomentum;
                addDistortionBurst(Math.abs(dragDelta) * 0.005);
                isScrolling = true;
                setTimeout(() => (isScrolling = false), 800);
            }
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener("resize", handleResize);

        canvas.style.cursor = 'grab';

        function animate(time: number) {
            if (isUnmounted) return;
            animationFrameId = requestAnimationFrame(animate);

            let deltaTime = lastFrameTime ? (time - lastFrameTime) / 1000 : 0.016;
            if (deltaTime > 0.1) deltaTime = 0.016;
            lastFrameTime = time;

            const previousScroll = scrollPosition;
            if (isScrolling) {
                scrollTarget += scrollMomentum;
                scrollMomentum *= config.momentumFriction;
                if (Math.abs(scrollMomentum) < config.momentumThreshold) {
                    scrollMomentum = 0;
                }
            }
            scrollPosition += (scrollTarget - scrollPosition) * config.smoothing;

            const frameDelta = scrollPosition - previousScroll;
            if (Math.abs(frameDelta) > 0.00001) {
                directionTarget = frameDelta > 0 ? 1 : -1;
            }
            scrollDirection += (directionTarget - scrollDirection) * 0.08;

            const velocity = Math.abs(frameDelta) / Math.max(0.001, deltaTime);

            velocityHistory.push(velocity);
            velocityHistory.shift();
            const averageVelocity =
                velocityHistory.reduce((a, b) => a + b) / velocityHistory.length;
            if (averageVelocity > velocityPeak) {
                velocityPeak = averageVelocity;
            }

            const isDecelerating =
                averageVelocity / (velocityPeak + 0.001) < 0.7 && velocityPeak > 0.5;
            velocityPeak *= 0.99;

            if (velocity > 0.05) {
                distortionTarget = Math.max(distortionTarget, Math.min(1, velocity * 0.1));
            }
            if (isDecelerating || averageVelocity < 0.2) {
                distortionTarget *= isDecelerating ? 0.95 : 0.855;
            }

            distortionAmount += (distortionTarget - distortionAmount) * config.distortionSmoothing;

            const signedDistortion = distortionAmount * scrollDirection;

            let closestDistance = Infinity;
            let closestIndex = -1;

            meshes.forEach((mesh) => {
                const { offset } = mesh.userData;

                let y = -(offset + wrap(scrollPosition, loopLength));
                y = wrap(y + halfLoop, loopLength) - halfLoop;

                mesh.position.y = y;

                if (Math.abs(y) < closestDistance) {
                    closestDistance = Math.abs(y);
                    closestIndex = mesh.userData.index;
                }
                if (Math.abs(y) < halfLoop + config.maxHeight) {
                    applyDistortion(mesh, y, config.distortionStrength * signedDistortion);
                }
            });

            if (closestIndex !== activeSlideIndex && closestIndex !== -1) {
                activeSlideIndex = closestIndex;
                setActiveSlide(activeSlideIndex);
            }

            renderer.render(scene, camera);
        }

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            isUnmounted = true;
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener("resize", handleResize);

            clearTimeout(scrollTimeout);
            cancelAnimationFrame(animationFrameId);

            renderer.dispose();
            meshes.forEach((mesh) => {
                mesh.geometry.dispose();
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach(m => m.dispose());
                } else {
                    mesh.material.dispose();
                }

                if ((mesh.material as THREE.MeshBasicMaterial).map) {
                    (mesh.material as THREE.MeshBasicMaterial).map?.dispose();
                }
            });
            scene.clear();
        };

    }, []);

    return (
        <section ref={containerRef} className="relative w-full h-[100svh] overflow-hidden select-none bg-[#141414]">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full p-2 lg:p-4 flex justify-between text-white z-10 pointer-events-none font-medium text-lg lg:text-xl mix-blend-difference" style={{ fontFamily: "'PP Neue Montreal', sans-serif" }}>
                <p id="slide-title" className="uppercase tracking-widest">{slides[activeSlide]?.name}</p>
                <p id="slide-count" className="font-mono">{zeroPad(activeSlide + 1)}</p>
            </div>
            <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full overflow-hidden outline-none border-none pointer-events-auto" />
            <style dangerouslySetInnerHTML={{ __html: "@import url('https://fonts.cdnfonts.com/css/pp-neue-montreal');" }} />
        </section>
    );
}