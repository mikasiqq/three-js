import { useState } from "react";
import "./App.css";
import { Controls } from "./components/Controls";
import { Scene } from "./components/Scene";

function App() {
  const [lightIntensity, setLightIntensity] = useState(1);
  const [lightColor, setLightColor] = useState("#ffffff");
  const [objectColor, setObjectColor] = useState("#ff6347");

  return (
    <>
      <Scene
        lightIntensity={lightIntensity}
        lightColor={lightColor}
        objectColor={objectColor}
      />
      <Controls
        lightIntensity={lightIntensity}
        lightColor={lightColor}
        objectColor={objectColor}
        onLightIntensityChange={setLightIntensity}
        onLightColorChange={setLightColor}
        onObjectColorChange={setObjectColor}
      />
    </>
  );
}

export default App;
