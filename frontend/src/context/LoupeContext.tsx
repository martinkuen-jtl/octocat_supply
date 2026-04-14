/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { LOUPE_CONFIG } from '../config/loupeConfig';

interface LoupeContextValue {
  visible: boolean;
  zoomFactor: number;
  lensSize: number;
  toggleVisible: () => void;
  setZoomFactor: (value: number) => void;
  setLensSize: (value: number) => void;
}

const LoupeContext = createContext<LoupeContextValue | undefined>(undefined);

export function useLoupeContext(): LoupeContextValue {
  const ctx = useContext(LoupeContext);
  if (!ctx) {
    throw new Error('useLoupeContext must be used within LoupeProvider');
  }
  return ctx;
}

export function LoupeProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [zoomFactor, setZoomFactorState] = useState(() => {
    const saved = localStorage.getItem('loupe-zoom');
    return saved !== null ? Number(saved) : LOUPE_CONFIG.zoomFactor;
  });
  const [lensSize, setLensSizeState] = useState(() => {
    const saved = localStorage.getItem('loupe-size');
    return saved !== null ? Number(saved) : LOUPE_CONFIG.lensSize;
  });

  const toggleVisible = () => setVisible((v) => !v);

  const setZoomFactor = (value: number) => {
    setZoomFactorState(value);
    localStorage.setItem('loupe-zoom', String(value));
  };

  const setLensSize = (value: number) => {
    setLensSizeState(value);
    localStorage.setItem('loupe-size', String(value));
  };

  // Alt+L hotkey — skip when focus is in a text input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey || e.code !== 'KeyL') {return;}
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }
      e.preventDefault();
      setVisible((v) => !v);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <LoupeContext.Provider
      value={{ visible, zoomFactor, lensSize, toggleVisible, setZoomFactor, setLensSize }}
    >
      {children}
    </LoupeContext.Provider>
  );
}
