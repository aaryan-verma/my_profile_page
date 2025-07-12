import React, { useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

function App() {
  const [expression, setExpression] = useState('');
  const [loading, setLoading] = useState(false);
  const imgRef = useRef();

  const imageUrl = "https://superbrynaaryan.s3.eu-north-1.amazonaws.com/26904.jpg";

  const handleDetect = async () => {
    setLoading(true);
    setExpression('');
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/models');
    const detection = await faceapi
      .detectSingleFace(imgRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();
    if (detection && detection.expressions) {
      const sorted = Object.entries(detection.expressions).sort((a, b) => b[1] - a[1]);
      setExpression(sorted[0][0]);
    } else {
      setExpression('No face detected');
    }
    setLoading(false);
  };

  return (
    <div className="minimal-profile">
      <img
        ref={imgRef}
        src={imageUrl}
        alt="Profile"
        className="profile-img"
        crossOrigin="anonymous"
      />
      <h1 className="profile-name">Aaryan Verma</h1>
      <button className="expression-btn" onClick={handleDetect} disabled={loading}>
        {loading ? 'Detecting...' : 'Detect Expression'}
      </button>
      {expression && (
        <div className="expression-label">{expression}</div>
      )}
    </div>
  );
}

export default App;
