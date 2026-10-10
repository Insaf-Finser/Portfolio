import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Html, Lightformer, RoundedBox, useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { socialLinks } from '../../../constants'

const LOOK_AT = new THREE.Vector3(0, 0.35, 0.1)
const damp = THREE.MathUtils.damp
const easeOutCubic = (p) => 1 - Math.pow(1 - p, 3)

/* -------------------------------------------------------------------------- */
/*  Hover label — subtle, translucent, fades + slides in                      */
/* -------------------------------------------------------------------------- */

function HoverLabel({ show, children, ...props }) {
  return (
    <Html center style={{ pointerEvents: 'none' }} {...props}>
      <span
        className={`block whitespace-nowrap rounded-full bg-ink/55 px-2 py-0.5 font-geist text-[3px] uppercase tracking-[0.16em] text-cream/90 backdrop-blur-sm transition-all duration-200 ${
          show ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
        }`}
      >
        {children}
      </span>
    </Html>
  )
}

/* -------------------------------------------------------------------------- */
/*  Textures                                                                  */
/* -------------------------------------------------------------------------- */

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const lines = []
  for (const paragraph of (text || '').split(/\r\n?|\n/)) {
    const words = paragraph.split(/\s+/).filter(Boolean)
    if (!words.length) {
      lines.push('')
      continue
    }

    let line = ''
    for (const word of words) {
      const nextLine = line ? `${line} ${word}` : word
      if (ctx.measureText(nextLine).width > maxWidth && line) {
        lines.push(line)
        line = word
      } else {
        line = nextLine
      }
    }
    lines.push(line)
  }

  const visibleLines = lines.slice(0, maxLines)
  if (lines.length > maxLines && visibleLines.length) {
    let lastLine = visibleLines[visibleLines.length - 1]
    while (lastLine && ctx.measureText(`${lastLine}…`).width > maxWidth) {
      lastLine = lastLine.slice(0, -1)
    }
    visibleLines[visibleLines.length - 1] = `${lastLine}…`
  }

  visibleLines.forEach((line, index) => {
    if (line) ctx.fillText(line, x, y + index * lineHeight)
  })
  return y + visibleLines.length * lineHeight
}

function useScreenTexture(formData, submitted, sending) {
  const [blink, setBlink] = useState(true)

  // Blinking terminal cursor
  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 530)
    return () => clearInterval(id)
  }, [])

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 640
    const map = new THREE.CanvasTexture(canvas)
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = 8
    return map
  }, [])

  useEffect(() => {
    const canvas = texture.image
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height

    ctx.fillStyle = submitted ? '#142016' : '#0c0c0b'
    ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = '#1f1e1b'
    ctx.fillRect(0, 0, w, 56)
    ;[
      ['#8fae6b', 36],
      ['#81715b', 64],
      ['#6b675f', 92],
    ].forEach(([c, x]) => {
      ctx.fillStyle = c
      ctx.beginPath()
      ctx.arc(x, 28, 8, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.font = '500 28px "Geist Mono", ui-monospace, monospace'
    ctx.fillStyle = '#efece6'
    ctx.fillText('insaf@desk — compose', 130, 38)

    ctx.font = '24px "Geist Mono", ui-monospace, monospace'
    let y = 110
    ctx.fillStyle = '#81715b'
    ctx.fillText('insaf@finser ~ %', 48, y)
    ctx.fillStyle = '#8fae6b'
    ctx.fillText(sending ? ' sending…' : submitted ? ' delivered' : ' draft --message', 290, y)

    y += 56
    ctx.fillStyle = '#6b675f'
    ctx.fillText('from', 48, y)
    ctx.fillStyle = '#efece6'
    ctx.fillText(formData.name || '—', 180, y)

    y += 44
    ctx.fillStyle = '#6b675f'
    ctx.fillText('mail', 48, y)
    ctx.fillStyle = '#efece6'
    ctx.fillText(formData.email || '—', 180, y)

    y += 52
    ctx.strokeStyle = '#2a2926'
    ctx.beginPath()
    ctx.moveTo(48, y - 24)
    ctx.lineTo(w - 48, y - 24)
    ctx.stroke()

    ctx.fillStyle = '#8fae6b'
    if (submitted) {
      ctx.font = '600 32px "Geist Mono", ui-monospace, monospace'
      ctx.fillText('✔ queued. I’ll write back soon.', 48, y + 20)
    } else {
      ctx.fillStyle = '#d4d2cc'
      const endY = wrapText(ctx, formData.message || 'Tell me about the thing you want to build…', 48, y + 12, w - 96, 36, 8)
      if (blink && !sending) {
        ctx.fillStyle = '#8fae6b'
        ctx.fillRect(48, endY - 6, 16, 30)
      }
    }

    texture.needsUpdate = true
  }, [formData, sending, submitted, blink, texture])

  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

// Procedural wood: grain streaks + plank seams, no asset download needed.
function useWoodTexture() {
  const texture = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 512
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#c9b48e'
    ctx.fillRect(0, 0, c.width, c.height)

    for (let i = 0; i < 320; i++) {
      const y = Math.random() * c.height
      const r = 90 + Math.random() * 40
      const g = 62 + Math.random() * 30
      ctx.strokeStyle = `rgba(${r | 0},${g | 0},38,${0.04 + Math.random() * 0.09})`
      ctx.lineWidth = 0.5 + Math.random() * 2.5
      ctx.beginPath()
      ctx.moveTo(0, y)
      for (let x = 0; x <= c.width; x += 64) ctx.lineTo(x, y + Math.sin(x * 0.012 + i) * 3)
      ctx.stroke()
    }

    ctx.strokeStyle = 'rgba(60,42,24,0.55)'
    ctx.lineWidth = 2
    ;[128, 256, 384].forEach((y) => {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(c.width, y)
      ctx.stroke()
    })

    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    return t
  }, [])
  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

function useIconTexture(d, { fill = '#efece6', background = '#181817', size = 256, padding = 44 } = {}) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = background
    ctx.fillRect(0, 0, size, size)
    const map = new THREE.CanvasTexture(canvas)
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = 8
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${fill}" d="${d}"/></svg>`
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, padding, padding, size - padding * 2, size - padding * 2)
      map.needsUpdate = true
    }
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    return map
  }, [background, d, fill, padding, size])
  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

function useResumeTexture() {
  const texture = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 640
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#f7f5f0'
    ctx.fillRect(0, 0, 512, 640)
    ctx.fillStyle = '#81715b'
    ctx.fillRect(36, 36, 440, 6)
    ctx.fillStyle = '#181817'
    ctx.font = '600 42px "Instrument Serif", Georgia, serif'
    ctx.fillText('Insaf Finser', 36, 102)
    ctx.font = '600 22px "Geist Mono", ui-monospace, monospace'
    ctx.fillStyle = '#81715b'
    ctx.fillText('RESUME', 36, 138)
    ctx.fillStyle = '#d4cec2'
    for (let y = 180; y < 600; y += 24) {
      ctx.fillRect(36, y, y % 72 === 0 ? 260 : 420, 7)
    }
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    return t
  }, [])
  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

/* -------------------------------------------------------------------------- */
/*  Camera — damped parallax: identical feel at 60fps or 144fps               */
/* -------------------------------------------------------------------------- */

function CameraRig({ enabled }) {
  const { camera, gl, pointer } = useThree()
  const inside = useRef(false)
  const smooth = useRef({ x: 0, y: 0 })
  const look = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    const el = gl.domElement
    const enter = () => {
      inside.current = true
    }
    const leave = () => {
      inside.current = false
    }
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
    }
  }, [gl])

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime
    const tx = enabled && inside.current ? pointer.x : 0
    const ty = enabled && inside.current ? pointer.y : 0
    smooth.current.x = damp(smooth.current.x, tx, 3.2, delta)
    smooth.current.y = damp(smooth.current.y, ty, 3.2, delta)

    const breatheX = Math.sin(t * 0.22) * 0.08
    const breatheY = Math.cos(t * 0.18) * 0.04
    const ox = enabled ? smooth.current.x * 0.55 : 0
    const oy = enabled ? smooth.current.y * 0.22 : 0

    camera.position.x = damp(camera.position.x, 2.4 + ox + breatheX, 2.6, delta)
    camera.position.y = damp(camera.position.y, 2.05 + oy + breatheY, 2.6, delta)
    camera.position.z = damp(camera.position.z, 3.7 + (enabled ? Math.abs(smooth.current.x) * 0.12 : 0), 2.6, delta)

    // look target drifts with the pointer for depth parallax
    look.set(
      LOOK_AT.x + smooth.current.x * 0.12,
      LOOK_AT.y - smooth.current.y * 0.06,
      LOOK_AT.z,
    )
    camera.lookAt(look)
  })

  return null
}

/* -------------------------------------------------------------------------- */
/*  Lighting                                                                  */
/* -------------------------------------------------------------------------- */

function Studio() {
  const aim = (self) => self.lookAt(0, 0.3, 0)
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={2.4} color="#ffe6c4" position={[4, 4, 3]} scale={[6, 3, 1]} onUpdate={aim} />
      <Lightformer form="rect" intensity={1.1} color="#9fb8ff" position={[-5, 2.5, -2]} scale={[4, 4, 1]} onUpdate={aim} />
      <Lightformer form="ring" intensity={0.9} color="#ffffff" position={[0, 5, 0]} scale={4} onUpdate={aim} />
    </Environment>
  )
}

function LampLight({ target = [1.7, 0, 0.5], reducedMotion, level }) {
  const light = useRef()
  const aim = useRef()
  useEffect(() => {
    if (light.current && aim.current) light.current.target = aim.current
  }, [])

  // Organic warm-bulb flicker (two overlapping sines), scaled by the on/off level
  useFrame(({ clock }) => {
    if (!light.current) return
    const t = clock.elapsedTime
    const base = reducedMotion
      ? 7
      : 6.8 + Math.sin(t * 7.3) * 0.22 + Math.sin(t * 13.7) * 0.12
    light.current.intensity = base * level.current
  })

  return (
    <>
      <spotLight
        ref={light}
        position={[0.66, 0.78, 0]}
        angle={0.75}
        penumbra={1}
        intensity={7}
        distance={6}
        decay={2}
        color="#ffcf99"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0006}
      />
      <object3D ref={aim} position={target} />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Atmosphere — dust motes drifting through the lamplight                    */
/* -------------------------------------------------------------------------- */

function Dust({ reducedMotion, lowPower }) {
  const ref = useRef()
  const COUNT = lowPower ? 0 : 60

  const { positions, seeds } = useMemo(() => {
    const n = COUNT
    const positions = new Float32Array(n * 3)
    const seeds = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      positions[i * 3] = ((i * 37) % 100) / 100 * 6 - 3
      positions[i * 3 + 1] = ((i * 53) % 100) / 100 * 2.6 + 0.2
      positions[i * 3 + 2] = ((i * 71) % 100) / 100 * 3.5 - 1.75
      seeds[i] = ((i * 97) % 100) / 100 * Math.PI * 2
    }
    return { positions, seeds }
  }, [COUNT])

  useFrame(({ clock }) => {
    if (!ref.current || reducedMotion || !COUNT) return
    const t = clock.elapsedTime
    const attr = ref.current.geometry.attributes.position
    for (let i = 0; i < seeds.length; i++) {
      attr.array[i * 3] += Math.sin(t * 0.35 + seeds[i]) * 0.0008
      attr.array[i * 3 + 1] += Math.cos(t * 0.28 + seeds[i] * 1.7) * 0.0006
    }
    attr.needsUpdate = true
  })

  if (!COUNT) return null
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.016} color="#e8dfc8" transparent opacity={0.32} sizeAttenuation depthWrite={false} />
    </points>
  )
}

/* -------------------------------------------------------------------------- */
/*  Models                                                                    */
/* -------------------------------------------------------------------------- */

function Desk() {
  const wood = useWoodTexture()
  return (
    <group>
      <RoundedBox args={[5.6, 0.12, 3.1]} radius={0.04} smoothness={4} position={[0, -0.06, 0]} receiveShadow castShadow>
        <meshStandardMaterial map={wood} roughness={0.55} metalness={0.02} />
      </RoundedBox>

      {/* felt desk mat */}
      <RoundedBox args={[2.7, 0.012, 1.55]} radius={0.005} smoothness={3} position={[-0.1, 0.006, -0.2]} receiveShadow>
        <meshStandardMaterial color="#2a2926" roughness={1} />
      </RoundedBox>

      {[[-2.4, -0.72, 1.2], [2.4, -0.72, 1.2], [-2.4, -0.72, -1.15], [2.4, -0.72, -1.15]].map((pos) => (
        <RoundedBox key={pos.join(',')} args={[0.12, 1.2, 0.12]} radius={0.015} smoothness={3} position={pos} castShadow>
          <meshStandardMaterial color="#8a7a62" roughness={0.7} />
        </RoundedBox>
      ))}
    </group>
  )
}

// Real-ish keyboard layout (13 columns x 5 rows) so typed characters hit the matching key.
const KEY_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '\b'],
  ['', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
  ['', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", '\n'],
  ['', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '', ''],
  Array(13).fill(''),
]
const KEY_LIST = []
const KEY_INDEX = new Map()
KEY_ROWS.forEach((row, r) =>
  row.forEach((token, c) => {
    if (r === 4 && c > 2 && c < 10) return
    if (token) KEY_INDEX.set(token, KEY_LIST.length)
    KEY_LIST.push({ x: (c - 6) * 0.118, z: -0.28 + r * 0.115 })
  }),
)
const KEY_Y = 0.072
const KEY_BASE = new THREE.Color('#1a1a19')
const KEY_LIT = new THREE.Color('#9fd07a')

function Keys({ queue }) {
  const mesh = useRef()
  const space = useRef()
  const spaceMat = useRef()
  const press = useRef(new Float32Array(KEY_LIST.length))
  const spacePress = useRef(0)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])

  const write = (i, p) => {
    const k = KEY_LIST[i]
    dummy.position.set(k.x, KEY_Y - 0.007 * p, k.z)
    dummy.updateMatrix()
    mesh.current.setMatrixAt(i, dummy.matrix)
    mesh.current.setColorAt(i, color.copy(KEY_BASE).lerp(KEY_LIT, p))
  }

  useLayoutEffect(() => {
    for (let i = 0; i < KEY_LIST.length; i++) write(i, 0)
    mesh.current.instanceMatrix.needsUpdate = true
    mesh.current.instanceColor.needsUpdate = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((_, delta) => {
    const m = mesh.current
    if (!m) return

    const q = queue.current
    while (q.length) {
      const t = q.shift()
      if (t === ' ') spacePress.current = 1
      else press.current[KEY_INDEX.get(t) ?? t.charCodeAt(0) % KEY_LIST.length] = 1
    }

    let dirty = false
    for (let i = 0; i < press.current.length; i++) {
      if (press.current[i] <= 0) continue
      press.current[i] = Math.max(0, press.current[i] - delta * 5)
      write(i, press.current[i])
      dirty = true
    }
    if (dirty) {
      m.instanceMatrix.needsUpdate = true
      m.instanceColor.needsUpdate = true
    }

    if (spacePress.current > 0 && space.current && spaceMat.current) {
      spacePress.current = Math.max(0, spacePress.current - delta * 5)
      space.current.position.y = KEY_Y - 0.007 * spacePress.current
      spaceMat.current.color.copy(KEY_BASE).lerp(KEY_LIT, spacePress.current)
    }
  })

  return (
    <>
      <instancedMesh ref={mesh} args={[null, null, KEY_LIST.length]} castShadow frustumCulled={false}>
        <boxGeometry args={[0.1, 0.014, 0.095]} />
        <meshStandardMaterial roughness={0.55} />
      </instancedMesh>
      <RoundedBox ref={space} args={[0.808, 0.014, 0.095]} radius={0.004} smoothness={2} position={[0, KEY_Y, 0.18]} castShadow>
        <meshStandardMaterial ref={spaceMat} color="#1a1a19" roughness={0.55} />
      </RoundedBox>
    </>
  )
}

const LID_TILT = -0.28
const LID_CLOSED = 1.5
const LID_LIFT = 0.04
const HINGE_Y = 0.062
const INTRO_SECONDS = 2.2

function Laptop({ formData, submitted, sending, intro, reducedMotion, onFocusForm }) {
  const screenMap = useScreenTexture(formData, submitted, sending)
  const glow = useRef()
  const lid = useRef()
  const spill = useRef()
  const progress = useRef(reducedMotion ? 1 : 0)
  const keyQueue = useRef([])
  const prev = useRef({ name: '', email: '', message: '' })
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  // Turn form edits into key presses.
  useEffect(() => {
    for (const field of ['name', 'email', 'message']) {
      const before = prev.current[field]
      const now = formData[field] || ''
      if (now.length > before.length) {
        const added = now.startsWith(before) ? now.slice(before.length) : now.slice(-1)
        for (const ch of added.slice(-6)) keyQueue.current.push(ch.toLowerCase())
      } else if (now.length < before.length && !(now.length === 0 && before.length > 1)) {
        keyQueue.current.push('\b')
      }
      prev.current[field] = now
    }
    if (keyQueue.current.length > 12) keyQueue.current.length = 12
  }, [formData])

  useFrame(({ clock }, delta) => {
    if (reducedMotion) progress.current = 1
    else if (intro && progress.current < 1) progress.current = Math.min(1, progress.current + delta / INTRO_SECONDS)

    const p = progress.current
    const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
    const closed = 1 - e
    if (lid.current) {
      lid.current.rotation.x = LID_TILT + (LID_CLOSED - LID_TILT) * closed
      lid.current.position.y = HINGE_Y + LID_LIFT * closed
    }

    // screen powers on during the last part of the opening
    const on = THREE.MathUtils.smoothstep(p, 0.7, 1)
    if (glow.current) {
      glow.current.color.setScalar(on)
      const target = on * (submitted ? 1.4 : 0.55 + Math.sin(clock.elapsedTime * 2.2) * 0.12)
      glow.current.emissiveIntensity = damp(glow.current.emissiveIntensity, target, 5, delta)
    }
    if (spill.current) spill.current.intensity = 1.2 * on
  })

  return (
    <group
      position={[-0.1, 0.02, -0.3]}
      rotation={[0, 0.12, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onFocusForm?.()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <RoundedBox args={[1.72, 0.05, 1.12]} radius={0.02} smoothness={4} position={[0, 0.04, 0.08]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#8d8d92" metalness={0.9} roughness={0.32} clearcoat={0.1} />
      </RoundedBox>

      <mesh position={[0, 0.0655, -0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.64, 0.6]} />
        <meshStandardMaterial color="#0d0d0c" roughness={0.9} />
      </mesh>
      <Keys queue={keyQueue} />
      <RoundedBox args={[0.55, 0.004, 0.3]} radius={0.01} smoothness={3} position={[0, 0.0665, 0.45]}>
        <meshPhysicalMaterial color="#7c7c81" metalness={0.8} roughness={0.25} clearcoat={0.3} />
      </RoundedBox>

      <mesh position={[0, 0.062, -0.475]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, 1.5, 16]} />
        <meshStandardMaterial color="#2a2a2c" metalness={0.8} roughness={0.3} />
      </mesh>

      <group ref={lid} position={[0, HINGE_Y, -0.475]} rotation={[reducedMotion ? LID_TILT : LID_CLOSED, 0, 0]}>
        <RoundedBox args={[1.72, 1.08, 0.03]} radius={0.012} smoothness={4} position={[0, 0.54, 0]} castShadow>
          <meshPhysicalMaterial color="#8d8d92" metalness={0.9} roughness={0.32} clearcoat={0.1} />
        </RoundedBox>
        <mesh position={[0, 0.55, 0.0165]}>
          <planeGeometry args={[1.66, 1.02]} />
          <meshPhysicalMaterial color="#050505" roughness={0.1} clearcoat={1} clearcoatRoughness={0.05} />
        </mesh>
        <mesh position={[0, 0.55, 0.0185]}>
          <planeGeometry args={[1.5, 0.94]} />
          <meshStandardMaterial
            ref={glow}
            map={screenMap}
            emissive={submitted ? '#8fae6b' : '#efece6'}
            emissiveMap={screenMap}
            emissiveIntensity={0.6}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 1.04, 0.0188]}>
          <circleGeometry args={[0.009, 16]} />
          <meshStandardMaterial color="#1d2a3a" roughness={0.2} />
        </mesh>
        <pointLight ref={spill} position={[0, 0.5, 0.45]} intensity={1.2} distance={2.2} color={submitted ? '#8fae6b' : '#b9c8ff'} />
      </group>

      {/* label sits above the screen so it never covers it */}
      <HoverLabel show={hovered} position={[0, 1.22, -0.35]} distanceFactor={8}>
        Compose
      </HoverLabel>
    </group>
  )
}

function Steam({ reducedMotion }) {
  const puffs = useRef([])
  const tex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, 'rgba(255,255,255,0.9)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(c)
  }, [])
  useEffect(() => () => tex.dispose(), [tex])

  const seeds = useMemo(() => [0, 0.25, 0.5, 0.75].map((o, i) => ({ o, drift: (i % 2 ? 1 : -1) * (0.02 + i * 0.008) })), [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    seeds.forEach((s, i) => {
      const sp = puffs.current[i]
      if (!sp) return
      const k = (t * 0.22 + s.o) % 1
      sp.position.set(Math.sin(k * 6 + i * 2) * 0.025 + s.drift * k, 0.28 + k * 0.42, 0)
      const size = 0.08 + k * 0.22
      sp.scale.set(size, size, 1)
      sp.material.opacity = Math.sin(Math.PI * k) * 0.16
    })
  })

  if (reducedMotion) return null
  return seeds.map((s, i) => (
    <sprite key={i} ref={(el) => (puffs.current[i] = el)}>
      <spriteMaterial map={tex} transparent depthWrite={false} opacity={0} />
    </sprite>
  ))
}

function Mug({ reducedMotion }) {
  const profile = useMemo(
    () =>
      [
        [0, 0],
        [0.1, 0],
        [0.115, 0.012],
        [0.13, 0.28],
        [0.124, 0.286],
        [0.108, 0.272],
        [0.108, 0.03],
        [0, 0.03],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
    [],
  )
  return (
    <group position={[-1.55, 0.012, 0.35]}>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[profile, 48]} />
        <meshPhysicalMaterial color="#efece6" roughness={0.3} clearcoat={0.8} clearcoatRoughness={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.125, 0.15, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <torusGeometry args={[0.07, 0.014, 12, 24, Math.PI]} />
        <meshPhysicalMaterial color="#efece6" roughness={0.3} clearcoat={0.8} />
      </mesh>
      <mesh position={[0, 0.235, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.108, 32]} />
        <meshPhysicalMaterial color="#2a1a0c" roughness={0.12} clearcoat={1} />
      </mesh>
      <Steam reducedMotion={reducedMotion} />
    </group>
  )
}

function Lamp({ reducedMotion }) {
  const metal = { color: '#2b2a27', metalness: 0.7, roughness: 0.35 }
  const brass = { color: '#81715b', metalness: 0.85, roughness: 0.28 }
  const bulb = useRef()
  const level = useRef(1)
  const [on, setOn] = useState(true)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  // bulb breathes with the same flicker as the spotlight; fades smoothly on toggle
  useFrame(({ clock }, delta) => {
    level.current = damp(level.current, on ? 1 : 0, 8, delta)
    if (!bulb.current) return
    const t = clock.elapsedTime
    const flicker = reducedMotion ? 3 : 2.8 + Math.sin(t * 7.3) * 0.3 + Math.sin(t * 13.7) * 0.15
    bulb.current.emissiveIntensity = flicker * level.current
    bulb.current.color.setScalar(0.25 + 0.75 * level.current)
  })

  return (
    <group
      position={[-1.95, 0, -0.95]}
      rotation={[0, -0.5, 0]}
      onClick={(e) => {
        e.stopPropagation()
        setOn((v) => !v)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, 0.025, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.17, 0.2, 0.05, 32]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[0.089, 0.337, 0]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.014, 0.014, 0.6, 12]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      <mesh position={[0.178, 0.624, 0]} castShadow>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[0.401, 0.737, 0]} rotation={[0, 0, -1.1]} castShadow>
        <cylinderGeometry args={[0.014, 0.014, 0.5, 12]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      <mesh position={[0.66, 0.82, 0]} rotation={[0, 0, 0.5]} castShadow>
        <cylinderGeometry args={[0.05, 0.17, 0.22, 32, 1, true]} />
        <meshStandardMaterial color="#1c1c1a" roughness={0.45} metalness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.66, 0.76, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial ref={bulb} color="#fff2d6" emissive="#ffd9a0" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <LampLight reducedMotion={reducedMotion} level={level} />
      <HoverLabel show={hovered} position={[0.4, 1.05, 0]} distanceFactor={8}>
        {on ? 'Lamp off' : 'Lamp on'}
      </HoverLabel>
    </group>
  )
}

function Plant({ reducedMotion }) {
  const group = useRef()
  const leafRefs = useRef([])
  const leaves = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2
        const tilt = 0.45 + (i % 3) * 0.18
        return { a, tilt, h: 0.3 + (i % 4) * 0.06 }
      }),
    [],
  )

  useFrame(({ clock }) => {
    if (reducedMotion) return
    const t = clock.elapsedTime
    if (group.current) group.current.rotation.z = Math.sin(t * 0.8) * 0.015
    // each leaf sways on its own phase — reads like a gentle breeze
    leafRefs.current.forEach((m, i) => {
      if (m) m.rotation.x = Math.sin(t * 1.1 + i * 1.3) * 0.07
    })
  })

  return (
    <group position={[1.2, 0, -1.1]}>
      <mesh position={[0, 0.11, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.14, 0.1, 0.22, 24]} />
        <meshStandardMaterial color="#b86b4a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.215, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.13, 24]} />
        <meshStandardMaterial color="#2b1d12" roughness={1} />
      </mesh>
      <group ref={group} position={[0, 0.22, 0]}>
        {leaves.map((l, i) => (
          <group key={i} rotation={[0, l.a, 0]}>
            <mesh
              ref={(el) => (leafRefs.current[i] = el)}
              position={[0.06, l.h, 0]}
              rotation={[0, 0, -l.tilt]}
              scale={[0.36, 1, 0.14]}
              castShadow
            >
              <sphereGeometry args={[0.16, 16, 12]} />
              <meshStandardMaterial color={i % 2 ? '#5f8a4a' : '#4c7a3e'} roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

const envelopeFlap = (() => {
  const s = new THREE.Shape()
  s.moveTo(-0.26, 0.17)
  s.lineTo(0, -0.02)
  s.lineTo(0.26, 0.17)
  s.lineTo(-0.26, 0.17)
  return s
})()

const CLOSE_T = 0.42
const STAMP_T = 0.38
const FLY_T = 1.45

function Envelope({ flying, reducedMotion, onOpen, onDelivered }) {
  const ref = useRef()
  const flap = useRef()
  const seal = useRef()
  const phase = useRef('idle')
  const timer = useRef(0)
  const flyT = useRef(0)
  const delivered = useRef(false)
  const [hovered, setHovered] = useState(false)
  const rest = useMemo(() => new THREE.Vector3(1.0, 0.045, 0.85), [])
  useCursor(hovered && !flying)

  useFrame(({ clock }, delta) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    const openAngle = hovered ? -1.05 : -0.72

    if (!flying) {
      phase.current = 'idle'
      timer.current = 0
      flyT.current = 0
      delivered.current = false
      const idleY = reducedMotion ? 0 : Math.sin(t * 1.6) * 0.012
      ref.current.position.x = damp(ref.current.position.x, rest.x, 6, delta)
      ref.current.position.y = damp(ref.current.position.y, rest.y + idleY + (hovered ? 0.05 : 0), 6, delta)
      ref.current.position.z = damp(ref.current.position.z, rest.z, 6, delta)
      ref.current.scale.setScalar(damp(ref.current.scale.x, 1, 6, delta))
      ref.current.rotation.x = damp(ref.current.rotation.x, -Math.PI / 2, 6, delta)
      ref.current.rotation.y = damp(ref.current.rotation.y, 0, 6, delta)
      ref.current.rotation.z = damp(ref.current.rotation.z, hovered ? 0.08 : 0.22, 6, delta)
      if (flap.current) flap.current.rotation.x = damp(flap.current.rotation.x, reducedMotion ? 0 : openAngle, 8, delta)
      if (seal.current) seal.current.scale.setScalar(damp(seal.current.scale.x, 1, 8, delta))
      return
    }

    if (reducedMotion) {
      if (flap.current) flap.current.rotation.x = 0
      if (!delivered.current) {
        delivered.current = true
        onDelivered?.()
      }
      return
    }

    if (phase.current === 'idle') {
      phase.current = 'close'
      timer.current = 0
    }

    timer.current += delta

    if (phase.current === 'close') {
      const p = Math.min(1, timer.current / CLOSE_T)
      if (flap.current) flap.current.rotation.x = openAngle * (1 - easeOutCubic(p))
      if (p >= 1) {
        phase.current = 'stamp'
        timer.current = 0
      }
    } else if (phase.current === 'stamp') {
      const p = Math.min(1, timer.current / STAMP_T)
      if (flap.current) flap.current.rotation.x = 0
      if (seal.current) {
        const punch = Math.sin(p * Math.PI)
        seal.current.scale.setScalar(1 + punch * 0.55)
      }
      if (p >= 1) {
        phase.current = 'fly'
        timer.current = 0
        flyT.current = 0
        if (!delivered.current) {
          delivered.current = true
          onDelivered?.()
        }
      }
    } else if (phase.current === 'fly') {
      flyT.current = Math.min(1, flyT.current + delta / FLY_T)
      const p = flyT.current
      const e = easeOutCubic(p)
      ref.current.position.set(
        rest.x + Math.sin(p * Math.PI * 2) * 0.16 * (1 - p),
        rest.y + e * 2.1,
        rest.z + e * 0.9,
      )
      ref.current.rotation.set(-Math.PI / 2 + e * 0.9, e * Math.PI * 2, 0.22 + e * 0.5)
      const s = 1 - Math.max(0, (p - 0.7) / 0.3)
      ref.current.scale.setScalar(Math.max(0.001, s))
    }
  })

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        if (!flying) onOpen?.()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.52, 0.34, 0.012]} />
        <meshStandardMaterial color="#f7f5f0" roughness={0.6} />
      </mesh>
      <group ref={flap} position={[0, 0.17, 0.006]}>
        <mesh position={[0, -0.17, 0]}>
          <shapeGeometry args={[envelopeFlap]} />
          <meshStandardMaterial color="#e6dfd0" roughness={0.55} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <mesh ref={seal} position={[0, -0.01, 0.014]}>
        <circleGeometry args={[0.035, 24]} />
        <meshPhysicalMaterial color="#a33a2e" roughness={0.35} clearcoat={0.6} />
      </mesh>
      <HoverLabel show={hovered && !flying} position={[0, 0.2, 0]} distanceFactor={8}>
        Write
      </HoverLabel>
    </group>
  )
}

// Hover lift + unique idle motion per prop (bob amplitude/speed/phase, wobble).
function Hotspot({ position, rotation = [0, 0, 0], label, href, idle = {}, children }) {
  const [hovered, setHovered] = useState(false)
  const lift = useRef()
  const wobble = useRef()
  const ring = useRef()
  useCursor(hovered)
  const { amp = 0.012, speed = 1.2, phase = 0, rot = 0.03 } = idle

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime
    if (lift.current) {
      const idleY = Math.sin(t * speed + phase) * amp
      lift.current.position.y = damp(lift.current.position.y, (hovered ? 0.06 : 0) + idleY, 8, delta)
    }
    if (wobble.current && !hovered) {
      wobble.current.rotation.z = Math.sin(t * speed * 0.7 + phase) * rot
    }
    if (ring.current) {
      const mat = ring.current.material
      mat.opacity = damp(mat.opacity, hovered ? 0.55 : 0, 10, delta)
      const s = hovered ? 1 : 0.7
      ring.current.scale.x = damp(ring.current.scale.x, s, 10, delta)
      ring.current.scale.y = damp(ring.current.scale.y, s, 10, delta)
    }
  })

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation()
        if (href) window.open(href, '_blank', 'noopener,noreferrer')
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]} renderOrder={1}>
        <ringGeometry args={[0.2, 0.255, 40]} />
        <meshBasicMaterial color="#81715b" transparent opacity={0} depthWrite={false} />
      </mesh>
      <group ref={lift}>
        <group ref={wobble}>{children}</group>
      </group>
      <HoverLabel show={hovered} position={[0, 0.2, 0]} distanceFactor={8}>
        {label}
      </HoverLabel>
    </group>
  )
}

function SocialProps() {
  const byName = (name) => socialLinks.find((l) => l.name === name)
  const linkedin = byName('LinkedIn')
  const github = byName('Github')
  const instagram = byName('Instagram')
  const resume = byName('Resume')
  const liMap = useIconTexture(linkedin?.svg, { fill: '#ffffff', background: '#0a66c2', padding: 52 })
  const ghMap = useIconTexture(github?.svg, { fill: '#efece6', background: '#181817', padding: 36 })
  const igMap = useIconTexture(instagram?.svg, { fill: '#efece6', background: '#81715b', padding: 40 })
  const resumeMap = useResumeTexture()
  const liGlow = useRef()
  const ghGlow = useRef()

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime
    if (liGlow.current) {
      liGlow.current.emissiveIntensity = damp(liGlow.current.emissiveIntensity, 0.35 + (Math.sin(t * 1.8) * 0.5 + 0.5) * 0.35, 4, delta)
    }
    if (ghGlow.current) {
      ghGlow.current.emissiveIntensity = damp(ghGlow.current.emissiveIntensity, 0.25 + (Math.sin(t * 1.15 + 2) * 0.5 + 0.5) * 0.35, 4, delta)
    }
  })

  return (
    <>
      <Hotspot
        position={[1.3, 0.008, -0.25]}
        rotation={[0, -0.35, 0]}
        label="LinkedIn"
        href={linkedin?.link}
        idle={{ amp: 0.008, speed: 1.1, phase: 0, rot: 0.015 }}
      >
        <RoundedBox args={[0.2, 0.012, 0.4]} radius={0.02} smoothness={4} castShadow receiveShadow>
          <meshPhysicalMaterial color="#1a1a18" metalness={0.7} roughness={0.28} clearcoat={0.4} />
        </RoundedBox>
        <mesh position={[0, 0.0068, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.18, 0.37]} />
          <meshStandardMaterial
            ref={liGlow}
            map={liMap}
            emissive="#0a66c2"
            emissiveMap={liMap}
            emissiveIntensity={0.5}
            toneMapped={false}
          />
        </mesh>
      </Hotspot>

      <Hotspot
        position={[1.6, 0.05, 0.3]}
        label="GitHub"
        href={github?.link}
        idle={{ amp: 0.016, speed: 0.8, phase: 1.4, rot: 0.04 }}
      >
        <RoundedBox args={[0.28, 0.1, 0.28]} radius={0.03} smoothness={4} castShadow receiveShadow>
          <meshPhysicalMaterial color="#181817" roughness={0.35} metalness={0.3} clearcoat={0.5} />
        </RoundedBox>
        <mesh position={[0, 0.0505, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.2, 0.2]} />
          <meshStandardMaterial
            ref={ghGlow}
            map={ghMap}
            emissive="#efece6"
            emissiveMap={ghMap}
            emissiveIntensity={0.4}
            toneMapped={false}
          />
        </mesh>
      </Hotspot>

      <Hotspot
        position={[-0.75, 0.03, 0.95]}
        rotation={[0, 0.22, 0]}
        label="Instagram"
        href={instagram?.link}
        idle={{ amp: 0.01, speed: 1.5, phase: 2.6, rot: 0.03 }}
      >
        <mesh rotation={[-Math.PI / 2, 0, 0.12]} castShadow receiveShadow>
          <boxGeometry args={[0.32, 0.38, 0.02]} />
          <meshStandardMaterial color="#efece6" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.011, 0.015]} rotation={[-Math.PI / 2, 0, 0.12]}>
          <planeGeometry args={[0.24, 0.24]} />
          <meshStandardMaterial map={igMap} roughness={0.35} />
        </mesh>
      </Hotspot>

      <Hotspot
        position={[0.25, 0.03, 0.95]}
        rotation={[0, 0.4, 0]}
        label="Resume"
        href={resume?.link}
        idle={{ amp: 0.007, speed: 1.9, phase: 4.1, rot: 0.02 }}
      >
        <mesh rotation={[-Math.PI / 2, 0, 0.08]} castShadow receiveShadow>
          <boxGeometry args={[0.38, 0.5, 0.02]} />
          <meshStandardMaterial color="#efece6" roughness={0.7} />
        </mesh>
        <mesh position={[0.02, 0.016, -0.02]} rotation={[-Math.PI / 2, 0, 0.16]} castShadow>
          <planeGeometry args={[0.38, 0.5]} />
          <meshStandardMaterial map={resumeMap} roughness={0.65} />
        </mesh>
      </Hotspot>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Scene                                                                     */
/* -------------------------------------------------------------------------- */

function Scene({ formData, submitted, sending, orbitEnabled, reducedMotion, lowPower, intro, screenSubmitted, onDelivered, onFocusForm, onFirstRender }) {
  return (
    <>
      <color attach="background" args={['#141412']} />
      <fog attach="fog" args={['#141412', 7, 16]} />

      <Studio />
      <hemisphereLight args={['#efece6', '#3d382f', 0.25]} />
      <ambientLight intensity={0.12} color="#efece6" />

      <directionalLight
        position={[3.2, 4.4, 2.2]}
        intensity={2}
        color="#ffe3c2"
        castShadow
        shadow-mapSize={lowPower ? [512, 512] : [1536, 1536]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      >
        <orthographicCamera attach="shadow-camera" args={[-4, 4, 4, -4, 0.5, 14]} />
      </directionalLight>

      <directionalLight position={[-3, 2.5, -2.5]} intensity={0.8} color="#9fb8ff" />

      <mesh position={[0, 1.1, -2.2]} receiveShadow onAfterRender={onFirstRender}>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#1c1b18" roughness={1} />
      </mesh>

      <CameraRig enabled={orbitEnabled} />
      <Dust reducedMotion={reducedMotion} lowPower={lowPower} />
      <group position={[0, -0.35, 0]}>
        <Desk />
        <Lamp reducedMotion={reducedMotion} />
        <Laptop
          formData={formData}
          submitted={screenSubmitted}
          sending={sending}
          intro={intro}
          reducedMotion={reducedMotion}
          onFocusForm={onFocusForm}
        />
        <Mug reducedMotion={reducedMotion} />
        <Plant reducedMotion={reducedMotion} />
        <Envelope
          flying={submitted}
          reducedMotion={reducedMotion}
          onOpen={onFocusForm}
          onDelivered={onDelivered}
        />
        <SocialProps />
        <ContactShadows
          position={[0, 0.002, 0]}
          opacity={0.5}
          scale={8}
          blur={2.4}
          far={2.5}
          resolution={lowPower ? 512 : 768}
        />
      </group>

      {!lowPower && (
        <EffectComposer multisampling={2}>
          <Bloom mipmapBlur luminanceThreshold={0.85} luminanceSmoothing={0.25} intensity={0.55} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
    </>
  )
}

function WebGLFallback({ onUnavailable }) {
  useEffect(() => {
    onUnavailable()
  }, [onUnavailable])

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#141412] px-6 text-center font-geist text-sm text-cream/75">
      3D preview is unavailable on this device.
    </div>
  )
}

export default function DeskScene({
  formData,
  submitted,
  sending,
  orbitEnabled,
  reducedMotion,
  screenSubmitted,
  onDelivered,
  onFocusForm,
  warmup = false,
  onReady,
  onUnavailable,
}) {
  const lowPower = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
  }, [])
  const wrap = useRef(null)
  const [inView, setInView] = useState(false)
  const [intro, setIntro] = useState(false)
  const [hasRendered, setHasRendered] = useState(false)
  const hasSignaledFirstRender = useRef(false)

  const handleFirstFrame = useCallback(() => {
    if (hasSignaledFirstRender.current) return
    hasSignaledFirstRender.current = true
    setHasRendered(true)
    onReady?.()
  }, [onReady])

  useEffect(() => {
    const el = wrap.current
    if (!el) return undefined
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      setIntro(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setIntro(true)
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        frameloop={inView ? 'always' : warmup ? 'demand' : 'never'}
        shadows
        dpr={[1, lowPower ? 1 : 1.5]}
        gl={{
          antialias: lowPower,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: lowPower ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping,
          toneMappingExposure: 1.05,
        }}
        camera={{ position: [2.4, 2.05, 3.7], fov: 40, near: 0.1, far: 40 }}
        className={`h-full w-full transition-opacity duration-700 ${hasRendered ? 'opacity-100' : 'opacity-0'}`}
        fallback={<WebGLFallback onUnavailable={onUnavailable} />}
      >
        <Scene
          formData={formData}
          submitted={submitted}
          sending={sending}
          orbitEnabled={orbitEnabled}
          reducedMotion={reducedMotion}
          lowPower={lowPower}
          intro={intro}
          screenSubmitted={screenSubmitted}
          onDelivered={onDelivered}
          onFocusForm={onFocusForm}
          onFirstRender={handleFirstFrame}
        />
      </Canvas>
    </div>
  )
}