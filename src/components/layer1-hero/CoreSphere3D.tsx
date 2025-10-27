import React, { useRef, useMemo, Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { useIsMobile, usePrefersReducedMotion, useIsTouchDevice } from '../../hooks'

/**
 * CoreSphere3D - The 9-Layer AI Marketing Brain
 *
 * Layer Structure (inside → outside, aligned with Explorer modules):
 * 1. Core Brain (🧠)     → Research & Planning
 * 2. Heart (❤️)          → Manager Workflow
 * 3. Production (🏭)     → Content Pipeline
 * 4. Quality Control (✅) → Telegram Approval System
 * 5. Distribution (📤)   → Publishing Layer
 * 6. Intelligence (📊)   → Analytics & Monitoring
 * 7. Optimization (🎬)   → Advertentiebuilder
 * 8. Control (🎮)        → Command Center
 * 9. Support (🤝)        → AI-Adviseur Partnership
 *
 * Visual Elements:
 * - Inner brain with flowing AI color waves (cyan, purple, lavender)
 * - Neural network pattern overlay for AI visualization
 * - Brain wave pulses (Alpha, Beta, Theta) as external rings
 * - Holographic dotted rings for futuristic aesthetic
 * - Orbital particles with connections to core
 * - Mouse parallax interaction for depth
 * - Scroll-based rotation with velocity influence
 *
 * Performance Optimizations:
 * - Mobile: Reduced geometry detail (50-70% less polygons)
 * - Reduced particle count on mobile (10 vs 20)
 * - Pauses rendering when tab inactive (Page Visibility API)
 * - Lazy loading via React.lazy
 * - Intersection observer for off-screen pausing
 */

interface CoreSphereProps {
  mouseX: number
  mouseY: number
  scrollRotation?: number
  scrollVelocity?: number
  isVisible?: boolean
}

const CoreSphereInner: React.FC<CoreSphereProps> = ({
  mouseX,
  mouseY,
  scrollRotation = 0,
  scrollVelocity = 0,
  isVisible = true,
}) => {
  const sphereRef = useRef<THREE.Mesh>(null)
  const wireframeRef = useRef<THREE.Mesh>(null)
  const outerRing1Ref = useRef<THREE.Mesh>(null)
  const outerRing2Ref = useRef<THREE.Mesh>(null)
  const brainGroupRef = useRef<THREE.Group>(null)
  const alphaWaveRef = useRef<THREE.Mesh>(null)
  const betaWaveRef = useRef<THREE.Mesh>(null)
  const thetaWaveRef = useRef<THREE.Mesh>(null)

  // Camera control for zoom
  const { camera } = useThree()
  const [targetZoom, setTargetZoom] = useState(1)

  // Mobile detection for geometry optimization
  const isMobile = useIsMobile()
  const prefersReducedMotion = usePrefersReducedMotion()

  // Reduce geometry complexity on mobile (research best practice: 50-70% reduction)
  const sphereDetail = isMobile ? 64 : 128 // Main sphere
  const lowPolySphereDetail = isMobile ? 32 : 64 // Inner spheres
  const ultraLowPolySphereDetail = isMobile ? 16 : 32 // Wireframe
  const ringDetail = isMobile ? 32 : 64 // Torus rings

  // Reduce particle count on mobile or when motion is reduced
  const particleCountActual = prefersReducedMotion ? 5 : isMobile ? 10 : 20

  // Scroll zoom effect (only with Ctrl key)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Only zoom if Ctrl or Meta (Cmd on Mac) is pressed
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        setTargetZoom((prev) => {
          const newZoom = prev + e.deltaY * -0.0005
          return Math.max(0.5, Math.min(2, newZoom)) // Clamp between 0.5x and 2x
        })
      }
      // Otherwise, allow normal page scrolling
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  // GSAP breathing animation for AI Core
  useEffect(() => {
    if (brainGroupRef.current) {
      gsap.to(brainGroupRef.current.scale, {
        x: 1.05,
        y: 1.05,
        z: 1.05,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    }
  }, [])

  // Orbital particles (10-20 particles around sphere based on device)
  const particlesRef = useRef<THREE.Points>(null)

  // Store initial angles for each particle for smooth circular motion
  const particleAngles = useMemo(() => {
    return Array.from(
      { length: particleCountActual },
      (_, i) => (i / particleCountActual) * Math.PI * 2
    )
  }, [particleCountActual])

  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCountActual * 3)

    // Initialize positions in a circular orbit
    for (let i = 0; i < particleCountActual; i++) {
      const angle = particleAngles[i]
      const radius = 1.2
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.5
      positions[i * 3 + 2] = Math.sin(angle) * radius
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [particleAngles, particleCountActual])

  // Dotted Line Shader for Outer Rings (Holographic Effect)
  const dottedRingMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        ringColor: { value: new THREE.Color('#00D4FF') },
        dotSpacing: { value: 0.15 },
        dotSize: { value: 0.08 },
        cameraPosition: { value: new THREE.Vector3() },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 ringColor;
        uniform float dotSpacing;
        uniform float dotSize;
        uniform vec3 cameraPosition;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          // Create dotted pattern around ring circumference
          float angle = atan(vPosition.z, vPosition.x);
          float normalizedAngle = (angle + 3.14159) / (2.0 * 3.14159);
          
          // Animated dots moving around ring
          float animatedPos = fract(normalizedAngle + time * 0.1);
          float dotPattern = fract(animatedPos / dotSpacing);
          
          // Create dot with smooth edges
          float dot = smoothstep(dotSize, dotSize * 0.5, dotPattern);
          dot += smoothstep(1.0 - dotSize * 0.5, 1.0 - dotSize, dotPattern);
          
          // Fade based on camera angle (holographic effect)
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - abs(dot(viewDir, vec3(0.0, 1.0, 0.0))), 2.0);
          
          // Premium pulsing glow - more elegant
          float glow = sin(time * 1.5) * 0.2 + 0.9;
          
          vec3 color = ringColor * glow * fresnel * 1.3;
          float alpha = dot * 0.7 * fresnel;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
  }, [])

  // ANATOMICALLY CORRECT Brain Material with realistic gyri/sulci
  const brainMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        varying vec2 vUv;
        
        // Improved 3D Perlin noise for organic patterns
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          
          i = mod289(i);
          vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        // Fractional Brownian Motion for complex patterns
        float fbm(vec3 p) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 1.0;
          
          for(int i = 0; i < 6; i++) {
            value += amplitude * snoise(p * frequency);
            frequency *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }
        
        void main() {
          vec3 pos = position;
          
          // Clean smooth sphere - no brain texture
          vNormal = normalize(normalMatrix * normal);
          vPosition = pos;
          vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
          vUv = uv;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        varying vec2 vUv;
        
        void main() {
          // AI COLOR WAVES flowing through the brain (3D animated waves)
          float wave1 = sin(vPosition.y * 3.0 + time * 2.0) * 0.5 + 0.5;
          float wave2 = sin(vPosition.x * 4.0 - time * 1.5) * 0.5 + 0.5;
          float wave3 = sin(vPosition.z * 3.5 + time * 2.5) * 0.5 + 0.5;
          
          // Pulsing diagonal wave pattern
          float diagonalWave = sin((vPosition.x + vPosition.y + vPosition.z) * 2.0 + time * 3.0) * 0.5 + 0.5;
          
          // Combine all waves for complex flowing effect
          float waveIntensity = (wave1 * 0.3 + wave2 * 0.3 + wave3 * 0.2 + diagonalWave * 0.2);
          
          // Premium AI color palette - more subtle and luxurious
          vec3 color1 = vec3(0.0, 0.83, 1.0);   // Cyan
          vec3 color2 = vec3(0.66, 0.33, 0.94); // Purple  
          vec3 color3 = vec3(0.0, 0.7, 0.95);   // Light Cyan
          vec3 color4 = vec3(0.55, 0.4, 0.95);  // Lavender
          
          // Mix colors based on wave positions (creates flowing rainbow effect)
          vec3 waveColor = mix(color1, color2, wave1);
          waveColor = mix(waveColor, color3, wave2);
          waveColor = mix(waveColor, color4, diagonalWave);
          
          // Glass-like Fresnel effect (stronger on edges)
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);
          
          // Premium final color: subtle waves + elegant glass edges
          vec3 finalColor = waveColor * (waveIntensity * 0.5 + fresnel * 0.8);
          
          // Premium glass transparency with elegant pulsing
          float alpha = 0.15 + fresnel * 0.4 + waveIntensity * 0.15;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
  }, [])

  // AI Neural Network shader - subtle brain-like pattern with nodes and connections
  const coreMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color('#00D4FF') },
        glowIntensity: { value: 0.15 }, // Much subtler
        fresnelPower: { value: 2.5 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vViewPosition;
        varying vec2 vUv;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vUv = uv;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float glowIntensity;
        uniform float fresnelPower;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vViewPosition;
        varying vec2 vUv;
        
        // Procedural noise for organic neural patterns
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }
        
        // Neural node pattern - creates scattered "neurons"
        float neuralNodes(vec3 pos, float time) {
          vec3 gridPos = pos * 8.0;
          vec3 cell = floor(gridPos);
          vec3 frac = fract(gridPos);
          
          float minDist = 1.0;
          
          // Check neighboring cells for nodes
          for(int x = -1; x <= 1; x++) {
            for(int y = -1; y <= 1; y++) {
              for(int z = -1; z <= 1; z++) {
                vec3 neighbor = vec3(float(x), float(y), float(z));
                vec3 point = neighbor + vec3(
                  random(cell.xy + neighbor.xy),
                  random(cell.yz + neighbor.yz),
                  random(cell.zx + neighbor.zx)
                );
                
                float dist = length(frac - point);
                minDist = min(minDist, dist);
              }
            }
          }
          
          // Create node points with pulsing
          float node = smoothstep(0.15, 0.05, minDist);
          float pulse = sin(time * 2.0 + minDist * 10.0) * 0.5 + 0.5;
          
          return node * pulse;
        }
        
        // Voronoi-based neural connections
        float neuralConnections(vec3 pos) {
          vec3 gridPos = pos * 5.0;
          vec3 cell = floor(gridPos);
          vec3 frac = fract(gridPos);
          
          float minDist = 1.0;
          
          for(int x = -1; x <= 1; x++) {
            for(int y = -1; y <= 1; y++) {
              for(int z = -1; z <= 1; z++) {
                vec3 neighbor = vec3(float(x), float(y), float(z));
                float dist = length(frac - neighbor - 0.5);
                minDist = min(minDist, dist);
              }
            }
          }
          
          // Edge detection for connections
          return smoothstep(0.45, 0.5, minDist);
        }
        
        void main() {
          // Subtle Fresnel rim
          vec3 viewDirection = normalize(vViewPosition);
          float fresnelTerm = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), fresnelPower);
          
          // Neural network pattern
          float neurons = neuralNodes(vPosition, time);
          float connections = neuralConnections(vPosition);
          
          // Very subtle inner ambient
          float distanceFromCenter = length(vPosition);
          float innerAmbient = (1.0 - distanceFromCenter) * 0.08;
          
          // Combine: mostly transparent with neural highlights
          float brightness = fresnelTerm * 0.6 + neurons * 0.8 + connections * 0.15 + innerAmbient;
          vec3 finalColor = color * brightness * glowIntensity;
          
          // Ultra transparent to show brain
          float alpha = mix(0.01, 0.08, fresnelTerm) + neurons * 0.1;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }, [])

  // Animation loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // Smooth camera zoom with lerp
    const currentZoom = camera.position.z
    const targetZoomValue = 5 / targetZoom // Inverse: zoom in = closer
    camera.position.z += (targetZoomValue - currentZoom) * 0.05 // Smooth lerp

    // Update shader time uniforms (pause when not visible)
    const timeMultiplier = isVisible ? 1 : 0
    if (coreMaterial.uniforms.time) {
      coreMaterial.uniforms.time.value = time * timeMultiplier
    }
    if (brainMaterial.uniforms.time) {
      brainMaterial.uniforms.time.value = time * timeMultiplier
    }
    if (dottedRingMaterial.uniforms.time) {
      dottedRingMaterial.uniforms.time.value = time * timeMultiplier
    }
    // Update camera position uniform for fresnel effect
    if (dottedRingMaterial.uniforms.cameraPosition) {
      dottedRingMaterial.uniforms.cameraPosition.value.copy(camera.position)
    }

    // Scroll-based rotation with velocity influence (only when visible)
    if (sphereRef.current && isVisible) {
      // Base rotation speed
      const baseRotation = 0.003

      // Add scroll-based rotation
      const scrollInfluence = scrollRotation * 0.5

      // Add velocity-based acceleration (scrolling fast = faster rotation)
      const velocityBoost = scrollVelocity * 0.001

      // Combine all factors
      sphereRef.current.rotation.y += baseRotation + scrollInfluence + velocityBoost
    }

    // Counter-rotation for wireframe
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y -= 0.005
      wireframeRef.current.rotation.x += 0.002
    }

    // Enhanced mouse parallax rotation with lerp smoothing
    if (sphereRef.current) {
      const targetRotationX = (mouseY - 0.5) * 0.4
      const targetRotationY = (mouseX - 0.5) * 0.4

      // Smooth lerp with 0.08 damping
      sphereRef.current.rotation.x += (targetRotationX - sphereRef.current.rotation.x) * 0.08
      sphereRef.current.rotation.z += (targetRotationY - sphereRef.current.rotation.z) * 0.08
    }

    // Wireframe follows with slight delay for depth effect
    if (wireframeRef.current && sphereRef.current) {
      wireframeRef.current.rotation.x +=
        (sphereRef.current.rotation.x - wireframeRef.current.rotation.x) * 0.05
      wireframeRef.current.rotation.z +=
        (sphereRef.current.rotation.z - wireframeRef.current.rotation.z) * 0.05
    }

    // Pulsing outer rings
    if (outerRing1Ref.current) {
      outerRing1Ref.current.rotation.z += 0.01
      const scale = 1 + Math.sin(time * 2) * 0.05
      outerRing1Ref.current.scale.set(scale, scale, scale)
    }

    if (outerRing2Ref.current) {
      outerRing2Ref.current.rotation.x += 0.008
      const scale = 1 + Math.cos(time * 2) * 0.05
      outerRing2Ref.current.scale.set(scale, scale, scale)
    }

    // Animate Brain Wave Pulses (External rings around brain)
    if (alphaWaveRef.current) {
      // Alpha: 8-12 Hz (slow, relaxed wave)
      const alphaPulse = Math.sin(time * 2.0) * 0.05
      alphaWaveRef.current.scale.set(1 + alphaPulse, 1 + alphaPulse, 1)
    }
    if (betaWaveRef.current) {
      // Beta: 13-30 Hz (faster, active thinking wave)
      const betaPulse = Math.sin(time * 4.0) * 0.08
      betaWaveRef.current.scale.set(1 + betaPulse, 1 + betaPulse, 1)
    }
    if (thetaWaveRef.current) {
      // Theta: 4-7 Hz (slowest, deep meditation wave)
      const thetaPulse = Math.sin(time * 1.5) * 0.04
      thetaWaveRef.current.scale.set(1 + thetaPulse, 1 + thetaPulse, 1)
    }

    // Animate orbital particles with smooth circular motion
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const radius = 1.2

      for (let i = 0; i < particleCountActual; i++) {
        // Update angle for circular motion
        const currentAngle = particleAngles[i] + time * 0.3 // Smooth rotation speed

        // Calculate new position with varying orbital heights
        const heightVariation = Math.sin(currentAngle * 2) * 0.15 // Creates wave pattern

        positions[i * 3] = Math.cos(currentAngle) * radius
        positions[i * 3 + 1] = Math.sin(currentAngle) * radius * 0.5 + heightVariation
        positions[i * 3 + 2] = Math.sin(currentAngle) * radius
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }

    // AI Core slow rotation for premium effect
    if (brainGroupRef.current) {
      brainGroupRef.current.rotation.y += 0.003
    }
  })

  return (
    <group>
      {/* Premium Lighting Setup */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 2]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-2, 2, 2]} intensity={0.8} color="#00D4FF" />
      <pointLight position={[2, -2, 1]} intensity={0.6} color="#A855F7" />
      <pointLight position={[0, 0, 3]} intensity={0.5} color="#00D4FF" />

      {/* 🧠 AI CORE BRAIN - Centerpiece with premium glass effect */}
      <group ref={brainGroupRef} position={[0, 0, 0]} scale={1.0}>
        {/* Main Core Sphere - Glass with neural network */}
        <mesh>
          <sphereGeometry args={[0.8, sphereDetail, sphereDetail]} />
          <primitive object={brainMaterial} attach="material" />
        </mesh>

        {/* Inner energy core - elegant pulsing */}
        <mesh>
          <sphereGeometry args={[0.65, lowPolySphereDetail, lowPolySphereDetail]} />
          <meshBasicMaterial
            color="#00D4FF"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Premium energy core - secondary layer */}
        <mesh>
          <sphereGeometry args={[0.55, ultraLowPolySphereDetail, ultraLowPolySphereDetail]} />
          <meshBasicMaterial
            color="#A855F7"
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Central glow point - premium intensity */}
        <pointLight position={[0, 0, 0]} intensity={2} color="#00D4FF" distance={4} />
      </group>

      {/* Brain Wave Pulses - External Rings (Alpha, Beta, Theta) */}
      <group>
        {/* Alpha Wave Ring (Cyan - 8-12 Hz) - Premium subtle */}
        <mesh ref={alphaWaveRef}>
          <torusGeometry args={[1.15, 0.018, 16, ringDetail]} />
          <meshBasicMaterial
            color="#00D4FF"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Beta Wave Ring (Magenta - 13-30 Hz) - Elegant accent */}
        <mesh ref={betaWaveRef} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.25, 0.015, 16, ringDetail]} />
          <meshBasicMaterial
            color="#FF6B9D"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Theta Wave Ring (Purple - 4-7 Hz) - Luxe touch */}
        <mesh ref={thetaWaveRef} rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
          <torusGeometry args={[1.35, 0.012, 16, ringDetail]} />
          <meshBasicMaterial
            color="#A855F7"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Premium outer glass shell */}
      <Sphere args={[1.02, sphereDetail, sphereDetail]}>
        <meshPhysicalMaterial
          color="#00D4FF"
          transparent
          opacity={0.08}
          metalness={0}
          roughness={0}
          transmission={0.95}
          thickness={0.3}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </Sphere>

      {/* Subtle wireframe for structure */}
      <Sphere ref={wireframeRef} args={[1.1, ultraLowPolySphereDetail, ultraLowPolySphereDetail]}>
        <meshBasicMaterial color="#00D4FF" wireframe transparent opacity={0.08} />
      </Sphere>

      {/* Outer ring 1 (horizontal) - HOLOGRAPHIC DOTTED EFFECT */}
      <mesh ref={outerRing1Ref} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.5, 0.025, 16, sphereDetail]} />
        <primitive object={dottedRingMaterial.clone()} attach="material" />
      </mesh>

      {/* Outer ring 2 (vertical) - HOLOGRAPHIC DOTTED EFFECT */}
      <mesh ref={outerRing2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.025, 16, sphereDetail]} />
        <primitive object={dottedRingMaterial.clone()} attach="material" />
      </mesh>

      {/* Inner energy field - subtle ambient glow */}
      <Sphere args={[0.95, lowPolySphereDetail, lowPolySphereDetail]}>
        <meshBasicMaterial
          color="#00D4FF"
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Additional glow layer for depth */}
      <Sphere args={[0.98, lowPolySphereDetail, lowPolySphereDetail]}>
        <meshBasicMaterial
          color="#A855F7"
          transparent
          opacity={0.02}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Orbital particles - Premium glow effect */}
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial
          color="#00D4FF"
          size={0.08}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Connection lines from core to orbital particles */}
      <group>
        {Array.from({ length: particleCountActual }).map((_, i) => {
          const angle = (i / particleCountActual) * Math.PI * 2
          const radius = 1.2
          const heightVariation = Math.sin(angle * 2) * 0.15
          const x = Math.cos(angle) * radius
          const y = heightVariation
          const z = Math.sin(angle) * radius

          return (
            <mesh key={i}>
              <cylinderGeometry args={[0.002, 0.002, Math.sqrt(x * x + y * y + z * z), 8]} />
              <meshBasicMaterial
                color="#00D4FF"
                transparent
                opacity={0.15}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

// Wrapper component that provides the Canvas
export const CoreSphere3D: React.FC<CoreSphereProps> = ({
  mouseX,
  mouseY,
  scrollRotation = 0,
  scrollVelocity = 0,
  isVisible = true,
}) => {
  const isMobile = useIsMobile()
  const prefersReducedMotion = usePrefersReducedMotion()
  const isTouchDevice = useIsTouchDevice()

  // Mobile optimization: Lower DPR and disable features on mobile
  const dpr: [number, number] = isMobile ? [1, 1.5] : [1, 2] // Cap at 1.5 on mobile (research best practice)
  const antialias = !isMobile // Disable antialiasing on mobile for performance
  const fov = isMobile ? 60 : 50 // Wider FOV on mobile for better composition

  // Pause rendering when tab is inactive (Page Visibility API)
  const [tabVisible, setTabVisible] = useState(true)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setTabVisible(!document.hidden)
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const sphereVisible = isVisible && tabVisible && !prefersReducedMotion

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov }}
        gl={{
          alpha: true,
          antialias,
          powerPreference: 'high-performance', // Hint for mobile GPU
        }}
        dpr={dpr}
        frameloop={sphereVisible ? 'always' : 'demand'} // Pause rendering when not visible
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <CoreSphereInner
            mouseX={isTouchDevice ? 0.5 : mouseX} // No parallax on touch devices
            mouseY={isTouchDevice ? 0.5 : mouseY}
            scrollRotation={scrollRotation}
            scrollVelocity={scrollVelocity}
            isVisible={sphereVisible}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default CoreSphere3D
