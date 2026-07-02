"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

function createSafeRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer | null {
  const originalConsoleError = console.error;
  console.error = () => {};
  let renderer: THREE.WebGLRenderer | null = null;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch {
    // Ignore error
  } finally {
    console.error = originalConsoleError;
  }
  return renderer;
}

export default function ThreeExperiencesDemo() {
  const monolithCanvasRef = useRef<HTMLCanvasElement>(null);
  const particlesCanvasRef = useRef<HTMLCanvasElement>(null);
  const shaderCanvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  // 1. The Monolith (Interactive Geometry)
  useEffect(() => {
    const canvas = monolithCanvasRef.current;
    if (!canvas) return;
    const renderer = createSafeRenderer(canvas);
    if (!renderer) {
      setWebglSupported(false);
      return;
    }

    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 5;

    // Icosahedron with wireframe
    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xC9A84C, 
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x111111,
      transparent: true,
      opacity: 0.9
    });

    const mesh = new THREE.Mesh(geometry, material);
    const innerMesh = new THREE.Mesh(geometry, innerMaterial);
    innerMesh.scale.set(0.98, 0.98, 0.98); // slightly smaller

    scene.add(mesh);
    scene.add(innerMesh);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mouseX = (x / rect.width) * 2 - 1;
      mouseY = -(y / rect.height) * 2 + 1;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      
      targetX = mouseX * 0.5;
      targetY = mouseY * 0.5;
      
      mesh.rotation.y += 0.005;
      mesh.rotation.x += 0.002;
      
      innerMesh.rotation.copy(mesh.rotation);

      // Add slight parallax based on mouse
      mesh.rotation.y += 0.05 * (targetX - mesh.rotation.y);
      mesh.rotation.x += 0.05 * (targetY - mesh.rotation.x);

      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      innerMaterial.dispose();
    };
  }, []);

  // 2. Morphing Particle Cloud
  useEffect(() => {
    if (!particlesCanvasRef.current) return;
    const renderer = createSafeRenderer(particlesCanvasRef.current);
    if (!renderer) {
      setWebglSupported(false);
      return;
    }

    renderer.setSize(particlesCanvasRef.current.clientWidth, particlesCanvasRef.current.clientHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, particlesCanvasRef.current.clientWidth / particlesCanvasRef.current.clientHeight, 0.1, 100);
    camera.position.z = 6;

    const particleCount = 3000;
    const geometry = new THREE.BufferGeometry();
    
    // Create two sets of positions: Sphere and Cube
    const spherePositions = new Float32Array(particleCount * 3);
    const cubePositions = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount; i++) {
      // Sphere points (using fibonacci sphere or random)
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 2;
      
      spherePositions[i*3] = r * Math.sin(phi) * Math.cos(theta);
      spherePositions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      spherePositions[i*3+2] = r * Math.cos(phi);

      // Cube points
      const x = (Math.random() - 0.5) * 3;
      const y = (Math.random() - 0.5) * 3;
      const z = (Math.random() - 0.5) * 3;
      
      // Push points to surface of cube roughly
      let cx = x, cy = y, cz = z;
      const max = Math.max(Math.abs(x), Math.abs(y), Math.abs(z));
      if (max === Math.abs(x)) cx = Math.sign(x) * 1.5;
      else if (max === Math.abs(y)) cy = Math.sign(y) * 1.5;
      else cz = Math.sign(z) * 1.5;

      cubePositions[i*3] = cx;
      cubePositions[i*3+1] = cy;
      cubePositions[i*3+2] = cz;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(spherePositions), 3));
    
    // We will use GSAP to animate a "morph" value
    const material = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const morphObj = { progress: 0 };
    
    // Morph loop
    gsap.to(morphObj, {
      progress: 1,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "power2.inOut",
      onUpdate: () => {
        const positions = geometry.attributes.position.array as Float32Array;
        for(let i = 0; i < particleCount; i++) {
          const sx = spherePositions[i*3];
          const sy = spherePositions[i*3+1];
          const sz = spherePositions[i*3+2];
          
          const cx = cubePositions[i*3];
          const cy = cubePositions[i*3+1];
          const cz = cubePositions[i*3+2];
          
          positions[i*3] = sx + (cx - sx) * morphObj.progress;
          positions[i*3+1] = sy + (cy - sy) * morphObj.progress;
          positions[i*3+2] = sz + (cz - sz) * morphObj.progress;
        }
        geometry.attributes.position.needsUpdate = true;
      }
    });

    let animationFrameId: number;
    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      points.rotation.y += 0.002;
      points.rotation.x += 0.001;
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      gsap.killTweensOf(morphObj);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // 3. Liquid Shader Material
  useEffect(() => {
    if (!shaderCanvasRef.current) return;
    const renderer = createSafeRenderer(shaderCanvasRef.current);
    if (!renderer) {
      setWebglSupported(false);
      return;
    }

    renderer.setSize(shaderCanvasRef.current.clientWidth, shaderCanvasRef.current.clientHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, shaderCanvasRef.current.clientWidth / shaderCanvasRef.current.clientHeight, 0.1, 100);
    camera.position.z = 4;

    // Create a dense sphere geometry
    const geometry = new THREE.SphereGeometry(1.2, 128, 128);

    // Vertex Shader: displace vertices using sine waves based on time
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      uniform float uTime;
      
      void main() {
        vUv = uv;
        vNormal = normal;
        
        vec3 pos = position;
        
        // Complex noise/wave distortion
        float noiseFreq = 2.0;
        float noiseAmp = 0.15;
        vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y * noiseFreq + uTime, pos.z * noiseFreq);
        
        // Simple procedural displacement
        float displacement = sin(noisePos.x) * sin(noisePos.y) * sin(noisePos.z) * noiseAmp;
        
        pos += normal * displacement;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    // Fragment Shader: Iridescent / Fresnel effect
    const fragmentShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      uniform float uTime;
      
      void main() {
        // Base color (dark)
        vec3 color = vec3(0.05, 0.05, 0.08);
        
        // Calculate camera facing vector
        vec3 viewDir = normalize(cameraPosition);
        
        // Fresnel rim lighting
        float fresnel = dot(viewDir, vNormal);
        fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
        fresnel = pow(fresnel, 3.0);
        
        // Iridescent coloring based on normal and time
        vec3 iridescence = vec3(
          0.5 + 0.5 * sin(vNormal.x * 5.0 + uTime),
          0.5 + 0.5 * sin(vNormal.y * 5.0 + uTime * 1.2),
          0.8 + 0.2 * sin(vNormal.z * 5.0 + uTime * 0.8)
        );
        
        color += iridescence * fresnel * 1.5;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const uniforms = {
      uTime: { value: 0 }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      wireframe: false,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrameId: number;
    const clock = new THREE.Clock();
    
    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      uniforms.uTime.value = clock.getElapsedTime();
      
      mesh.rotation.y += 0.005;
      mesh.rotation.x += 0.002;
      
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div className="py-20 mb-20 border-t border-b border-cmf-border">
      <div className="mb-20 text-center max-w-2xl mx-auto px-4">
        <span className="label-mono text-[10px] text-cmf-gold tracking-[0.3em] block mb-4">
          WEBGL LABORATORY
        </span>
        <h2 className="heading-display text-4xl md:text-5xl mb-6">
          Spatial Realities
        </h2>
        <p className="font-sans font-light text-cmf-text-muted text-lg">
          We break the constraints of the 2D web. By leveraging Three.js and custom GLSL shaders directly in the browser, we create immersive, high-performance 3D environments that run instantly without plugins.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-32">
        
        {/* Demo 1: Interactive Geometry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="h-[400px] w-full bg-[#030303] border border-cmf-border rounded-xl relative overflow-hidden group shadow-2xl flex items-center justify-center">
            {!webglSupported && (
              <div className="absolute inset-0 flex items-center justify-center z-20" style={{ perspective: '1000px' }}>
                <style>{`
                  @keyframes spin3d {
                    0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
                    100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(180deg); }
                  }
                `}</style>
                <div className="relative w-32 h-32" style={{ transformStyle: 'preserve-3d', animation: 'spin3d 12s linear infinite' }}>
                  <div className="absolute inset-0 border border-cmf-gold/50 bg-cmf-gold/10 flex items-center justify-center" style={{ transform: 'translateZ(64px)' }}>
                    <span className="font-mono text-cmf-gold text-xs uppercase text-center leading-tight">CSS 3D<br/>Fallback</span>
                  </div>
                  <div className="absolute inset-0 border border-cmf-gold/50 bg-cmf-gold/10" style={{ transform: 'rotateY(180deg) translateZ(64px)' }}></div>
                  <div className="absolute inset-0 border border-cmf-gold/50 bg-cmf-gold/10" style={{ transform: 'rotateY(-90deg) translateZ(64px)' }}></div>
                  <div className="absolute inset-0 border border-cmf-gold/50 bg-cmf-gold/10 flex items-center justify-center" style={{ transform: 'rotateY(90deg) translateZ(64px)' }}>
                     <span className="font-mono text-cmf-gold text-[8px] uppercase tracking-widest opacity-50">No WebGL</span>
                  </div>
                  <div className="absolute inset-0 border border-cmf-gold/50 bg-cmf-gold/10" style={{ transform: 'rotateX(90deg) translateZ(64px)' }}></div>
                  <div className="absolute inset-0 border border-cmf-gold/50 bg-cmf-gold/10" style={{ transform: 'rotateX(-90deg) translateZ(64px)' }}></div>
                </div>
              </div>
            )}
            <canvas ref={monolithCanvasRef} className="absolute inset-0 w-full h-full cursor-crosshair outline-none"></canvas>
            <div className="absolute top-4 left-4 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity z-30">
              <span className="font-mono text-xs text-cmf-gold tracking-widest block">SYSTEM.01</span>
              <span className="font-mono text-[10px] text-white uppercase mt-1 block">Polyhedron Matrix</span>
            </div>
            <div className="absolute bottom-4 right-4 pointer-events-none opacity-50 z-30">
              <span className="font-mono text-[10px] text-white uppercase">[ Interactive ]</span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl text-cmf-text font-display mb-4">The Monolith</h3>
            <p className="font-sans font-light text-cmf-text-muted text-lg mb-8 leading-relaxed">
              Real-time geometry manipulation. We construct complex mathematical shapes using buffer geometries and mesh materials. By tracking the client&apos;s cursor, we inject dynamic physics and parallax directly into the render loop.
            </p>
            <ul className="space-y-2 font-mono text-xs text-cmf-text-muted">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-cmf-gold rounded-full"></span> 60 FPS Render Loop</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-cmf-gold rounded-full"></span> Pointer-based Parallax</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-cmf-gold rounded-full"></span> Transparent Dual-Mesh</li>
            </ul>
          </div>
        </div>

        {/* Demo 2: Morphing Particles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl text-cmf-text font-display mb-4">Volumetric Data</h3>
            <p className="font-sans font-light text-cmf-text-muted text-lg mb-8 leading-relaxed">
              Rendering thousands of individual points simultaneously without dropping a frame. We use highly optimized Float32Arrays and GSAP to linearly interpolate 3,000 vertices between complex geometric states in real-time.
            </p>
            <ul className="space-y-2 font-mono text-xs text-cmf-text-muted">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#22d3ee] rounded-full"></span> 3,000 Buffer Vertices</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#22d3ee] rounded-full"></span> Additive Blending</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#22d3ee] rounded-full"></span> Shape Interpolation</li>
            </ul>
          </div>
          <div className="order-1 md:order-2 h-[400px] w-full bg-[#050505] border border-cmf-border rounded-xl relative overflow-hidden group shadow-2xl flex items-center justify-center">
            {!webglSupported && (
              <div className="absolute inset-0 flex items-center justify-center z-20 overflow-hidden">
                <style>{`
                  @keyframes pulseDot {
                    0%, 100% { transform: scale(1); opacity: 0.2; }
                    50% { transform: scale(2); opacity: 0.8; }
                  }
                  @keyframes rotateCloud {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
                <div className="relative w-full h-full opacity-40" style={{ animation: 'rotateCloud 40s linear infinite' }}>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div 
                      key={i}
                      className="absolute w-2 h-2 bg-[#22d3ee] rounded-full blur-[1px]"
                      style={{
                        left: `${(i * 17) % 90 + 5}%`,
                        top: `${(i * 23) % 90 + 5}%`,
                        animation: `pulseDot ${(i % 3) + 2}s ease-in-out infinite`,
                        animationDelay: `${(i % 5) * 0.5}s`
                      }}
                    ></div>
                  ))}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-mono text-[#22d3ee] text-xs uppercase text-center leading-tight bg-black/50 px-3 py-2 rounded backdrop-blur-sm border border-[#22d3ee]/20">CSS Point Cloud<br/>Fallback</span>
                </div>
              </div>
            )}
            <canvas ref={particlesCanvasRef} className="absolute inset-0 w-full h-full outline-none"></canvas>
            <div className="absolute top-4 right-4 pointer-events-none opacity-50 text-right z-30">
              <span className="font-mono text-xs text-[#22d3ee] tracking-widest block">SYSTEM.02</span>
              <span className="font-mono text-[10px] text-white uppercase mt-1 block">Point Cloud Morph</span>
            </div>
            <div className="absolute bottom-4 left-4 pointer-events-none opacity-50 z-30">
              <span className="font-mono text-[10px] text-white uppercase">[ Automated ]</span>
            </div>
          </div>
        </div>

        {/* Demo 3: Shader Material */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="h-[400px] w-full bg-[#020617] border border-cmf-border rounded-xl relative overflow-hidden group shadow-2xl flex items-center justify-center">
            {!webglSupported && (
              <div className="absolute inset-0 flex items-center justify-center z-20 overflow-hidden">
                <style>{`
                  @keyframes liquidFlow1 {
                    0% { transform: rotate(0deg) scale(1) translateX(0px); }
                    50% { transform: rotate(180deg) scale(1.1) translateX(10px); }
                    100% { transform: rotate(360deg) scale(1) translateX(0px); }
                  }
                  @keyframes liquidFlow2 {
                    0% { transform: rotate(360deg) scale(1) translateY(0px); }
                    50% { transform: rotate(180deg) scale(0.9) translateY(10px); }
                    100% { transform: rotate(0deg) scale(1) translateY(0px); }
                  }
                `}</style>
                <div 
                  className="w-64 h-64 bg-gradient-to-r from-[#818cf8] to-[#c084fc] opacity-20 blur-xl absolute rounded-full"
                  style={{ animation: 'liquidFlow1 15s ease-in-out infinite' }}
                ></div>
                <div 
                  className="absolute w-48 h-48 bg-gradient-to-tr from-[#38bdf8] to-[#818cf8] opacity-30 blur-lg rounded-full"
                  style={{ animation: 'liquidFlow2 10s ease-in-out infinite' }}
                ></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-mono text-[#818cf8] text-[10px] uppercase text-center leading-tight bg-black/30 px-3 py-2 rounded-full backdrop-blur-sm border border-[#818cf8]/20">CSS Fallback</span>
                </div>
              </div>
            )}
            <canvas ref={shaderCanvasRef} className="absolute inset-0 w-full h-full outline-none"></canvas>
            <div className="absolute top-4 left-4 pointer-events-none opacity-50 z-30">
              <span className="font-mono text-xs text-[#818cf8] tracking-widest block">SYSTEM.03</span>
              <span className="font-mono text-[10px] text-white uppercase mt-1 block">Liquid GLSL</span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl text-cmf-text font-display mb-4">Algorithmic Materials</h3>
            <p className="font-sans font-light text-cmf-text-muted text-lg mb-8 leading-relaxed">
              Writing code directly for the GPU. We utilize custom Vertex and Fragment shaders written in GLSL to displace vertices using mathematical sine waves, and apply a real-time iridescent Fresnel rim-light effect based on the camera angle.
            </p>
            <ul className="space-y-2 font-mono text-xs text-cmf-text-muted">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#818cf8] rounded-full"></span> GLSL Fragment Shaders</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#818cf8] rounded-full"></span> Procedural Displacement</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#818cf8] rounded-full"></span> Fresnel Lighting Model</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
