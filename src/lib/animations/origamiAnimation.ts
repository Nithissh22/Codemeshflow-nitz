import * as THREE from 'three';

export function initOrigamiAnimation(container: HTMLElement, canvas: HTMLCanvasElement) {
  let rafId: number;
  
  const scene = new THREE.Scene();
  
  // Camera setup
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 15);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xC9A84C, 2.5);
  dirLight1.position.set(5, 5, 5);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x7a6a3a, 1.5);
  dirLight2.position.set(-5, -5, 5);
  scene.add(dirLight2);

  const backLight = new THREE.DirectionalLight(0xEDE8DA, 1.0);
  backLight.position.set(0, 5, -10);
  scene.add(backLight);

  // Geometry definition
  // We define logical vertices, then build faces from them
  const baseVertices = [
    new THREE.Vector3(0, 0, 4),      // 0: Beak
    new THREE.Vector3(-0.5, 0, 1),   // 1: Left shoulder
    new THREE.Vector3(0.5, 0, 1),    // 2: Right shoulder
    new THREE.Vector3(0, 0.8, 1),    // 3: Top back
    new THREE.Vector3(0, -0.6, 1),   // 4: Bottom belly
    new THREE.Vector3(0, 0, -2),     // 5: Tail end
    new THREE.Vector3(-4.0, 0.5, 0), // 6: Left wing tip (mid)
    new THREE.Vector3(-4.5, 0, -2),  // 7: Left wing tip (back)
    new THREE.Vector3(4.0, 0.5, 0),  // 8: Right wing tip (mid)
    new THREE.Vector3(4.5, 0, -2),   // 9: Right wing tip (back)
    new THREE.Vector3(-2, 1.5, 0.5), // 10: Left wing tip (high)
    new THREE.Vector3(2, 1.5, 0.5),  // 11: Right wing tip (high)
  ];

  // Triangles using vertex indices
  const faces = [
    // Body Top
    [0, 1, 3], [0, 3, 2], [3, 1, 5], [3, 5, 2],
    // Body Bottom
    [0, 4, 1], [0, 2, 4], [4, 5, 1], [4, 2, 5],
    // Left Wing
    [1, 10, 3], [1, 6, 10], [1, 7, 6], [1, 5, 7],
    // Right Wing
    [2, 3, 11], [2, 11, 8], [2, 8, 9], [2, 9, 5]
  ];

  const geometry = new THREE.BufferGeometry();
  
  // Create an initial position array
  const positions = new Float32Array(faces.length * 3 * 3);
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const singleMaterial = new THREE.MeshStandardMaterial({
    color: 0xC9A84C,
    roughness: 0.3,
    metalness: 0.7,
    side: THREE.DoubleSide,
    flatShading: true,
  });

  const birdGroup = new THREE.Group();
  
  const birdMesh = new THREE.Mesh(geometry, singleMaterial);
  birdGroup.add(birdMesh);
  
  // Scale it up
  birdGroup.scale.set(1.5, 1.5, 1.5);
  // Add wireframe overlay for techy look
  const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xE8C96A, transparent: true, opacity: 0.15 });
  const wireframe = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wireframeMaterial);
  birdGroup.add(wireframe);

  scene.add(birdGroup);

  let time = 0;
  
  const updateGeometry = () => {
    time += 0.02;
    
    // Dynamic vertices (flapping)
    const currentVertices = baseVertices.map(v => v.clone());
    
    // Flap the wings
    const flapAngle = Math.sin(time) * 1.2;
    const flapAngleTips = Math.sin(time - 0.5) * 1.8;

    // Left wing flapping (indices 6, 7, 10)
    currentVertices[6].y += flapAngle * 2;
    currentVertices[7].y += flapAngle * 1.5;
    currentVertices[10].y += flapAngleTips * 2.5;

    // Right wing flapping (indices 8, 9, 11)
    currentVertices[8].y += flapAngle * 2;
    currentVertices[9].y += flapAngle * 1.5;
    currentVertices[11].y += flapAngleTips * 2.5;

    // Gentle body breathing
    currentVertices[3].y += Math.sin(time * 2) * 0.1;
    currentVertices[4].y -= Math.sin(time * 2) * 0.1;
    
    // Update buffer
    const positions = geometry.attributes.position.array as Float32Array;
    let idx = 0;
    
    for (let i = 0; i < faces.length; i++) {
      const face = faces[i];
      for (let j = 0; j < 3; j++) {
        const v = currentVertices[face[j]];
        positions[idx++] = v.x;
        positions[idx++] = v.y;
        positions[idx++] = v.z;
      }
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals(); // Recompute lighting normals based on new positions
    
    // Also update wireframe
    if (wireframe.geometry) {
      wireframe.geometry.dispose();
    }
    wireframe.geometry = new THREE.WireframeGeometry(geometry);
  };

  let isPaused = false;
  const observer = new IntersectionObserver((entries) => {
    isPaused = !entries[0].isIntersecting;
  }, { threshold: 0 });
  observer.observe(container);

  const renderLoop = () => {
    if (!isPaused) {
      updateGeometry();
      
      // Gentle floating and rotation of the whole bird
      birdGroup.position.y = Math.sin(time * 0.5) * 0.5;
      // Base rotation to look majestic (slightly turned and flying upwards)
      birdGroup.rotation.y = Math.PI / 4 + Math.sin(time * 0.3) * 0.2;
      birdGroup.rotation.z = Math.sin(time * 0.4) * 0.1;
      birdGroup.rotation.x = -Math.PI / 8 + Math.sin(time * 0.2) * 0.1;

      renderer.render(scene, camera);
    }
    rafId = requestAnimationFrame(renderLoop);
  };

  renderLoop();

  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };

  window.addEventListener('resize', handleResize);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', handleResize);
    renderer.dispose();
    geometry.dispose();
    singleMaterial.dispose();
    wireframeMaterial.dispose();
    if (wireframe.geometry) wireframe.geometry.dispose();
  };
}
