import * as THREE from 'three';
import { gsap } from '@/lib/gsap';

export function initPhilosophyAnimation(
  section: HTMLElement,
  canvas: HTMLCanvasElement
) {
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 768px)").matches || window.matchMedia("(pointer: coarse)").matches;

  // 1. Scene & Camera Setup
  const scene = new THREE.Scene();
  let width = section.offsetWidth || window.innerWidth;
  let height = section.offsetHeight || window.innerHeight;
  const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 10);
  camera.position.set(0, 0, 4);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Master Group
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  if (isMobile) {
    masterGroup.position.set(0, 0, 0);
    masterGroup.scale.set(0.6, 0.6, 0.6);
  } else {
    masterGroup.position.set(1.2, 0, 0); 
  }

  const baseScale = 0.85; // Large but slightly smaller than before
  const eyeGroup = new THREE.Group();
  eyeGroup.scale.set(baseScale, baseScale, baseScale);
  masterGroup.add(eyeGroup);

  const globalOpacity = 0.25; // Increased opacity so the full structure is visible

  // 2. Materials (Flat Shaded for Origami Look)
  const scleraMat = new THREE.MeshStandardMaterial({
    color: 0xFFF4D6, // Bright ivory/white
    roughness: 0.7,
    metalness: 0.1,
    flatShading: true,
    transparent: true,
    opacity: isReducedMotion ? globalOpacity : 0.0,
  });

  const irisMat = new THREE.MeshStandardMaterial({
    color: 0xC9A84C, // Brand gold
    roughness: 0.5,
    metalness: 0.4,
    flatShading: true,
    transparent: true,
    opacity: isReducedMotion ? globalOpacity : 0.0,
  });

  const pupilMat = new THREE.MeshStandardMaterial({
    color: 0x050505,
    roughness: 0.9,
    flatShading: true,
    transparent: true,
    opacity: isReducedMotion ? globalOpacity : 0.0
  });

  const lidMat = new THREE.MeshStandardMaterial({
    color: 0xC9A84C, // Bright brand gold so the eyelids are fully visible!
    roughness: 0.6,
    metalness: 0.3,
    flatShading: true,
    transparent: true,
    opacity: isReducedMotion ? globalOpacity : 0.0,
  });

  const lashMat = new THREE.MeshStandardMaterial({
    color: 0xEAE0C8, // Brighter ivory/gold to stand out like the reference
    roughness: 0.5,
    metalness: 0.4,
    flatShading: false, // Smooth shading is essential for hair-like strands
    transparent: true,
    opacity: isReducedMotion ? globalOpacity : 0.0,
  });

  // 3. Geometries
  // Eyeball
  const scleraGeo = new THREE.IcosahedronGeometry(1.3, 2); // Detail level 2 for facets
  const sclera = new THREE.Mesh(scleraGeo, scleraMat);
  eyeGroup.add(sclera);

  // Iris
  const irisGroup = new THREE.Group();
  eyeGroup.add(irisGroup);

  // Instead of a smooth circle, use a low poly circle (e.g. 12 segments)
  const irisGeo = new THREE.CircleGeometry(0.34 * 1.3, 12);
  const iris = new THREE.Mesh(irisGeo, irisMat);
  iris.position.z = 1.25; 
  irisGroup.add(iris);

  // Pupil
  const pupilGeo = new THREE.CircleGeometry(0.11 * 1.3, 8); // Octagonal pupil
  const pupil = new THREE.Mesh(pupilGeo, pupilMat);
  pupil.position.z = 1.26;
  irisGroup.add(pupil);

  // Eyelids (Low poly sliced spheres)
  const upperLidGroup = new THREE.Group();
  const lidGeo = new THREE.SphereGeometry(1.03 * 1.3, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const upperLidMesh = new THREE.Mesh(lidGeo, lidMat);
  
  // Helper to generate dense, clumped, curved eyelashes matching the reference
  const createEyelashes = (isUpper: boolean, count: number, lidMesh: THREE.Mesh, edgeTheta: number) => {
    const length = isUpper ? 0.65 : 0.45;
    // Tapered cylinder: tip radius 0.002, base radius 0.012
    const geo = new THREE.CylinderGeometry(0.002, 0.012, length, 6, 8);
    const posAttr = geo.attributes.position;
    // Bend the cylinder into a smooth curve
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);
      const t = (y + length / 2) / length; // 0 at base, 1 at tip
      const bend = -t * t * (length * 0.4); // Quadratic curve backwards
      posAttr.setZ(i, z + bend);
    }
    geo.computeVertexNormals();
    geo.translate(0, length / 2, 0); // Base to origin
    geo.rotateX(Math.PI / 2); // Curve sweeps UP and OUT

    const lidR = 1.03 * 1.3;
    const sinTheta = Math.sin(edgeTheta);
    const cosTheta = Math.cos(edgeTheta);

    for (let i = 0; i < count; i++) {
      const lash = new THREE.Mesh(geo, lashMat);
      
      // Spread across ~130 degrees of the eyelid
      const basePhi = -Math.PI * 0.36 + (Math.PI * 0.72) * (i / (count - 1));
      // Add clustering/clumping noise
      const noise = (Math.random() - 0.5) * 0.08;
      const phi = basePhi + noise;
      
      const x = lidR * sinTheta * Math.sin(phi);
      const z = lidR * sinTheta * Math.cos(phi);
      const y = lidR * cosTheta;
      
      lash.position.set(x, y, z);
      lash.lookAt(x * 2, y * 2, z * 2);
      
      // Randomize length to simulate natural growth
      const scaleZ = 0.6 + Math.random() * 0.5;
      lash.scale.set(1, 1, scaleZ);
      
      // Tilt outwards slightly
      const randomTilt = (Math.random() - 0.5) * 0.2;
      lash.rotateX(isUpper ? -0.1 + randomTilt : 0.1 + randomTilt);
      
      // Fan them outwards, adding randomness so they criss-cross and clump
      const sweep = (phi / (Math.PI * 0.36)) * 1.3; 
      const randomSweep = (Math.random() - 0.5) * 0.4;
      
      if (isUpper) {
        lash.rotateZ(-sweep + randomSweep);
      } else {
        // Lower lashes need to curve DOWN, so we rotate 180 degrees around Z
        lash.rotateZ(Math.PI - sweep + randomSweep);
      }
      
      lidMesh.add(lash);
    }
  };

  // Generate 75 upper lashes and 60 lower lashes
  createEyelashes(true, 75, upperLidMesh, Math.PI * 0.55);

  upperLidGroup.add(upperLidMesh);
  eyeGroup.add(upperLidGroup);

  const lowerLidGroup = new THREE.Group();
  const lowerLidGeo = new THREE.SphereGeometry(1.03 * 1.3, 16, 12, 0, Math.PI * 2, Math.PI * 0.8, Math.PI * 0.2);
  const lowerLidMesh = new THREE.Mesh(lowerLidGeo, lidMat);
  
  createEyelashes(false, 60, lowerLidMesh, Math.PI * 0.8);
  
  lowerLidGroup.add(lowerLidMesh);
  eyeGroup.add(lowerLidGroup);

  // 4. Lighting Rig
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xFFF4D6, 2.5);
  keyLight.position.set(1.5, 2, 2.5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xC9A84C, 1.0);
  fillLight.position.set(-1.5, -0.5, 1.5);
  scene.add(fillLight);

  // 5. Animation Logic
  let isIdle = isReducedMotion;
  let hasAwakened = false;
  let isPaused = false;
  
  const closedAngleUpper = 0;
  const openAngleUpper = -0.7; 
  const closedAngleLower = -0.78;
  const openAngleLower = 0;

  upperLidGroup.rotation.x = isReducedMotion ? openAngleUpper : closedAngleUpper;
  lowerLidGroup.rotation.x = isReducedMotion ? openAngleLower : closedAngleLower;

  const triggerBlink = () => {
    if (!isIdle || isPaused) return;

    const tl = gsap.timeline();
    // Fast close
    tl.to(upperLidGroup.rotation, { x: closedAngleUpper, duration: 0.1, ease: "power2.in" }, 0);
    tl.to(lowerLidGroup.rotation, { x: closedAngleLower, duration: 0.1, ease: "power2.in" }, 0);
    tl.to(eyeGroup.rotation, { x: -0.04, duration: 0.15, ease: "power2.inOut" }, 0);
    
    tl.to({}, { duration: 0.05 });
    
    // Smooth open
    tl.to(upperLidGroup.rotation, { x: openAngleUpper, duration: 0.2, ease: "power3.out" }, 0.15);
    tl.to(lowerLidGroup.rotation, { x: openAngleLower, duration: 0.2, ease: "power3.out" }, 0.15);
    tl.to(eyeGroup.rotation, { x: 0, duration: 0.2, ease: "power2.out" }, 0.15);
  };

  const startAwakening = () => {
    if (isReducedMotion || hasAwakened) return;
    hasAwakened = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isIdle = true;
        lastBlink = performance.now();
        
        gsap.to(eyeGroup.scale, {
          x: baseScale * 1.03, y: baseScale * 1.03, z: baseScale * 1.03,
          duration: 4.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });
      }
    });

    tl.to([scleraMat, lidMat, lashMat], { opacity: globalOpacity, duration: 0.6 }, 0);
    tl.to(upperLidGroup.rotation, { x: openAngleUpper, duration: 0.9, ease: "power3.out" }, 0.6);
    tl.to(lowerLidGroup.rotation, { x: openAngleLower, duration: 0.8, ease: "power3.out" }, 0.6);

    tl.to(irisMat, { opacity: globalOpacity, duration: 0.5 }, 1.1);
    tl.to(pupilMat, { opacity: globalOpacity * 0.96, duration: 0.5 }, 1.1);

    tl.to(irisGroup.position, { x: 0.05, duration: 0.3, ease: "power2.inOut" }, 1.6);
    tl.to(irisGroup.position, { x: 0, duration: 0.3, ease: "power2.inOut" }, 1.9);
  };

  let normMouseX = 0;
  let normMouseY = 0;
  const handleMouseMove = (e: MouseEvent) => {
    if (!isIdle || isMobile || isPaused) return;
    const rect = canvas.getBoundingClientRect();
    normMouseX = (e.clientX - rect.left) / rect.width * 2 - 1;
    normMouseY = -(e.clientY - rect.top) / rect.height * 2 + 1;
    
    gsap.to(irisGroup.rotation, {
      x: normMouseY * 0.08,
      y: normMouseX * 0.12,
      duration: 1.2,
      ease: "power2.out",
      overwrite: true
    });
  };

  if (!isMobile) {
    window.addEventListener('mousemove', handleMouseMove);
  }

  const checkTrigger = () => {
    if (canvas.dataset.triggerAwake === "true" && !hasAwakened) {
      startAwakening();
    }
  };
  checkTrigger();
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      isPaused = !entry.isIntersecting;
      if (entry.isIntersecting && canvas.dataset.triggerAwake === "true" && !hasAwakened) {
        startAwakening();
      }
    });
  }, { threshold: 0.0 });
  observer.observe(section);

  const attrObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'data-trigger-awake') {
        checkTrigger();
      }
    });
  });
  attrObserver.observe(canvas, { attributes: true });

  const handleResize = () => {
    width = section.offsetWidth;
    height = section.offsetHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', handleResize);

  let rafId: number;
  let lastBlink = performance.now();
  const BLINK_INTERVAL = 5000;

  const render = (now: number) => {
    if (!isPaused) {
      if (isIdle && (now - lastBlink >= BLINK_INTERVAL)) {
        triggerBlink();
        lastBlink = now;
      }
      renderer.render(scene, camera);
    }
    rafId = requestAnimationFrame(render);
  };
  rafId = requestAnimationFrame(render);

  return () => {
    observer.disconnect();
    attrObserver.disconnect();
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('mousemove', handleMouseMove);
    cancelAnimationFrame(rafId);
    renderer.dispose();
  };
}
