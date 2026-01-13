import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

interface SceneProps {
  lightIntensity: number;
  lightColor: string;
  objectColor: string;
  modelFile: File | null;
  selectedObject: string | null;
  onObjectSelect: (name: string | null) => void;
  onObjectsChange: (objects: string[]) => void;
  onTransformChange: (transform: {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
  }) => void;
  externalTransform: {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
  } | null;
}

export function Scene({
  lightIntensity,
  lightColor,
  objectColor,
  modelFile,
  selectedObject,
  onObjectSelect,
  onObjectsChange,
  onTransformChange,
  externalTransform,
}: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene?: THREE.Scene;
    directionalLight?: THREE.DirectionalLight;
    pointLight?: THREE.PointLight;
    sphere?: THREE.Mesh;
    sceneObjects?: Map<string, THREE.Object3D>;
    transformControls?: TransformControls;
    raycaster?: THREE.Raycaster;
    mouse?: THREE.Vector2;
    camera?: THREE.Camera;
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

    const transformControls = new TransformControls(
      camera,
      renderer.domElement
    );
    transformControls.addEventListener("dragging-changed", (event) => {
      controls.enabled = !event.value;
    });
    transformControls.addEventListener("change", () => {
      if (transformControls.object) {
        onTransformChange({
          position: {
            x: transformControls.object.position.x,
            y: transformControls.object.position.y,
            z: transformControls.object.position.z,
          },
          rotation: {
            x: transformControls.object.rotation.x,
            y: transformControls.object.rotation.y,
            z: transformControls.object.rotation.z,
          },
          scale: {
            x: transformControls.object.scale.x,
            y: transformControls.object.scale.y,
            z: transformControls.object.scale.z,
          },
        });
      }
    });
    scene.add(transformControls as unknown as THREE.Object3D);
    sceneRef.current.transformControls = transformControls;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    sceneRef.current.raycaster = raycaster;
    sceneRef.current.mouse = mouse;

    const sceneObjects = new Map<string, THREE.Object3D>();
    sceneRef.current.sceneObjects = sceneObjects;
    sceneRef.current.scene = scene;
    sceneRef.current.camera = camera;

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
    box.name = "Box";
    scene.add(box);
    sceneObjects.set("Box", box);

    const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-2, 1, 0);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.name = "Sphere";
    scene.add(sphere);
    sceneRef.current.sphere = sphere;
    sceneObjects.set("Sphere", sphere);

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
    plane.name = "Plane";
    scene.add(plane);
    sceneObjects.set("Plane", plane);

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
    pyramid.name = "Pyramid";
    scene.add(pyramid);
    sceneObjects.set("Pyramid", pyramid);

    onObjectsChange(Array.from(sceneObjects.keys()));

    const handleClick = (event: MouseEvent) => {
      if (
        !sceneRef.current.camera ||
        !sceneRef.current.raycaster ||
        !sceneRef.current.mouse
      )
        return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const selectableObjects = Array.from(sceneObjects.values()).filter(
        (obj: THREE.Object3D) => obj.name !== "Plane"
      );
      const intersects = raycaster.intersectObjects(selectableObjects, true);

      if (intersects.length > 0) {
        let object = intersects[0].object;
        while (object.parent && !sceneObjects.has(object.name)) {
          object = object.parent;
        }
        if (object.name) {
          onObjectSelect(object.name);
        }
      }
    };
    renderer.domElement.addEventListener("click", handleClick);

    window.addEventListener("keydown", (e) => {
      if (!transformControls.object) return;

      switch (e.key) {
        case "g":
          transformControls.setMode("translate");
          break;
        case "r":
          transformControls.setMode("rotate");
          break;
        case "s":
          transformControls.setMode("scale");
          break;
      }
    });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      if (!transformControls.object) {
        box.rotation.y += 0.01;
        sphere.rotation.y += 0.01;
        pyramid.rotation.y += 0.005;
      }
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
      renderer.domElement.removeEventListener("click", handleClick);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!modelFile || !sceneRef.current.scene || !sceneRef.current.sceneObjects)
      return;

    const loadModel = async () => {
      const scene = sceneRef.current.scene!;
      const sceneObjects = sceneRef.current.sceneObjects!;
      const url = URL.createObjectURL(modelFile);
      const extension = modelFile.name.split(".").pop()?.toLowerCase();

      try {
        let model: THREE.Object3D | null = null;

        if (extension === "glb" || extension === "gltf") {
          const loader = new GLTFLoader();
          const gltf = await loader.loadAsync(url);
          model = gltf.scene;
        } else if (extension === "obj") {
          const loader = new OBJLoader();
          model = await loader.loadAsync(url);
        } else if (extension === "fbx") {
          const loader = new FBXLoader();
          model = await loader.loadAsync(url);
        }

        if (model) {
          const modelName = `Model_${Date.now()}`;
          model.name = modelName;
          model.position.set(0, 2, 0);

          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          scene.add(model);
          sceneObjects.set(modelName, model);
          onObjectsChange(Array.from(sceneObjects.keys()));
        }
      } catch (error) {
        console.error("Error loading model:", error);
      } finally {
        URL.revokeObjectURL(url);
      }
    };

    loadModel();
  }, [modelFile]);

  useEffect(() => {
    const transformControls = sceneRef.current.transformControls;
    const sceneObjects = sceneRef.current.sceneObjects;

    if (!transformControls || !sceneObjects) return;

    if (selectedObject && sceneObjects.has(selectedObject)) {
      const obj = sceneObjects.get(selectedObject)!;
      transformControls.attach(obj);
      onTransformChange({
        position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
        rotation: { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z },
        scale: { x: obj.scale.x, y: obj.scale.y, z: obj.scale.z },
      });
    } else {
      transformControls.detach();
    }
  }, [selectedObject]);

  useEffect(() => {
    if (!externalTransform || !selectedObject || !sceneRef.current.sceneObjects)
      return;

    const obj = sceneRef.current.sceneObjects.get(selectedObject);
    if (!obj) return;

    obj.position.set(
      externalTransform.position.x,
      externalTransform.position.y,
      externalTransform.position.z
    );
    obj.rotation.set(
      externalTransform.rotation.x,
      externalTransform.rotation.y,
      externalTransform.rotation.z
    );
    obj.scale.set(
      externalTransform.scale.x,
      externalTransform.scale.y,
      externalTransform.scale.z
    );
  }, [externalTransform, selectedObject]);

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
