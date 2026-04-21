'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Inter, DM_Mono } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '600'],
    variable: '--font-inter',
});

const dmMono = DM_Mono({
    subsets: ['latin'],
    weight: ['400', '500'],
    variable: '--font-dm-mono',
});

//Shaders

const v = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position, 1.); }`;
const p = `precision highp float;`;
const s = `precision mediump sampler2D;`;

const shaders = {
    splat: [
        v,
        `${p} ${s}
    uniform sampler2D uTarget; uniform float aspectRatio, radius; uniform vec3 color; uniform vec2 point; varying vec2 vUv;
    void main(){ vec2 p=vUv-point; p.x*=aspectRatio; gl_FragColor=vec4
    (texture2D(uTarget,vUv).xyz+exp(-dot(p,p)/radius)*color,1.); }`,
    ],
    advection: [
        v,
        `${p} ${s}
  uniform sampler2D uVelocity, uSource; uniform vec2 texelSize; uniform float dt, dissipation; varying vec2 vUv;
  void main(){ gl_FragColor=vec4(dissipation*texture2D(uSource,
  vUv-dt*texture2D(uVelocity,vUv).xy*texelSize).rgb,1.); }`,
    ],

    divergence: [
        v,
        `${p} ${s}
  uniform sampler2D uVelocity; uniform vec2 texelSize; varying vec2 vUv;
  vec2 vel(vec2 uv){ vec2 e=vec2(1.); if(uv.x<0.){uv.x=0.;e.x=-1.;} if(uv.x>1.){uv.x=1.;e.x=-1.;}
  if(uv.y<0.){uv.y=0.;e.y=-1.;} if(uv.y>1.){uv.y=1.;e.y=-1.;} return e*texture2D(uVelocity,uv).xy; }
  void main(){ vec2 L=vUv-vec2(texelSize.x,0.),R=vUv+vec2(texelSize.x,0.),
  T=vUv+vec2(0.,texelSize.y),B=vUv-vec2(0.,texelSize.y); gl_FragColor=vec4
  (.5*(vel(R).x-vel(L).x+vel(T).y-vel(B).y),0.,0.,1.); }`,
    ],
    curl: [
        v,
        `${p} ${s}
  uniform sampler2D uVelocity; uniform vec2 texelSize; varying vec2 vUv;
  void main(){
    vec2 L=vUv-vec2(texelSize.x,0.),R=vUv+vec2(texelSize.x,0.),
    T=vUv+vec2(0.,texelSize.y),B=vUv-vec2(0.,texelSize.y);
    gl_FragColor=vec4(
      texture2D(uVelocity,R).y-texture2D(uVelocity,L).y-
      texture2D(uVelocity,T).x+texture2D(uVelocity,B).x,
      0.,0.,1.
    );
  }`,
    ],

    vorticity: [
        v,
        `${p} ${s}
  uniform sampler2D uVelocity,uCurl; uniform vec2 texelSize; uniform float curlStrength,dt; varying vec2 vUv;
  void main(){
    vec2 L=vUv-vec2(texelSize.x,0.),R=vUv+vec2(texelSize.x,0.),
    T=vUv+vec2(0.,texelSize.y),B=vUv-vec2(0.,texelSize.y);
    vec2 f=normalize(
      vec2(
        abs(texture2D(uCurl,T).x)-abs(texture2D(uCurl,B).x),
        abs(texture2D(uCurl,R).x)-abs(texture2D(uCurl,L).x)
      )+.0001
    )*curlStrength*texture2D(uCurl,vUv).x;
    gl_FragColor=vec4(texture2D(uVelocity,vUv).xy+f*dt,0.,1.);
  }`,
    ],

    pressure: [
        v,
        `${p} ${s}
  uniform sampler2D uPressure,uDivergence; uniform vec2 texelSize; varying vec2 vUv;
  void main(){
    vec2 L=clamp(vUv-vec2(texelSize.x,0.),0.,1.),
         R=clamp(vUv+vec2(texelSize.x,0.),0.,1.),
         T=clamp(vUv+vec2(0.,texelSize.y),0.,1.),
         B=clamp(vUv-vec2(0.,texelSize.y),0.,1.);
    gl_FragColor=vec4(
      (texture2D(uPressure,L).x+
       texture2D(uPressure,R).x+
       texture2D(uPressure,T).x+
       texture2D(uPressure,B).x-
       texture2D(uDivergence,vUv).x)*.25,
      0.,0.,1.
    );
  }`,
    ],

    gradientSubtract: [
        v,
        `${p} ${s}
  uniform sampler2D uPressure,uVelocity; uniform vec2 texelSize; varying vec2 vUv;
  void main(){
    float pL=texture2D(uPressure,clamp(vUv-vec2(texelSize.x,0.),0.,1.)).x,
          pR=texture2D(uPressure,clamp(vUv+vec2(texelSize.x,0.),0.,1.)).x,
          pT=texture2D(uPressure,clamp(vUv+vec2(0.,texelSize.y),0.,1.)).x,
          pB=texture2D(uPressure,clamp(vUv-vec2(0.,texelSize.y),0.,1.)).x;
    gl_FragColor=vec4(
      texture2D(uVelocity,vUv).xy-vec2(pR-pL,pT-pB),
      0.,1.
    );
  }`,
    ],

    clear: [
        v,
        `${p} ${s}
  uniform sampler2D uTexture; uniform float value; varying vec2 vUv;
  void main(){ gl_FragColor=value*texture2D(uTexture,vUv); }`,
    ],

    display: [
        v,
        `${p}
  uniform sampler2D uTexture; uniform float threshold,edgeSoftness;
  uniform vec3 inkColor; varying vec2 vUv;
  void main(){
    float d=clamp(length(texture2D(uTexture,vUv).rgb),0.,1.);
    float a=edgeSoftness>0.
      ? smoothstep(threshold-edgeSoftness*.5,threshold+edgeSoftness*.5,d)
      : step(threshold,d);
    gl_FragColor=vec4(inkColor,a);
  }`,
    ],
};

//FluidSimulation Class
interface FluidConfig {
    simResolution: number;
    dyeResolution: number;
    curl: number;
    pressureIterations: number;
    velocityDissipation: number;
    dyeDissipation: number;
    splatRadius: number;
    forceStrength: number;
    pressureDecay: number;
    threshold: number;
    edgeSoftness: number;
    inkColor: THREE.Color;
}

interface DoubleTarget {
    read: THREE.WebGLRenderTarget;
    write: THREE.WebGLRenderTarget;
    swap: () => void;
}

interface MouseState {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    moved: boolean;
}

class FluidSimulation {
    config: FluidConfig;
    renderer: THREE.WebGLRenderer;
    dpr: number;
    width: number;
    height: number;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    quad: THREE.Mesh;
    simSize: { w: number; h: number };
    dyeSize: { w: number; h: number };
    velocity: DoubleTarget;
    dye: DoubleTarget;
    divergence: THREE.WebGLRenderTarget;
    curl: THREE.WebGLRenderTarget;
    pressure: DoubleTarget;
    material: Record<string, THREE.ShaderMaterial>;
    mouse: MouseState;
    private _animationId: number | null = null;
    private _resizeHandler: (() => void) | null = null;
    private _mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
    private _touchMoveHandler: ((e: TouchEvent) => void) | null = null;

    constructor(canvas: HTMLCanvasElement, config: FluidConfig) {
        this.config = config;
        this.renderer = null!;
        this.dpr = 1;
        this.width = 0;
        this.height = 0;
        this.scene = null!;
        this.camera = null!;
        this.quad = null!;
        this.simSize = { w: 0, h: 0 };
        this.dyeSize = { w: 0, h: 0 };
        this.velocity = null!;
        this.dye = null!;
        this.divergence = null!;
        this.curl = null!;
        this.pressure = null!;
        this.material = {};
        this.mouse = { x: 0, y: 0, velocityX: 0, velocityY: 0, moved: false };

        this._setupRenderer(canvas);
        this._setupScene();
        this._setupTargets();
        this._setupMaterials();
        this._setupInput();
        this._loop();
    }

    _setupRenderer(canvas: HTMLCanvasElement) {
        this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, premultipliedAlpha: false });
        this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        this.renderer.setSize(innerWidth, innerHeight);

        this.dpr = this.renderer.getPixelRatio();
        this.width = innerWidth * this.dpr;
        this.height = innerHeight * this.dpr;

        this._resizeHandler = () => {
            this.renderer.setSize(innerWidth, innerHeight);
            this.width = innerWidth * this.dpr;
            this.height = innerHeight * this.dpr;
        };

        window.addEventListener("resize", this._resizeHandler);
    }

    _setupScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
        this.scene.add(this.quad);
    }

    _setupTargets() {
        const { simResolution: simRes, dyeResolution: dyeRes } = this.config;
        const aspect = this.width / this.height;

        const options = { type: THREE.HalfFloatType, depthBuffer: false };

        const single = (w: number, h: number) => new THREE.WebGLRenderTarget(w, h, options);
        const double = (w: number, h: number): DoubleTarget => ({
            read: single(w, h),
            write: single(w, h),
            swap() {
                [this.read, this.write] = [this.write, this.read];
            },
        });

        this.simSize = { w: simRes, h: Math.round(simRes / aspect) };
        this.dyeSize = { w: dyeRes, h: Math.round(dyeRes / aspect) };

        this.velocity = double(this.simSize.w, this.simSize.h);
        this.dye = double(this.dyeSize.w, this.dyeSize.h);
        this.divergence = single(this.simSize.w, this.simSize.h);
        this.curl = single(this.simSize.w, this.simSize.h);
        this.pressure = double(this.simSize.w, this.simSize.h);
    }

    _setupMaterials() {
        const make = ([vert, frag]: string[], uniforms: Record<string, THREE.IUniform>) =>
            new THREE.ShaderMaterial({
                vertexShader: vert,
                fragmentShader: frag,
                uniforms,
            });

        const tex = (): THREE.IUniform => ({ value: null });
        const num = (v: number = 0): THREE.IUniform => ({ value: v });
        const vec2 = (): THREE.IUniform => ({ value: new THREE.Vector2() });

        this.material = {
            splat: make(shaders.splat, {
                uTarget: tex(),
                aspectRatio: num(),
                radius: num(),
                color: { value: new THREE.Vector3() },
                point: { value: new THREE.Vector2() },
            }),

            advection: make(shaders.advection, {
                uVelocity: tex(),
                uSource: tex(),
                texelSize: vec2(),
                dt: num(),
                dissipation: num(),
            }),

            divergence: make(shaders.divergence, {
                uVelocity: tex(),
                texelSize: vec2(),
            }),

            curl: make(shaders.curl, {
                uVelocity: tex(),
                texelSize: vec2(),
            }),

            vorticity: make(shaders.vorticity, {
                uVelocity: tex(),
                uCurl: tex(),
                texelSize: vec2(),
                curlStrength: num(),
                dt: num(),
            }),

            pressure: make(shaders.pressure, {
                uPressure: tex(),
                uDivergence: tex(),
                texelSize: vec2(),
            }),

            gradientSubtract: make(shaders.gradientSubtract, {
                uPressure: tex(),
                uVelocity: tex(),
                texelSize: vec2(),
            }),

            clear: make(shaders.clear, {
                uTexture: tex(),
                value: num(),
            }),

            display: make(shaders.display, {
                uTexture: tex(),
                threshold: num(),
                edgeSoftness: num(),
                inkColor: { value: new THREE.Color() },
            }),
        };
    }

    _setupInput() {
        this.mouse = { x: 0, y: 0, velocityX: 0, velocityY: 0, moved: false };

        const onMove = (x: number, y: number) => {
            this.mouse.velocityX =
                (x * this.dpr - this.mouse.x) * this.config.forceStrength;
            this.mouse.velocityY =
                (y * this.dpr - this.mouse.y) * this.config.forceStrength;

            this.mouse.x = x * this.dpr;
            this.mouse.y = y * this.dpr;
            this.mouse.moved = true;
        };

        this._mouseMoveHandler = (e: MouseEvent) => onMove(e.clientX, e.clientY);
        window.addEventListener("mousemove", this._mouseMoveHandler);

        this._touchMoveHandler = (e: TouchEvent) => {
            e.preventDefault();
            onMove(e.touches[0].clientX, e.touches[0].clientY);
        };
        window.addEventListener("touchmove", this._touchMoveHandler, { passive: false });
    }

    _pass(material: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget | null) {
        this.quad.material = material;
        this.renderer.setRenderTarget(target ?? null);
        this.renderer.render(this.scene, this.camera);
    }

    _set(material: THREE.ShaderMaterial, values: Record<string, unknown>) {
        Object.entries(values).forEach(
            ([key, val]) => (material.uniforms[key].value = val)
        );
        return material;
    }

    _splat(x: number, y: number, velocityX: number, velocityY: number) {
        const { material: m, velocity: vel, dye, width, height, config: c } = this;

        this._set(m.splat, {
            aspectRatio: width / height,
            point: new THREE.Vector2(x / width, 1 - y / height),
            radius: c.splatRadius / 100,
        });

        this._set(m.splat, {
            uTarget: vel.read.texture,
            color: new THREE.Vector3(velocityX, -velocityY, 0),
        });
        this._pass(m.splat, vel.write);
        vel.swap();

        this._set(m.splat, {
            uTarget: dye.read.texture,
            color: new THREE.Vector3(3, 3, 3),
        });
        this._pass(m.splat, dye.write);
        dye.swap();
    }

    _simulate(dt: number) {
        const {
            material: m,
            velocity: vel,
            dye,
            divergence: div,
            curl,
            pressure: pres,
            simSize,
            dyeSize,
            config: c,
        } = this;

        const simTexel = new THREE.Vector2(1 / simSize.w, 1 / simSize.h);

        this._pass(
            this._set(m.curl, { uVelocity: vel.read.texture, texelSize: simTexel }),
            curl
        );

        this._pass(
            this._set(m.vorticity, {
                uVelocity: vel.read.texture,
                uCurl: curl.texture,
                texelSize: simTexel,
                curlStrength: c.curl,
                dt,
            }),
            vel.write
        );
        vel.swap();

        this._pass(
            this._set(m.divergence, {
                uVelocity: vel.read.texture,
                texelSize: simTexel,
            }),
            div
        );

        this._pass(
            this._set(m.clear, {
                uTexture: pres.read.texture,
                value: c.pressureDecay,
            }),
            pres.write
        );
        pres.swap();

        this._set(m.pressure, {
            uDivergence: div.texture,
            texelSize: simTexel,
        });

        for (let i = 0; i < c.pressureIterations; i++) {
            m.pressure.uniforms.uPressure.value = pres.read.texture;
            this._pass(m.pressure, pres.write);
            pres.swap();
        }

        this._pass(
            this._set(m.gradientSubtract, {
                uPressure: pres.read.texture,
                uVelocity: vel.read.texture,
                texelSize: simTexel,
            }),
            vel.write
        );
        vel.swap();
        this._set(m.advection, {
            uSource: dye.read.texture,
            texelSize: new THREE.Vector2(1 / dyeSize.w, 1 / dyeSize.h),
            dt,
            dissipation: c.dyeDissipation,
        });
        this._pass(m.advection, dye.write);
        dye.swap();
    }

    _render() {
        this._pass(
            this._set(this.material.display, {
                uTexture: this.dye.read.texture,
                threshold: this.config.threshold,
                edgeSoftness: this.config.edgeSoftness,
                inkColor: this.config.inkColor,
            }),
            null
        );
    }

    _loop() {
        let lastTime = Date.now();

        const tick = () => {
            const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
            lastTime = Date.now();

            if (this.mouse.moved) {
                this._splat(
                    this.mouse.x,
                    this.mouse.y,
                    this.mouse.velocityX,
                    this.mouse.velocityY
                );
                this.mouse.moved = false;
            }

            this._simulate(dt);
            this._render();

            this._animationId = requestAnimationFrame(tick);
        };

        tick();
    }

    dispose() {
        if (this._animationId !== null) {
            cancelAnimationFrame(this._animationId);
        }
        if (this._resizeHandler) {
            window.removeEventListener("resize", this._resizeHandler);
        }
        if (this._mouseMoveHandler) {
            window.removeEventListener("mousemove", this._mouseMoveHandler);
        }
        if (this._touchMoveHandler) {
            window.removeEventListener("touchmove", this._touchMoveHandler);
        }

        this.renderer.dispose();
    }
}

//React Component 

const Cursor1: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const simRef = useRef<FluidSimulation | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const config: FluidConfig = {
            simResolution: 256,
            dyeResolution: 1024,
            curl: 25,
            pressureIterations: 50,
            velocityDissipation: 0.95,
            dyeDissipation: 0.95,
            splatRadius: 0.2,
            forceStrength: 7.5,
            pressureDecay: 0.75,
            threshold: 1.0,
            edgeSoftness: 0.0,
            inkColor: new THREE.Color(1, 1, 1),
        };

        simRef.current = new FluidSimulation(canvasRef.current, config);

        return () => {
            simRef.current?.dispose();
            simRef.current = null;
        };
    }, []);

    return (
        <div className={`${inter.variable} ${dmMono.variable} relative w-full h-svh overflow-hidden bg-white`}>
            {/* Navigation */}
            <nav className="fixed top-0 left-0 w-full p-8 flex gap-4 justify-between z-[2]">
                <div>
                    <a
                        href="#"
                        className="inline-block no-underline uppercase font-[var(--font-inter)] font-black text-base tracking-tight text-black"
                    >
                        AOI
                    </a>
                </div>
                <div className="flex gap-16">
                    <a
                        href="/works"
                        className="inline-block no-underline uppercase font-[var(--font-dm-mono)] text-[0.85rem] font-medium text-black"
                    >
                        Works
                    </a>
                    <a
                        href="/about"
                        className="inline-block no-underline uppercase font-['DM_Mono'] text-[0.85rem] font-medium text-black"
                    >
                        About
                    </a>
                    <a
                        href="/contact"
                        className="inline-block no-underline uppercase font-['DM_Mono'] text-[0.85rem] font-medium text-black"
                    >
                        Contact
                    </a>
                    <a
                        href="/updates"
                        className="inline-block no-underline uppercase font-['DM_Mono'] text-[0.85rem] font-medium text-black"
                    >
                        Updates
                    </a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative w-full h-svh p-8 bg-white flex flex-col justify-center overflow-hidden">
                <div className="flex flex-col">
                    <h1 className="uppercase font-[var(--font-inter)] font-black text-[clamp(2rem,8vw,15rem)] leading-[0.9] tracking-tight">
                        Fluid System In
                    </h1>
                    <h1 className="uppercase font-[var(--font-inter)] font-black text-[clamp(2rem,8vw,15rem)] leading-[0.9] tracking-tight self-end">
                        Constant Field
                    </h1>
                    <h1 className="uppercase font-[var(--font-inter)] font-black text-[clamp(2rem,8vw,15rem)] leading-[0.9] tracking-tight self-center">
                        OF Interaction
                    </h1>
                </div>
            </section>

            {/* Fluid Canvas */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 w-full h-full pointer-events-none z-[100] mix-blend-difference"
            />
        </div>
    );
};

export default Cursor1;
