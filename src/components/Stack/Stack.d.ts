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
  /** fires with the id of the card currently on top */
  onTopCardChange?: (id: number | null) => void
}

declare const Stack: FC<StackProps>
export default Stack
