'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScanningRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const scanner = new Html5Qrcode('scanner-container');
    scannerRef.current = scanner;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    scanner
      .start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          onScan(decodedText);
          isScanningRef.current = false;
          setIsScanning(false);
          scanner.stop().then(() => onClose()).catch(() => onClose());
        },
        () => {}
      )
      .then(() => {
        isScanningRef.current = true;
        setIsScanning(true);
      })
      .catch((err) => {
        console.error('Scanner error:', err);
        isScanningRef.current = false;
        setIsScanning(false);

        // Give specific guidance based on why the camera failed
        const name = err?.name || '';
        const isSecure =
          typeof window !== 'undefined' &&
          (window.isSecureContext || window.location.hostname === 'localhost');

        if (!isSecure) {
          setError('Camera needs a secure (https) connection. Open this app via its https link.');
        } else if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
          setError('Camera permission was blocked. Allow camera access in your browser settings, then try again.');
        } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
          setError('No camera found on this device. Try the "Search whole foods" option instead.');
        } else {
          setError('Could not start the camera. Make sure no other app is using it, then try again.');
        }
      });

    return () => {
      if (scannerRef.current && isScanningRef.current) {
        isScanningRef.current = false;
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [onScan, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="relative w-full max-w-md p-4">
        <button
          onClick={() => {
            if (scannerRef.current && isScanningRef.current) {
              isScanningRef.current = false;
              scannerRef.current.stop().then(() => onClose()).catch(() => onClose());
            } else {
              onClose();
            }
          }}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold text-white">Scan Barcode</h3>
          <p className="text-sm text-gray-300">Point camera at product barcode</p>
        </div>

        {error ? (
          <div className="rounded-lg bg-red-500/20 p-4 text-center text-red-200">
            {error}
          </div>
        ) : (
          <div
            id="scanner-container"
            ref={containerRef}
            className="aspect-square w-full overflow-hidden rounded-lg bg-black"
          />
        )}

        {!isScanning && !error && (
          <div className="mt-4 text-center text-gray-300">
            Starting camera...
          </div>
        )}
      </div>
    </div>
  );
}
