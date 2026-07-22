import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Undo2, Save } from "lucide-react";

interface ImageDrawCanvasProps {
  imageFile: File;
  onSave: (file: File) => void;
  onCancel: () => void;
}

export function ImageDrawCanvas({ imageFile, onSave, onCancel }: ImageDrawCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(imageFile);
    img.src = objectUrl;

    img.onload = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const cvs = canvasRef.current;
      const c = cvs.getContext("2d");
      if (!c) return;

      // Scale down image if it's too large to fit nicely in the modal
      const maxW = containerRef.current.clientWidth;
      const maxH = 400;
      let ratio = Math.min(maxW / img.width, maxH / img.height);
      if (ratio > 1) ratio = 1;

      const w = img.width * ratio;
      const h = img.height * ratio;
      
      cvs.width = w;
      cvs.height = h;
      setDimensions({ w, h });

      // Draw original image
      c.drawImage(img, 0, 0, w, h);
      
      // Setup drawing style (Red Pen)
      c.strokeStyle = "#ef4444";
      c.lineWidth = 4;
      c.lineCap = "round";
      c.lineJoin = "round";
      
      setCtx(c);
      
      // Save initial state
      setHistory([c.getImageData(0, 0, w, h)]);
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  const saveState = () => {
    if (!ctx || !canvasRef.current) return;
    const data = ctx.getImageData(0, 0, dimensions.w, dimensions.h);
    setHistory(prev => [...prev, data]);
  };

  const undo = () => {
    if (history.length <= 1 || !ctx) return;
    const newHistory = [...history];
    newHistory.pop(); // remove current state
    const prevState = newHistory[newHistory.length - 1];
    ctx.putImageData(prevState, 0, 0);
    setHistory(newHistory);
  };

  const clear = () => {
    if (history.length === 0 || !ctx) return;
    const firstState = history[0];
    ctx.putImageData(firstState, 0, 0);
    setHistory([firstState]);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    ctx?.closePath();
    setIsDrawing(false);
    saveState();
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const newFile = new File([blob], imageFile.name, { type: imageFile.type, lastModified: Date.now() });
        onSave(newFile);
      }
    }, imageFile.type, 0.9);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center bg-muted p-2 rounded-md">
        <span className="text-xs font-semibold px-2">Marque o problema na foto (Caneta Vermelha)</span>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={undo} disabled={history.length <= 1}>
            <Undo2 className="size-4 mr-1" /> Desfazer
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={clear} disabled={history.length <= 1}>
            <Eraser className="size-4 mr-1" /> Limpar
          </Button>
        </div>
      </div>
      
      <div 
        ref={containerRef} 
        className="w-full flex justify-center items-center bg-black/5 rounded-lg overflow-hidden border touch-none"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseOut={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          className="cursor-crosshair block"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="button" onClick={handleSave}>
          <Save className="size-4 mr-2" />
          Confirmar Imagem
        </Button>
      </div>
    </div>
  );
}
