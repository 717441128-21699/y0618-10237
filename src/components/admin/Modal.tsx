import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg";
}

export function Modal({ open, onClose, title, description, children, footer, size = "md" }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className={cn(
              "relative card-surface rounded-3xl w-full max-h-[88vh] flex flex-col",
              size === "lg" ? "max-w-2xl" : "max-w-md",
            )}
          >
            <div className="flex items-start justify-between p-6 border-b border-cream-100/5">
              <div>
                <h3 className="font-display text-xl text-cream-100">{title}</h3>
                {description && <p className="text-xs text-cream-400 mt-1">{description}</p>}
              </div>
              <button onClick={onClose} className="text-cream-400 hover:text-cream-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
            {footer && <div className="p-6 border-t border-cream-100/5 flex justify-end gap-3">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
