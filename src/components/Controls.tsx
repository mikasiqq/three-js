import "./Controls.css";

interface ControlsProps {
  lightIntensity: number;
  lightColor: string;
  objectColor: string;
  onLightIntensityChange: (value: number) => void;
  onLightColorChange: (value: string) => void;
  onObjectColorChange: (value: string) => void;
}

export function Controls({
  lightIntensity,
  lightColor,
  objectColor,
  onLightIntensityChange,
  onLightColorChange,
  onObjectColorChange,
}: ControlsProps) {
  return (
    <div className="controls">
      <div className="control-group">
        <label>
          Light Intensity: {lightIntensity.toFixed(1)}
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={lightIntensity}
            onChange={(e) => onLightIntensityChange(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <div className="control-group">
        <label>
          Light Color:
          <input
            type="color"
            value={lightColor}
            onChange={(e) => onLightColorChange(e.target.value)}
          />
        </label>
      </div>
      <div className="control-group">
        <label>
          Sphere Color:
          <input
            type="color"
            value={objectColor}
            onChange={(e) => onObjectColorChange(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}
