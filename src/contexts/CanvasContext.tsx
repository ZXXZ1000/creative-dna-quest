import React, { createContext, useContext } from 'react';

export interface CanvasSize {
  width: number;
  height: number;
}

export const CanvasContext = createContext<CanvasSize>({ width: 0, height: 0 });

export const useCanvas = () => useContext(CanvasContext);

