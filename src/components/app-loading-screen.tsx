import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assetUrl } from "@/lib/asset-url";

interface AppLoadingScreenProps {
  /** Quando true, inicia o fade-out. */
  ready?: boolean;
  /** Duração da barra de progresso (ms), apenas visual. */
  progressDuration?: number;
  onHidden?: () => void;
}

export function AppLoadingScreen({ ready = false, onHidden }: AppLoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (ready) setVisible(false);
  }, [ready]);

  return (
    <AnimatePresence onExitComplete={onHidden}>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden shadow-2xl"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center h-full w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src={assetUrl("/gif.gif?v=2")}
              alt="Carregando..."
              className="h-64 md:h-96 w-auto max-w-[90vw] object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
