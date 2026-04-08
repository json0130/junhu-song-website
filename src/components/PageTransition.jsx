import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  initial: { opacity: 0, x: -40 },
  enter: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } },
  exit: { opacity: 0, x: 40, transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } },
};

export default function PageTransition({ children, pageKey }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        style={{ width: '100%', minHeight: '100vh' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
