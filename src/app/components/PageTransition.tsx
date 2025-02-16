'use client'
import { motion } from 'framer-motion';

interface Props {
    children: React.ReactNode;
    className?: string;
}

export default function PageTransition({ children, className }: Props) {
    return (
        <motion.div
            initial={{ 
                opacity: 0,
                y: 5,
                scale: 0.98,
            }}
            animate={{ 
                opacity: 1,
                y: 0,
                scale: 1,
            }}
            exit={{ 
                opacity: 0,
                y: 5,
                scale: 0.98,
            }}
            transition={{
                duration: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
                opacity: { duration: 0.15 },
                scale: { duration: 0.3 }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
} 