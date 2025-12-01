import React, { useState } from "react";
import Compression from "./Compression";
import Background from "./Background";
import BackgroundAI from "./BackgroundAI";

export default function Main() {
  const [activeTab, setActiveTab] = useState("compress");

  const tabs = [
    { id: "compress", label: "Compress" },
    { id: "metadata", label: "Background Remover" },
    { id: "resize", label: "Resize" },
  ];

  const renderTool = () => {
    switch (activeTab) {
      case "compress":
        return <Compression />;
      case "metadata":
        return <BackgroundAI />; 
      case "resize":
        return <Background />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Image Tools </h1>

      {/* TAB BUTTONS */}
      <div className="flex justify-center space-x-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md font-medium transition
              ${
                activeTab === tab.id
                  ? "bg-green-600 text-white shadow"
                  : "bg-white text-gray-700 border"
              }
            `}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* RENDER TOOL */}
      <div className="bg-white max-w-2xl mx-auto p-6 rounded-xl shadow">
        {renderTool()}
      </div>
    </div>
  );
}
