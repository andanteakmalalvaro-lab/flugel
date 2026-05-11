import { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
}

export function Card({ children, className, onClick, id }: CardProps) {
  return (
    <motion.div
      id={id}
      whileHover={onClick ? { scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      onClick={onClick}
      className={cn(
        "glass-card p-5 group hover:border-accent-primary/30",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
