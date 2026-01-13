import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface SceneProps {
  lightIntensity: number;
  lightColor: string;
  objectColor: string;
}

export function Scene({ lightIntensity, lightColor, objectColor }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    directionalLight?: THREE.DirectionalLight;
    pointLight?: THREE.PointLight;
    sphere?: THREE.Mesh;
  }>({});

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    sceneRef.current.directionalLight = directionalLight;

    const pointLight = new THREE.PointLight(0xff9500, 1, 100);
    pointLight.position.set(-3, 3, 2);
    pointLight.castShadow = true;
    scene.add(pointLight);
    sceneRef.current.pointLight = pointLight;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#4a90e2";
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "#ffffff";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Three.js", 128, 128);
    const texture = new THREE.CanvasTexture(canvas);

    const boxGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const boxMaterial = new THREE.MeshStandardMaterial({ map: texture });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(2, 1, 0);
    box.castShadow = true;
    box.receiveShadow = true;
    scene.add(box);

    const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-2, 1, 0);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);
    sceneRef.current.sphere = sphere;

    const planeVertices = new Float32Array([
      -5, 0, -5, 5, 0, -5, 5, 0, 5, -5, 0, 5,
    ]);
    const planeIndices = new Uint16Array([0, 1, 2, 0, 2, 3]);
    const planeNormals = new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
    const planeGeometry = new THREE.BufferGeometry();
    planeGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(planeVertices, 3)
    );
    planeGeometry.setAttribute(
      "normal",
      new THREE.BufferAttribute(planeNormals, 3)
    );
    planeGeometry.setIndex(new THREE.BufferAttribute(planeIndices, 1));
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    scene.add(plane);

    const pyramidVertices = new Float32Array([
      0, 1.5, 0, -0.8, 0, 0.8, 0.8, 0, 0.8, 0.8, 0, -0.8, -0.8, 0, -0.8,
    ]);
    const pyramidIndices = new Uint16Array([
      0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1, 1, 4, 3, 1, 3, 2,
    ]);
    const pyramidGeometry = new THREE.BufferGeometry();
    pyramidGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(pyramidVertices, 3)
    );
    pyramidGeometry.setIndex(new THREE.BufferAttribute(pyramidIndices, 1));
    pyramidGeometry.computeVertexNormals();
    const pyramidMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff88 });
    const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
    pyramid.position.set(0, 0, 2);
    pyramid.castShadow = true;
    pyramid.receiveShadow = true;
    scene.add(pyramid);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      box.rotation.y += 0.01;
      sphere.rotation.y += 0.01;
      pyramid.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current.directionalLight) {
      sceneRef.current.directionalLight.intensity = lightIntensity;
    }
    if (sceneRef.current.pointLight) {
      sceneRef.current.pointLight.intensity = lightIntensity;
    }
  }, [lightIntensity]);

  useEffect(() => {
    if (sceneRef.current.directionalLight) {
      sceneRef.current.directionalLight.color.setStyle(lightColor);
    }
  }, [lightColor]);

  useEffect(() => {
    if (sceneRef.current.sphere) {
      (
        sceneRef.current.sphere.material as THREE.MeshStandardMaterial
      ).color.setStyle(objectColor);
    }
  }, [objectColor]);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}
