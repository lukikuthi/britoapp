import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { ApontamentoPin } from "./apontamento-pin";

interface PinData {
  id: string;
  pos_x: number;
  pos_y: number;
  status: "aberto" | "resolvido";
  descricao: string;
}

interface PlantaBaixaViewerProps {
  imageUrl: string;
  pins: PinData[];
  selectedPinId?: string;
  onPinSelect: (id: string) => void;
  onCreatePin?: (posX: number, posY: number) => void;
  addingPin?: boolean;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.25;
const DOUBLE_TAP_SCALE = 2.5;

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

export function PlantaBaixaViewer({
  imageUrl,
  pins,
  selectedPinId,
  onPinSelect,
  onCreatePin,
  addingPin = false,
}: PlantaBaixaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Refs for drag tracking (avoid stale closures)
  const dragStart = useRef({ x: 0, y: 0 });
  const translateStart = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  // Refs for pinch-to-zoom
  const lastTouchDist = useRef<number | null>(null);
  const lastTouchCenter = useRef({ x: 0, y: 0 });

  // ----- Zoom helpers -----

  const zoomAroundPoint = useCallback(
    (newScale: number, cx: number, cy: number) => {
      setScale((prev) => {
        const clamped = clamp(newScale, MIN_SCALE, MAX_SCALE);
        const ratio = clamped / prev;
        setTranslate((t) => ({
          x: cx - ratio * (cx - t.x),
          y: cy - ratio * (cy - t.y),
        }));
        return clamped;
      });
    },
    [],
  );

  const zoomIn = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    zoomAroundPoint(scale + ZOOM_STEP, cx, cy);
  }, [scale, zoomAroundPoint]);

  const zoomOut = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    zoomAroundPoint(scale - ZOOM_STEP, cx, cy);
  }, [scale, zoomAroundPoint]);

  const resetView = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  // ----- Wheel zoom -----

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const rect = container!.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      zoomAroundPoint(scale + delta, cx, cy);
    }

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [scale, zoomAroundPoint]);

  // ----- Pointer (mouse / single-touch) drag -----

  function handlePointerDown(e: React.PointerEvent) {
    // Only handle left-click / primary touch
    if (e.button !== 0) return;
    // Ignore if it's a multi-touch gesture
    if (e.pointerType === "touch" && lastTouchDist.current !== null) return;

    setIsDragging(true);
    hasMoved.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY };
    translateStart.current = { ...translate };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasMoved.current = true;
    }
    setTranslate({
      x: translateStart.current.x + dx,
      y: translateStart.current.y + dy,
    });
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!isDragging) return;
    setIsDragging(false);

    // If user didn't drag, treat as a click for pin creation
    if (!hasMoved.current && addingPin && onCreatePin) {
      createPinAtEvent(e);
    }
  }

  // ----- Touch (pinch-to-zoom) -----

  function getTouchDist(touches: React.TouchList) {
    const [a, b] = [touches[0], touches[1]];
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  function getTouchCenter(touches: React.TouchList) {
    const [a, b] = [touches[0], touches[1]];
    return {
      x: (a.clientX + b.clientX) / 2,
      y: (a.clientY + b.clientY) / 2,
    };
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      lastTouchDist.current = getTouchDist(e.touches);
      lastTouchCenter.current = getTouchCenter(e.touches);
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2 && lastTouchDist.current !== null) {
      e.preventDefault();
      const newDist = getTouchDist(e.touches);
      const center = getTouchCenter(e.touches);
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const cx = center.x - rect.left;
      const cy = center.y - rect.top;
      const scaleChange = newDist / lastTouchDist.current;
      zoomAroundPoint(scale * scaleChange, cx, cy);
      lastTouchDist.current = newDist;
      lastTouchCenter.current = center;
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (e.touches.length < 2) {
      lastTouchDist.current = null;
    }
  }

  // ----- Double-click / double-tap zoom toggle -----

  function handleDoubleClick(e: React.MouseEvent) {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    if (scale > 1.1) {
      // Reset
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    } else {
      zoomAroundPoint(DOUBLE_TAP_SCALE, cx, cy);
    }
  }

  // ----- Pin creation from click position -----
  // KEY FIX: Use the image element's actual bounding rect to compute
  // exact coordinates, avoiding naturalWidth/Height mismatch.

  function createPinAtEvent(e: React.PointerEvent) {
    const img = imageRef.current;
    if (!img) return;

    // Get the image's actual rendered bounding rect (includes transform)
    const imgRect = img.getBoundingClientRect();

    // Click position relative to the rendered image
    const clickX = e.clientX - imgRect.left;
    const clickY = e.clientY - imgRect.top;

    // Convert to 0-1 percentages using the rendered dimensions
    const posX = clickX / imgRect.width;
    const posY = clickY / imgRect.height;

    // Ensure within bounds
    if (posX < 0 || posX > 1 || posY < 0 || posY > 1) return;

    onCreatePin?.(posX, posY);
  }

  // Number pins sequentially
  const numberedPins = pins.map((pin, i) => ({
    ...pin,
    numero: i + 1,
  }));

  return (
    <div className="relative w-full h-full min-h-0 select-none">
      {/* Viewport */}
      <div
        ref={containerRef}
        className={cn(
          "w-full h-full overflow-hidden relative rounded-lg border bg-muted/30",
          isDragging ? "cursor-grabbing" : addingPin ? "cursor-crosshair" : "cursor-grab",
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => setIsDragging(false)}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: "none" }}
      >
        {/* Transform container */}
        <div
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transformOrigin: "0 0",
            willChange: "transform",
          }}
          className="relative inline-block"
        >
          {/* Floor plan image — width:100% fits to container */}
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Planta baixa"
            className="block w-full h-auto pointer-events-none"
            draggable={false}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Pins layer — sits exactly over the image, same dimensions */}
          {imageLoaded && (
            <div
              className="absolute inset-0"
              style={{
                /* Pins stay same visual size regardless of zoom */
                transform: `scale(${1 / scale})`,
                transformOrigin: "0 0",
                width: `${scale * 100}%`,
                height: `${scale * 100}%`,
              }}
            >
              {numberedPins.map((pin) => (
                <ApontamentoPin
                  key={pin.id}
                  numero={pin.numero}
                  posX={pin.pos_x}
                  posY={pin.pos_y}
                  status={pin.status}
                  selected={pin.id === selectedPinId}
                  onClick={() => onPinSelect(pin.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-30">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="size-8 shadow-md"
          onClick={zoomIn}
          title="Aumentar zoom"
        >
          <Plus className="size-4" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="size-8 shadow-md"
          onClick={zoomOut}
          title="Diminuir zoom"
        >
          <Minus className="size-4" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="size-8 shadow-md"
          onClick={resetView}
          title="Resetar visualização"
        >
          <RotateCcw className="size-4" />
        </Button>
      </div>

      {/* Adding-pin mode indicator */}
      {addingPin && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-md animate-pulse">
          Clique na planta para posicionar o apontamento
        </div>
      )}
    </div>
  );
}
