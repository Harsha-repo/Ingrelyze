import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const BarcodeScannerComponent = ({ onDetected }) => {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const codeReader = new BrowserMultiFormatReader();
        codeReaderRef.current = codeReader;

        const result = await codeReader.decodeOnceFromVideoDevice(undefined, videoRef.current);
        if (result) {
          onDetected({ codeResult: { code: result.text } });
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    startCamera();

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onDetected]);

  return (
    <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
      <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
    </div>
  );
};

export default BarcodeScannerComponent;
