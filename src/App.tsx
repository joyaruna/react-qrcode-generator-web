import { useState, useRef } from "react";
import QRCode from "react-qr-code";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const qrValue = text.trim() !== "" ? text.trim() : "placeholder";
  const qrRef = useRef<HTMLDivElement | null>(null);

  const downloadQR = async () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = "qrcode.png";
      a.click();
    };
    img.src = url;
  };

  return (
    <div className="container">
      <div className="title-container">
        <h1 className="title">QR Code Generator</h1>
      </div>
      <input
        type="text"
        placeholder="Enter text or URL"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="input-box"
      />
      <div ref={qrRef} className="code-container">
        <QRCode value={qrValue} size={200} />
      </div>
      <button onClick={downloadQR} className="download-button">Download QR</button>
    </div>
  );
}

export default App;
