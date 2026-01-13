import { useState } from "react";
import "./App.css";
import { Controls } from "./components/Controls";
import { ModelLoader } from "./components/ModelLoader";
import { Scene } from "./components/Scene";
import { TransformPanel } from "./components/TransformPanel";

function App() {
  const [lightIntensity, setLightIntensity] = useState(1);
  const [lightColor, setLightColor] = useState("#ffffff");
  const [objectColor, setObjectColor] = useState("#ff6347");
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [objects, setObjects] = useState<string[]>([]);
  const [transform, setTransform] = useState<{
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
  } | null>(null);
  const [externalTransform, setExternalTransform] = useState<{
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
  } | null>(null);

  const handleModelLoad = (file: File) => {
    setModelFile(file);
  };

  const handleObjectSelect = (name: string | null) => {
    setSelectedObject(name);
    if (!name) {
      setTransform(null);
    }
  };

  const handleTransformChange = (newTransform: typeof transform) => {
    setTransform(newTransform);
  };

  const handleExternalTransformChange = (newTransform: typeof transform) => {
    setTransform(newTransform);
    setExternalTransform(newTransform);
  };

  return (
    <>
      <Scene
        lightIntensity={lightIntensity}
        lightColor={lightColor}
        objectColor={objectColor}
        modelFile={modelFile}
        selectedObject={selectedObject}
        onObjectSelect={handleObjectSelect}
        onObjectsChange={setObjects}
        onTransformChange={handleTransformChange}
        externalTransform={externalTransform}
      />
      <Controls
        lightIntensity={lightIntensity}
        lightColor={lightColor}
        objectColor={objectColor}
        onLightIntensityChange={setLightIntensity}
        onLightColorChange={setLightColor}
        onObjectColorChange={setObjectColor}
      />
      <ModelLoader onModelLoad={handleModelLoad} />
      <TransformPanel
        selectedObject={selectedObject}
        objects={objects}
        transform={transform}
        onSelectObject={handleObjectSelect}
        onTransformChange={handleExternalTransformChange}
      />
    </>
  );
}

export default App;
