'use client';

import { useState } from 'react';
// import QRCode from 'qrcode.react';
import './QRCodeModal.css';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export function QRCodeModal({ isOpen, onClose, url }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyURL = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareURL = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this store',
          text: 'View this amazing store catalog',
          url: url,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback for browsers that don't support share API
      handleCopyURL();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="qr-modal-backdrop" onClick={onClose}></div>

      {/* Modal */}
      <div className="qr-modal">
        <div className="qr-modal-content">
          {/* Close button */}
          <button className="qr-modal-close" onClick={onClose}>
            ✕
          </button>

          {/* QR Code */}
          <div className="qr-modal-qrcode">
            <QRCodeSVG 
              value={url} 
              size={256} 
              level="H" 
              includeMargin={true}
              fgColor="#000000"
              bgColor="#ffffff"
            />
          </div>

          {/* URL Display */}
          <div className="qr-modal-url">
            <p className="qr-modal-url-text">{url}</p>
          </div>

          {/* Action Buttons */}
          <div className="qr-modal-actions">
            <button 
              className="qr-modal-btn copy-btn" 
              onClick={handleCopyURL}
            >
              {copied ? '✓ Copied!' : '📋 Copy URL'}
            </button>
            <button 
              className="qr-modal-btn share-btn" 
              onClick={handleShareURL}
            >
              📤 Share URL
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
