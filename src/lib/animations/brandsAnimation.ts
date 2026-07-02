import * as THREE from "three";

export function initBrandsAnimation(
  section: HTMLElement,
  canvas: HTMLCanvasElement
) {
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isReducedMotion) return () => {};
  
  const isMobile = window.innerWidth < 768;

  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  
  let instancedMesh: THREE.InstancedMesh;
  let rafId: number;
  let isPaused = false;
  
  // Initialize scene
  scene = new THREE.Scene();
  
  // Camera setup
  const fov = 60;
  camera = new THREE.PerspectiveCamera(fov, section.offsetWidth / section.offsetHeight, 1, 2000);
  camera.position.z = 600;

  // Setup Renderer
  const originalConsoleError = console.error;
  console.error = () => {}; // suppress webgl context warnings
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(section.offsetWidth, section.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
  } catch(e) {
    console.error = originalConsoleError;
    return () => {};
  }
  console.error = originalConsoleError;

  // Add Lights for 3D leaves
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const dirLight1 = new THREE.DirectionalLight(0xffdf73, 2);
  dirLight1.position.set(200, 500, 300);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xc9a84c, 1);
  dirLight2.position.set(-200, -200, 200);
  scene.add(dirLight2);

  // Procedural Leaf Geometry (Almond shape)
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.bezierCurveTo(2, 4, 2, 8, 0, 12);
  leafShape.bezierCurveTo(-2, 8, -2, 4, 0, 0);
  
  const geometry = new THREE.ShapeGeometry(leafShape, 2); // Low poly curve segments
  geometry.center(); // Center the geometry

  // Create Material
  const material = new THREE.MeshStandardMaterial({
    color: 0xC9A84C,
    emissive: 0x2a2005,
    roughness: 0.3,
    metalness: 0.7,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });

  // Create InstancedMesh
  const particleCount = isMobile ? 60 : 150;
  instancedMesh = new THREE.InstancedMesh(geometry, material, particleCount);
  scene.add(instancedMesh);

  // Leaf Data Array
  const leafData: any[] = [];
  const dummy = new THREE.Object3D();

  // Helper to spawn a leaf
  const resetLeaf = (leaf: any, isInitial = false) => {
    leaf.x = (Math.random() - 0.5) * section.offsetWidth * 1.5;
    leaf.y = isInitial 
      ? (Math.random() - 0.5) * section.offsetHeight * 2 // spread across screen initially
      : section.offsetHeight / 2 + 100 + Math.random() * 200; // spawn at top
    leaf.z = (Math.random() - 0.5) * 800; // depth
    
    leaf.rx = Math.random() * Math.PI * 2;
    leaf.ry = Math.random() * Math.PI * 2;
    leaf.rz = Math.random() * Math.PI * 2;
    
    leaf.speedX = (Math.random() - 0.5) * 1.5;
    leaf.speedY = - (Math.random() * 2 + 1); // falling speed
    leaf.speedZ = (Math.random() - 0.5) * 0.5;

    leaf.rotSpeedX = (Math.random() - 0.5) * 0.05;
    leaf.rotSpeedY = (Math.random() - 0.5) * 0.05;
    leaf.rotSpeedZ = (Math.random() - 0.5) * 0.05;
    
    leaf.scale = Math.random() * 1.5 + 0.8;
    leaf.phase = Math.random() * Math.PI * 2; // For flutter sine wave
  };

  for (let i = 0; i < particleCount; i++) {
    const leaf: any = {};
    resetLeaf(leaf, true);
    leafData.push(leaf);
  }

  // Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  const handleMouseMove = (e: MouseEvent) => {
    // Normalize mouse coordinates
    mouseX = (e.clientX - windowHalfX);
    mouseY = (e.clientY - windowHalfY);
  };

  if (!window.matchMedia('(pointer: coarse)').matches) {
    document.addEventListener('mousemove', handleMouseMove);
  }

  // Handle Resize
  const resize = () => {
    camera.aspect = section.offsetWidth / section.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(section.offsetWidth, section.offsetHeight);
  };
  window.addEventListener("resize", resize);

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") isPaused = true;
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);

  const observer = new IntersectionObserver((entries) => {
    isPaused = !entries[0].isIntersecting;
  }, { threshold: 0 });
  observer.observe(section);

  // Animation Loop
  let time = 0;
  const animate = () => {
    if (!isPaused) {
      time += 0.01;
      
      // Smooth mouse target (wind effect)
      targetMouseX += (mouseX - targetMouseX) * 0.05;
      const windForce = targetMouseX * 0.003;
      
      for (let i = 0; i < particleCount; i++) {
        const leaf = leafData[i];
        
        // Flutter effect (sine wave swaying)
        const flutter = Math.sin(time * 2 + leaf.phase) * 1.5;
        
        // Update position
        leaf.x += leaf.speedX + flutter + windForce;
        leaf.y += leaf.speedY;
        leaf.z += leaf.speedZ;
        
        // Mouse avoidance/repulsion
        const dx = leaf.x - targetMouseX;
        const dy = leaf.y - (-mouseY); // invert mouseY for 3D coords
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200;
          leaf.x += (dx / dist) * force * 5;
          leaf.y += (dy / dist) * force * 5;
          leaf.rx += force * 0.1;
          leaf.rz += force * 0.1;
        }
        
        // Update rotation
        leaf.rx += leaf.rotSpeedX;
        leaf.ry += leaf.rotSpeedY;
        leaf.rz += leaf.rotSpeedZ;

        // Reset if it falls out of view
        if (leaf.y < -section.offsetHeight / 2 - 100) {
          resetLeaf(leaf, false);
        }

        // Apply transformations to dummy object
        dummy.position.set(leaf.x, leaf.y, leaf.z);
        dummy.rotation.set(leaf.rx, leaf.ry, leaf.rz);
        dummy.scale.setScalar(leaf.scale);
        dummy.updateMatrix();
        
        instancedMesh.setMatrixAt(i, dummy.matrix);
      }
      
      instancedMesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    }
    rafId = requestAnimationFrame(animate);
  };

  rafId = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
