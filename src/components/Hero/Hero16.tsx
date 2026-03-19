"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import Lenis from "lenis";

const vertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;

    void main() {
        vUv = uv;
        vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform sampler2D uMap;
    uniform vec3 uCameraPosition;
    varying vec2 vUv;
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;

    void main() {
        vec4 tex = texture2D(uMap, vUv);
        vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
        float facing = max(dot(-normalize(vWorldNormal), viewDir), 0.0);
        float falloff = smoothstep(-0.2, 0.5, facing) * 0.45 + 0.42;
        vec3 color = mix(vec3(1.0), tex.rgb * falloff, 0.975) * 1.25;
        gl_FragColor = vec4(color, tex.a);
    }
`;

const CONFIG = {
    totalImages: 10,
    tilesPerRevolution: 15,
    revolutions: 5,
    startRadius: 5,
    endRadius: 5,
    tileHeightRatio: 1.1,
    tileSegments: 24,
    spiralGap: 0.35,
    tileOverlap: 0.005,
    cameraZ: 12,
    cameraSmoothing: 0.075,
    baseRotationSpeed: 0.001,
    scrollRotationMultiplier: 0.0035,
    rotationDecay: 0.9,
    scrollMultiplier: 1.25,
    cameraYMultiplier: 0.2,
    parallaxStrength: 0.1,
};

const Hero16: React.FC = () => {
    const heroRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!heroRef.current) return;

        const lenis = new Lenis({ autoRaf: true });

        const heroSection = heroRef.current;
        const totalTiles = Math.floor(CONFIG.tilesPerRevolution * CONFIG.revolutions);
        const angleStep = (Math.PI * 2) / CONFIG.tilesPerRevolution;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            75,
            heroSection.clientWidth / heroSection.clientHeight,
            0.1,
            1000,
        );
        camera.position.z = CONFIG.cameraZ;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(heroSection.clientWidth, heroSection.clientHeight);

        // Append to hero, clear previous canvases just in case
        const existingCanvases = heroSection.querySelectorAll('canvas');
        existingCanvases.forEach(c => c.remove());
        heroSection.appendChild(renderer.domElement);

        const textureLoader = new THREE.TextureLoader();
        const textures = Array.from({ length: CONFIG.totalImages }, (_, i) =>
            textureLoader.load(`/hero/hero8/img${i + 1}.jpg`, (t) => {
                t.minFilter = THREE.LinearMipmapLinearFilter;
                t.anisotropy = renderer.capabilities.getMaxAnisotropy();
            })
        );

        const CameraPositionUniform = {
            value: new THREE.Vector3(0, 0, CONFIG.cameraZ)
        };

        const tileEdgesY: number[] = [0];

        for (let i = 0; i < totalTiles; i++) {
            const progress = i / totalTiles;
            const radius = CONFIG.startRadius + (CONFIG.endRadius - CONFIG.startRadius) * progress;
            const arcWidth = (2 * Math.PI * radius) / CONFIG.tilesPerRevolution;
            const tileHeight = arcWidth * CONFIG.tileHeightRatio;

            tileEdgesY.push(
                tileEdgesY[i] - (tileHeight + CONFIG.spiralGap) / CONFIG.tilesPerRevolution,
            );
        }

        const spiral = new THREE.Group();
        scene.add(spiral);
        
        const meshes: { geometry: THREE.BufferGeometry, material: THREE.Material }[] = [];

        for (let i = 0; i < totalTiles; i++) {
            const progress = i / totalTiles;
            const radius = CONFIG.startRadius + (CONFIG.endRadius - CONFIG.startRadius) * progress;
            const arcWidth = (2 * Math.PI * radius) / CONFIG.tilesPerRevolution;
            const tileHeight = arcWidth * CONFIG.tileHeightRatio;
            const tileAngle = arcWidth / radius + CONFIG.tileOverlap;
            const centerY = (tileEdgesY[i] + tileEdgesY[i + 1]) / 2;
            const slope = tileEdgesY[i + 1] - tileEdgesY[i];

            const positions: number[] = [];
            const uvCoords: number[] = [];
            const indices: number[] = [];
            const segments = CONFIG.tileSegments;

            for (let row = 0; row <= 1; row++) {
                for (let col = 0; col <= segments; col++) {
                    const angle = (col / segments - 0.5) * tileAngle;
                    positions.push(
                        Math.sin(angle) * radius,
                        (row - 0.5) * tileHeight + (col / segments - 0.5) * slope,
                        Math.cos(angle) * radius,
                    );
                    uvCoords.push(col / segments, row);
                }
            }

            for (let col = 0; col < segments; col++) {
                const current = col;
                const below = current + segments + 1;
                indices.push(current, below, current + 1, below, below + 1, current + 1);
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvCoords, 2));
            geometry.setIndex(indices);
            geometry.computeVertexNormals();

            const material = new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms: {
                    uMap: { value: textures[i % CONFIG.totalImages] },
                    uCameraPosition: CameraPositionUniform,
                },
                side: THREE.DoubleSide
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.y = centerY;
            meshes.push({ geometry, material });

            const tile = new THREE.Group();
            tile.rotation.y = i * angleStep;
            tile.add(mesh);
            spiral.add(tile);
        }

        const spiralHeight = Math.abs(tileEdgesY[totalTiles]);

        let scrollY = 0;
        let spinVelocity = 0;

        const onScroll = (e: any) => {
            scrollY = window.scrollY;
            spinVelocity = e.velocity * CONFIG.scrollRotationMultiplier;
        };

        lenis.on("scroll", onScroll);

        let mouseX = 0, mouseY = 0, smoothX = 0, smoothY = 0;
        const onMouseMove = (e: MouseEvent) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener("mousemove", onMouseMove);

        let isMobile = window.innerWidth < 1000;
        let animationFrameId: number;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            const progress = Math.min(
                scrollY / (window.innerHeight * CONFIG.scrollMultiplier),
                1,
            );

            camera.position.y +=
                (-(progress * spiralHeight * CONFIG.cameraYMultiplier) -
                    camera.position.y) *
                CONFIG.cameraSmoothing;

            if (!isMobile) {
                smoothX += (mouseX - smoothX) * 0.02;
                smoothY += (mouseY - smoothY) * 0.02;

                spiral.rotation.x = smoothY * CONFIG.parallaxStrength;
                spiral.rotation.z = -smoothX * CONFIG.parallaxStrength * 0.3;
            }

            CameraPositionUniform.value.copy(camera.position);

            spiral.rotation.y += CONFIG.baseRotationSpeed + spinVelocity;
            spinVelocity *= CONFIG.rotationDecay;

            renderer.render(scene, camera);
        };

        animate();

        const onResize = () => {
            isMobile = window.innerWidth < 1000;
            camera.aspect = heroSection.clientWidth / heroSection.clientHeight;
            camera.position.z = isMobile ? 15 : CONFIG.cameraZ;
            camera.updateProjectionMatrix();
            renderer.setSize(heroSection.clientWidth, heroSection.clientHeight);
        };
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("mousemove", onMouseMove);
            lenis.off("scroll", onScroll);
            lenis.destroy();
            if (heroSection.contains(renderer.domElement)) {
                heroSection.removeChild(renderer.domElement);
            }
            meshes.forEach(({ geometry, material }) => {
                geometry.dispose();
                material.dispose();
            });
            renderer.dispose();
            textures.forEach(t => t.dispose());
        };
    }, []);

    return (
        <React.Fragment>
            <style jsx global>{`
                @import url('https://fonts.cdnfonts.com/css/pp-neue-montreal');

                .codegrid-root * { margin: 0; padding: 0; box-sizing: border-box; }
                .codegrid-root { font-family: 'PP Neue Montreal', sans-serif; background-color: #171717; }

                .codegrid-root h1, .codegrid-root h3 {
                    text-transform: uppercase;
                    letter-spacing: -0.1rem;
                    line-height: 0.8;
                }

                .codegrid-root h1 { font-size: clamp(3rem, 8vw, 12rem); }
                .codegrid-root h3 { font-size: clamp(2.5rem, 5vw, 7.5rem); }

                .codegrid-section {
                    position: relative;
                    width: 100%;
                    padding: 2rem;
                    color: #d2d2d2;
                    overflow: hidden;
                }

                .codegrid-hero {
                    height: 150svh;
                    background-color: #242424;
                    text-align: justify;
                }

                .codegrid-about {
                    height: 100svh;
                    background-color: #171717;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .codegrid-hero canvas {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                .codegrid-title {
                    position: relative;
                    z-index: 10;
                    pointer-events: none;
                }

                @media(max-width:1000px) {
                    .codegrid-hero {
                        height: 125svh;
                    }
                }
            `}</style>

            <div className="codegrid-root overflow-x-hidden selection:bg-white selection:text-black">
                <section ref={heroRef} className="codegrid-section codegrid-hero">
                    <h1 className="codegrid-title">
                        Somewhere between structures and disorder new forms quitely start to emerge
                    </h1>
                </section>
                <section className="codegrid-section codegrid-about">
                    <h3 className="codegrid-title">New form begins here</h3>
                </section>
            </div>
        </React.Fragment>
    );
};

export default Hero16;
