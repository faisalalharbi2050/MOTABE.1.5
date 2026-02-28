import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';

export interface SignaturePadRef {
  clear: () => void;
  isEmpty: () => boolean;
  getSignature: () => string | null;
}

interface Props {
  onBegin?: () => void;
  onEnd?: () => void;
  penColor?: string;
  canvasClassName?: string;
  containerClassName?: string;
}

const SignaturePad = forwardRef<SignaturePadRef, Props>(({
  onBegin,
  onEnd,
  penColor = '#000000',
  canvasClassName = '',
  containerClassName = ''
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [empty, setEmpty] = useState(true);

  useImperativeHandle(ref, () => ({
    clear: () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          setEmpty(true);
        }
      }
    },
    isEmpty: () => empty,
    getSignature: () => {
      if (empty) return null;
      const canvas = canvasRef.current;
      return canvas ? canvas.toDataURL('image/png') : null;
    }
  }));

  useEffect(() => {
    // Handle resizing to keep canvas rendering sharp and correctly sized
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Only resize if it's the first render or window resized
        // Keep simple to prevent clearing on minor layout shifts
        const { width, height } = parent.getBoundingClientRect();
        // Save current content
        const ctx = canvas.getContext('2d');
        const imgData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        
        canvas.width = width;
        canvas.height = height;
        
        // Restore context settings
        if (ctx) {
           ctx.lineCap = 'round';
           ctx.lineJoin = 'round';
           ctx.lineWidth = 3;
           ctx.strokeStyle = penColor;
           if (imgData) {
             ctx.putImageData(imgData, 0, 0);
           }
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [penColor]);

  // Set drawing context when starting to draw
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling on touch
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
    setEmpty(false);
    
    if (onBegin) onBegin();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling on touch
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const endDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    setIsDrawing(false);
    if (onEnd) onEnd();
  };

  return (
    <div className={`relative w-full h-full select-none ${containerClassName}`}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
        className={`block w-full h-full bg-transparent cursor-crosshair touch-none ${canvasClassName}`}
      />
    </div>
  );
});

SignaturePad.displayName = 'SignaturePad';
export default SignaturePad;
