import React, { useState } from "react";

const API_KEY = "UEnHGQxRRjTp7t2wEtBdaw6Y ";

export default function BackgroundAI() {
  const [image, setImage] = useState(null);
  const [originalTransparent, setOriginalTransparent] = useState(null);
  const [processed, setProcessed] = useState(null);

  const [color, setColor] = useState("transparent");
  const [preset, setPreset] = useState("none");

  const presets = {
    passport: { w: 413, h: 531 }, // 35x45mm at 300 DPI
    visa: { w: 600, h: 600 },
    twoInch: { w: 600, h: 600 },
  };

  async function handleUpload(e) {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto");

    const result = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": API_KEY },
      body: formData,
    });

    const blob = await result.blob();
    const transparentURL = URL.createObjectURL(blob);

    setOriginalTransparent(transparentURL);
    setProcessed(transparentURL);
  }
  function applyColor() {
    const img = new Image();
    img.src = originalTransparent; // ALWAYS START FROM ORIGINAL
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (color !== "transparent") {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      setProcessed(canvas.toDataURL("image/png"));
    };
  }

  function applyPreset() {
    if (preset === "none" || !processed) return;
    const { w, h } = presets[preset];

    const img = new Image();
    img.src = processed;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      setProcessed(canvas.toDataURL("image/png"));
    };
  }
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">
        Image Background Remover + Passport Tool
      </h2>

      <input type="file" onChange={handleUpload} />

      {processed && (
        <div className="mt-4 space-y-4">
          <h3 className="font-semibold">Background Options:</h3>

          <div className="flex gap-4">
            <button
              onClick={() => setColor("transparent")}
              className="p-2 bg-gray-300 rounded">
              Transparent
            </button>
            <button
              onClick={() => setColor("white")}
              className="p-2 bg-white border rounded">
              White
            </button>
            <button
              onClick={() => setColor("red")}
              className="p-2 bg-red-500 text-white rounded">
              Red
            </button>
            <button
              onClick={() => setColor("blue")}
              className="p-2 bg-blue-500 text-white rounded">
              Blue
            </button>
            <button
              onClick={applyColor}
              className="p-2 bg-green-600 text-white rounded">
              Apply
            </button>
          </div>

          <h3 className="font-semibold">Passport Size Presets:</h3>
          <select
            className="border p-2"
            value={preset}
            onChange={(e) => setPreset(e.target.value)}>
            <option value="none">None</option>
            <option value="passport">35 x 45 mm (413×531 px)</option>
            <option value="visa">US Visa 600×600 px</option>
            <option value="twoInch">2×2 inch</option>
          </select>

          <button
            onClick={applyPreset}
            className="p-2 bg-blue-600 text-white rounded">
            Apply Size
          </button>

          <div className="mt-4">
            <h3 className="font-semibold">Preview:</h3>
            <img src={processed} alt="result" className="border" />

            <a
              href={processed}
              download="processedAI.png"
              className="mt-3 inline-block bg-green-600 text-white p-2 rounded">
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
