import React, { useState } from "react";

export default function Compression() {
  const [targetSize, setTargetSize] = useState(100); // KB
  const [compressed, setCompressed] = useState(null);

  async function compressToTarget(img, targetKB) {
    let quality = 0.9;
    let result;

    while (quality > 0) {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      result = canvas.toDataURL("image/jpeg", quality);
      const sizeKB = Math.round(result.length * 0.00075);

      if (sizeKB <= targetKB) break;
      quality -= 0.05;
    }
    return result;
  }

  function handleCompress(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = async () => {
        const output = await compressToTarget(img, targetSize);
        setCompressed(output);
      };
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Image Compression Tool</h2>

      <label className="block mb-2 font-semibold">Target Size (KB):</label>
      <input
        type="number"
        className="border p-2 mb-3"
        value={targetSize}
        onChange={(e) => setTargetSize(Number(e.target.value))}
      />

      <input type="file" onChange={handleCompress} />

      {compressed && (
        <div
          style={{
            border: "2px solid black",
          }}>
          <div
            className="mt-4 w-full flex justify-center items-center"
            style={{
              flexDirection:"column"
            }}>
            <h3 className="font-semibold">Compressed Output:</h3>
            <img
              src={compressed}
              alt="compressed"
              className="border w-1/4"
            />

            <a
              href={compressed}
              download="compressed.jpg"
              className="mt-3 inline-block bg-green-600 text-white p-2 rounded">
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
