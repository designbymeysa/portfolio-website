import Matter from 'matter-js'
import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react'

interface Registration {
  body: Matter.Body
  el: HTMLDivElement
}

interface GravityCtx {
  register: (r: Registration) => void
  unregister: (body: Matter.Body) => void
}

const Ctx = createContext<GravityCtx>({ register: () => {}, unregister: () => {} })

interface GravityProps {
  gravity?: { x: number; y: number }
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export default function Gravity({ gravity = { x: 0, y: 1 }, className = '', style, children }: GravityProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const engineRef    = useRef<Matter.Engine | null>(null)
  const pendingRef   = useRef<Registration[]>([])   // bodies registered before engine ready
  const activeRef    = useRef<Registration[]>([])    // bodies currently in world

  // register can be called before or after engine is created
  const register = useCallback((r: Registration) => {
    if (engineRef.current) {
      Matter.Composite.add(engineRef.current.world, r.body)
      activeRef.current.push(r)
    } else {
      pendingRef.current.push(r)
    }
  }, [])

  const unregister = useCallback((body: Matter.Body) => {
    if (engineRef.current) {
      Matter.Composite.remove(engineRef.current.world, body)
    }
    activeRef.current  = activeRef.current.filter(e => e.body !== body)
    pendingRef.current = pendingRef.current.filter(e => e.body !== body)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const engine = Matter.Engine.create({ gravity })
    engineRef.current = engine

    const W = container.offsetWidth
    const H = container.offsetHeight
    const T = 50

    const floor = Matter.Bodies.rectangle(W / 2,      H + T / 2, W * 4, T, { isStatic: true })
    const wallL = Matter.Bodies.rectangle(-T / 2,     H / 2,     T,     H * 4, { isStatic: true })
    const wallR = Matter.Bodies.rectangle(W + T / 2,  H / 2,     T,     H * 4, { isStatic: true })
    Matter.Composite.add(engine.world, [floor, wallL, wallR])

    // flush any bodies that registered before engine was ready
    for (const r of pendingRef.current) {
      Matter.Composite.add(engine.world, r.body)
      activeRef.current.push(r)
    }
    pendingRef.current = []

    // mouse drag
    const mouse = Matter.Mouse.create(container)
    const mc = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, damping: 0.1, render: { visible: false } },
    })
    Matter.Composite.add(engine.world, mc)

    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    let rafId: number
    const tick = () => {
      for (const { body, el } of activeRef.current) {
        const { x, y } = body.position
        const a = body.angle
        el.style.transform = `translate(${x - el.offsetWidth / 2}px, ${y - el.offsetHeight / 2}px) rotate(${a}rad)`
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const onResize = () => {
      const nW = container.offsetWidth
      const nH = container.offsetHeight
      Matter.Body.setPosition(floor, { x: nW / 2,      y: nH + T / 2 })
      Matter.Body.setPosition(wallR, { x: nW + T / 2,  y: nH / 2     })
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      Matter.Runner.stop(runner)
      Matter.Engine.clear(engine)
      engineRef.current = null
      activeRef.current = []
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <Ctx.Provider value={{ register, unregister }}>
      <div ref={containerRef} className={`relative overflow-hidden ${className}`} style={style}>
        {children}
      </div>
    </Ctx.Provider>
  )
}

interface MatterBodyProps {
  x?: string | number
  y?: string | number
  angle?: number
  matterBodyOptions?: Matter.IBodyDefinition
  children: React.ReactNode
}

export function MatterBody({
  x = '50%',
  y = '10%',
  angle = 0,
  matterBodyOptions = {},
  children,
}: MatterBodyProps) {
  const { register, unregister } = useContext(Ctx)
  const elRef   = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<Matter.Body | null>(null)

  useEffect(() => {
    const el        = elRef.current
    const container = el?.parentElement
    if (!el || !container) return

    const W  = container.offsetWidth
    const H  = container.offsetHeight
    const px = typeof x === 'string' && x.endsWith('%') ? parseFloat(x) / 100 * W : Number(x)
    const py = typeof y === 'string' && y.endsWith('%') ? parseFloat(y) / 100 * H : Number(y)

    // ensure layout so offsetWidth/Height are real
    el.style.position  = 'absolute'
    el.style.top       = '0'
    el.style.left      = '0'
    el.style.willChange = 'transform'

    const w = el.offsetWidth  || 80
    const h = el.offsetHeight || 32

    const body = Matter.Bodies.rectangle(px, py, w, h, {
      friction: 0.4,
      restitution: 0.35,
      ...matterBodyOptions,
      angle: (angle * Math.PI) / 180,
    })
    bodyRef.current = body

    register({ body, el })

    return () => {
      if (bodyRef.current) unregister(bodyRef.current)
    }
  }, [])

  return <div ref={elRef}>{children}</div>
}
