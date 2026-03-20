"use client";

import React, { createContext, useContext, useState } from "react";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

// ✅ 1. Types
type ToastVariant = "success" | "danger" | "warning" | "info" | "light" | "dark";

type ToastContextType = {
  showToast: (message: string, variant?: ToastVariant) => void;
};

// ✅ 2. Create Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ✅ 3. Hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

// ✅ 4. Provider
export const ToastProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState<ToastVariant>("info");

  const showToast = (msg: string, type: ToastVariant = "info") => {
    setMessage(msg);
    setVariant(type);
    setShow(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* ✅ Global Toast UI */}
      <ToastContainer
        position="bottom-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast
          bg={variant}
          onClose={() => setShow(false)}
          show={show}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">
            {message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </ToastContext.Provider>
  );
};