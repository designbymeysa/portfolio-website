import { FC, ReactNode } from 'react'

export interface StackProps {
  randomRotation?: boolean
  sensitivity?: number
  cards?: ReactNode[]
  animationConfig?: { stiffness: number; damping: number }
  sendToBackOnClick?: boolean
  autoplay?: boolean
  autoplayDelay?: number
  pauseOnHover?: boolean
  mobileClickOnly?: boolean
  mobileBreakpoint?: number
}

declare const Stack: FC<StackProps>
export default Stack
