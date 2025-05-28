import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface FoodAnimationProps {
  children: ReactNode
  delay?: number
}

const FoodAnimation = ({ children, delay = 0 }: FoodAnimationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}

export default FoodAnimation
