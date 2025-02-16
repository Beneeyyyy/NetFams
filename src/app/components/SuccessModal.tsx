'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface SuccessModalProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export default function SuccessModal({ show, message, onClose }: SuccessModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-[32px] p-8 shadow-xl max-w-md w-full mx-4
                     border-2 border-slate-200 relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                Success!
              </h3>
              <p className="text-slate-600">
                {message}
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 
                         text-white rounded-xl hover:opacity-90 transition-opacity font-medium"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 