import React, { useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function Background() {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 });
  const [preview, setPreview] = useState(null);

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  }

  function generateCroppedImage() {
    const img = document.querySelector("#crop-img");
    const canvas = document.createElement("canvas");
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      img,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const base64 = canvas.toDataURL("image/png");
    setPreview(base64);
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Image Crop Tool</h2>
      <input type="file" onChange={handleImageUpload} />

      {image && (
        <div className="mt-4">
          <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
            <img id="crop-img" src={image} alt="to-crop" />
          </ReactCrop>
          <button
            className="mt-2 p-2 bg-blue-500 text-white"
            onClick={generateCroppedImage}>
            Generate
          </button>
        </div>
      )}

      {preview && (
        <div className="mt-4">
          <h3 className="font-semibold">Preview:</h3>
          <img src={preview} alt="preview" className="border" />
          <a
            href={preview}
            download="preview.jpg"
            className="mt-3 inline-block bg-green-600 text-white p-2 rounded">
            Download
            {/**/}
          </a>
        </div>
      )}
    </div>
  );
}
