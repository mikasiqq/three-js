import "./TransformPanel.css";

interface Transform {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

interface TransformPanelProps {
  selectedObject: string | null;
  objects: string[];
  transform: Transform | null;
  onSelectObject: (name: string | null) => void;
  onTransformChange: (transform: Transform) => void;
}

export function TransformPanel({
  selectedObject,
  objects,
  transform,
  onSelectObject,
  onTransformChange,
}: TransformPanelProps) {
  if (!selectedObject || !transform) {
    return (
      <div className="transform-panel">
        <div className="panel-header">Object Selection</div>
        <select
          className="object-select"
          value={selectedObject || ""}
          onChange={(e) => onSelectObject(e.target.value || null)}
        >
          <option value="">Select object...</option>
          {objects.map((obj) => (
            <option key={obj} value={obj}>
              {obj}
            </option>
          ))}
        </select>
      </div>
    );
  }

  const radToDeg = (rad: number) => (rad * 180) / Math.PI;
  const degToRad = (deg: number) => (deg * Math.PI) / 180;

  const handlePositionChange = (axis: "x" | "y" | "z", value: number) => {
    onTransformChange({
      ...transform,
      position: { ...transform.position, [axis]: value },
    });
  };

  const handleRotationChange = (axis: "x" | "y" | "z", degrees: number) => {
    onTransformChange({
      ...transform,
      rotation: { ...transform.rotation, [axis]: degToRad(degrees) },
    });
  };

  const handleScaleChange = (axis: "x" | "y" | "z", value: number) => {
    onTransformChange({
      ...transform,
      scale: { ...transform.scale, [axis]: value },
    });
  };

  return (
    <div className="transform-panel">
      <div className="panel-header">Transform Controls</div>

      <select
        className="object-select"
        value={selectedObject}
        onChange={(e) => onSelectObject(e.target.value || null)}
      >
        <option value="">Deselect</option>
        {objects.map((obj) => (
          <option key={obj} value={obj}>
            {obj}
          </option>
        ))}
      </select>

      <div className="transform-section">
        <div className="section-title">Position</div>
        <div className="input-row">
          <label>X:</label>
          <input
            type="number"
            step="0.1"
            value={transform.position.x.toFixed(2)}
            onChange={(e) =>
              handlePositionChange("x", parseFloat(e.target.value))
            }
          />
        </div>
        <div className="input-row">
          <label>Y:</label>
          <input
            type="number"
            step="0.1"
            value={transform.position.y.toFixed(2)}
            onChange={(e) =>
              handlePositionChange("y", parseFloat(e.target.value))
            }
          />
        </div>
        <div className="input-row">
          <label>Z:</label>
          <input
            type="number"
            step="0.1"
            value={transform.position.z.toFixed(2)}
            onChange={(e) =>
              handlePositionChange("z", parseFloat(e.target.value))
            }
          />
        </div>
      </div>

      <div className="transform-section">
        <div className="section-title">Rotation (degrees)</div>
        <div className="input-row">
          <label>X:</label>
          <input
            type="number"
            step="1"
            value={radToDeg(transform.rotation.x).toFixed(1)}
            onChange={(e) =>
              handleRotationChange("x", parseFloat(e.target.value))
            }
          />
        </div>
        <div className="input-row">
          <label>Y:</label>
          <input
            type="number"
            step="1"
            value={radToDeg(transform.rotation.y).toFixed(1)}
            onChange={(e) =>
              handleRotationChange("y", parseFloat(e.target.value))
            }
          />
        </div>
        <div className="input-row">
          <label>Z:</label>
          <input
            type="number"
            step="1"
            value={radToDeg(transform.rotation.z).toFixed(1)}
            onChange={(e) =>
              handleRotationChange("z", parseFloat(e.target.value))
            }
          />
        </div>
      </div>

      <div className="transform-section">
        <div className="section-title">Scale</div>
        <div className="input-row">
          <label>X:</label>
          <input
            type="number"
            step="0.1"
            value={transform.scale.x.toFixed(2)}
            onChange={(e) => handleScaleChange("x", parseFloat(e.target.value))}
          />
        </div>
        <div className="input-row">
          <label>Y:</label>
          <input
            type="number"
            step="0.1"
            value={transform.scale.y.toFixed(2)}
            onChange={(e) => handleScaleChange("y", parseFloat(e.target.value))}
          />
        </div>
        <div className="input-row">
          <label>Z:</label>
          <input
            type="number"
            step="0.1"
            value={transform.scale.z.toFixed(2)}
            onChange={(e) => handleScaleChange("z", parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
