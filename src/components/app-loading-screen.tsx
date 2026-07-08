import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AppLoadingScreenProps {
  /** Quando true, inicia o fade-out. */
  ready?: boolean;
  /** Duração da barra de progresso (ms), apenas visual. */
  progressDuration?: number;
  onHidden?: () => void;
}

export function AppLoadingScreen({ ready = false, progressDuration = 2400, onHidden }: AppLoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (ready) setVisible(false);
  }, [ready]);

  return (
    <AnimatePresence onExitComplete={onHidden}>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brand-navy overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        >
          <motion.div
            className="relative z-10 flex flex-col items-center gap-7 px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.img
              src="/brito-logo.png"
              alt="Brito Engenharia e Instalações"
              className="h-36 sm:h-44 w-auto max-w-[90vw] object-contain drop-shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
              initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.1, delay: 0.1, ease: "easeOut" }}
            />

            <motion.p
              className="text-sm font-light tracking-wide text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              Bem-vindo
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
