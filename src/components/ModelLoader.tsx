import { useRef } from "react";
import "./ModelLoader.css";

interface ModelLoaderProps {
  onModelLoad: (file: File) => void;
}

export function ModelLoader({ onModelLoad }: ModelLoaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onModelLoad(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      onModelLoad(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="model-loader">
      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <p>Drop model file here or click to select</p>
        <p className="supported-formats">Supported: .glb, .gltf, .obj, .fbx</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".glb,.gltf,.obj,.fbx"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
