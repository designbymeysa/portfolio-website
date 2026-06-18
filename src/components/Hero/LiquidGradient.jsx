import { Renderer, Program, Mesh, Triangle } from 'ogl'
import { useEffect, useRef } from 'react'

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2  uMouse;
uniform float uVelocity;
uniform vec2  uResolution;

out vec4 fragColor;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1  = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy  -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv     = gl_FragCoord.xy / uResolution;
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 uvA    = uv * aspect;
  vec2 mouseA = uMouse * aspect;

  // ripple from mouse
  float dist   = length(uvA - mouseA);
  vec2  dir    = normalize(uvA - mouseA + 0.0001);
  float ripple = sin(dist * 28.0 - uTime * 5.0) * exp(-dist * 6.0) * uVelocity;
  vec2  warpUV = uv + dir * ripple * 0.022;

  // continuous fluid warp — two passes of noise distortion
  float t = uTime * 0.10;
  vec2 warp1 = vec2(
    snoise(warpUV * 2.2 + vec2(t * 0.8,  t * 0.5)),
    snoise(warpUV * 2.2 + vec2(-t * 0.5, t * 0.9))
  ) * 0.18;
  vec2 warpedUV = warpUV + warp1;

  // colour noise layers
  float n1 = snoise(warpedUV * 2.8 + vec2( t,       t * 0.6 )) * 0.5 + 0.5;
  float n2 = snoise(warpedUV * 3.5 + vec2(-t * 0.7, t * 1.1 )) * 0.5 + 0.5;
  float n3 = snoise(warpedUV * 1.6 + vec2( t * 0.4,-t * 0.8 )) * 0.5 + 0.5;
  float n4 = snoise(warpedUV * 5.0 + vec2( t * 0.9, t * 0.3 )) * 0.5 + 0.5;

  // design-system palette
  vec3 cBase   = vec3(0.965, 0.957, 0.996); // #F6F4FE  light lavender
  vec3 cSoft   = vec3(0.745, 0.710, 0.992); // #BEB5FD  purple 300
  vec3 cBlue   = vec3(0.525, 0.580, 1.000); // #8694FF  blue 300
  vec3 cDeep   = vec3(0.357, 0.247, 0.831); // #5B3FD4  purple 700
  vec3 cWarm   = vec3(0.910, 0.867, 0.843); // #E8DDD7  warm beige
  vec3 cMid    = vec3(0.239, 0.322, 1.000); // #3D52FF  blue 500

  // blend
  vec3 col = mix(cBase, cSoft,  n1);
  col      = mix(col,   cBlue,  n2 * 0.65);
  col      = mix(col,   cDeep,  n3 * n4 * 0.45);
  col      = mix(col,   cWarm,  (1.0 - n1) * n2 * 0.35);
  col      = mix(col,   cMid,   n4 * (1.0 - n3) * 0.30);

  // mouse proximity glow
  float glow = smoothstep(0.45, 0.0, dist) * uVelocity * 0.5;
  col = mix(col, cSoft * 1.15, glow);

  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`

export default function LiquidGradient() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctn = containerRef.current
    if (!ctn) return

    const renderer = new Renderer({ antialias: true, alpha: false })
    const gl = renderer.gl
    ctn.appendChild(gl.canvas)
    gl.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;'

    let mouse      = [0.5, 0.5]
    let lastMouse  = [0.5, 0.5]
    let velocity   = 0
    let targetVel  = 0

    const geometry = new Triangle(gl)
    if (geometry.attributes.uv) delete geometry.attributes.uv

    const program = new Program(gl, {
      vertex:   VERT,
      fragment: FRAG,
      uniforms: {
        uTime:       { value: 0 },
        uMouse:      { value: mouse },
        uVelocity:   { value: 0 },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
      },
    })

    const mesh = new Mesh(gl, { geometry, program })

    function resize() {
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight)
      program.uniforms.uResolution.value = [ctn.offsetWidth, ctn.offsetHeight]
    }
    window.addEventListener('resize', resize)
    resize()

    function onPointer(e) {
      const rect = ctn.getBoundingClientRect()
      const cx = (e.touches ? e.touches[0].clientX : e.clientX)
      const cy = (e.touches ? e.touches[0].clientY : e.clientY)
      lastMouse = [...mouse]
      mouse = [
        (cx - rect.left)  / rect.width,
        1.0 - (cy - rect.top) / rect.height,
      ]
      const dx = mouse[0] - lastMouse[0]
      const dy = mouse[1] - lastMouse[1]
      targetVel = Math.min(Math.sqrt(dx * dx + dy * dy) * 60, 1.0)
    }

    ctn.addEventListener('mousemove',  onPointer)
    ctn.addEventListener('touchmove',  onPointer, { passive: true })

    let rafId
    const update = (t) => {
      rafId = requestAnimationFrame(update)
      program.uniforms.uTime.value    = t * 0.001
      program.uniforms.uMouse.value   = mouse
      velocity += (targetVel - velocity) * 0.08
      targetVel *= 0.92
      program.uniforms.uVelocity.value = velocity
      renderer.render({ scene: mesh })
    }
    rafId = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      ctn.removeEventListener('mousemove', onPointer)
      ctn.removeEventListener('touchmove',  onPointer)
      if (ctn.contains(gl.canvas)) ctn.removeChild(gl.canvas)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}
