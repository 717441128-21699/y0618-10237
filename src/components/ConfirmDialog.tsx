import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "确认",
  cancelText = "取消",
  variant = "primary",
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="relative card-surface rounded-3xl p-8 max-w-md w-full"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-cream-400 hover:text-cream-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display text-2xl text-cream-100 mb-3">{title}</h3>
            {description && (
              <div className="text-sm text-cream-400 leading-relaxed mb-6">{description}</div>
            )}
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={onClose}>
                {cancelText}
              </Button>
              <Button variant={variant === "danger" ? "danger" : "primary"} onClick={onConfirm}>
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
