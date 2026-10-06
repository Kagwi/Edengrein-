import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PARTICLE_COUNT_DESKTOP = 18000;
const PARTICLE_COUNT_MOBILE = 8000;

const vertexShader = `
  uniform float uProgress;
  uniform float uTime;
  attribute float aSeed;
  attribute vec3 aGridPos;
  attribute vec3 aTimberPos;
  attribute vec3 aScaffoldPos;
  attribute vec3 aBrandPos;
  varying float vGlow;
  varying float vPhase;

  vec3 lerp3(vec3 a, vec3 b, float t) { return mix(a, b, t); }

  void main() {
    float p = uProgress;
    vec3 pos;

    float p1 = smoothstep(0.0, 0.25, p);
    float p2 = smoothstep(0.15, 0.5, p);
    float p3 = smoothstep(0.35, 0.72, p);
    float p4 = smoothstep(0.6, 1.0, p);

    vec3 fieldPos = position;
    fieldPos.x += sin(uTime * 0.5 + aSeed * 6.28) * 0.15;
    fieldPos.y += cos(uTime * 0.4 + aSeed * 4.71) * 0.15;
    fieldPos.z += sin(uTime * 0.3 + aSeed * 3.14) * 0.1;

    pos = lerp3(fieldPos, aGridPos, p1);
    pos = lerp3(pos, aTimberPos, p2);
    pos = lerp3(pos, aScaffoldPos, p3);
    pos = lerp3(pos, aBrandPos, p4);

    vPhase = p;
    vGlow = 0.5 + 0.5 * sin(aSeed * 16.0 + uTime * 0.8);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (1.6 + sin(aSeed * 20.0 + uTime) * 0.5) * (30.0 / -mvPosition.z);
  }
`;

const fragmentShader = `
  varying float vGlow;
  varying float vPhase;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float glow = smoothstep(0.5, 0.05, length(uv));
    vec3 deep = vec3(0.04, 0.24, 0.12);
    vec3 mid = vec3(0.08, 0.42, 0.23);
    vec3 bright = vec3(0.52, 1.0, 0.36);
    vec3 col = mix(deep, mid, vGlow);
    col = mix(col, bright, vGlow * vPhase);
    gl_FragColor = vec4(col * glow, glow * 0.82);
  }
`;

function generatePositions(count: number) {
  const base = new Float32Array(count * 3);
  const grid = new Float32Array(count * 3);
  const timber = new Float32Array(count * 3);
  const scaffold = new Float32Array(count * 3);
  const brand = new Float32Array(count * 3);
  const seeds = new Float32Array(count);

  const gridN = Math.ceil(Math.sqrt(count));
  const spacing = 0.12;

  for (let i = 0; i < count; i++) {
    const t = i / count;
    const angle = t * Math.PI * 38;
    const shell = 1.2 + 1.8 * Math.pow(Math.sin(t * Math.PI), 0.4);
    base[i * 3] = Math.cos(angle) * shell * (0.8 + 0.2 * Math.sin(angle * 5));
    base[i * 3 + 1] = Math.sin(angle) * shell * 0.6 * (0.8 + 0.2 * Math.cos(angle * 7));
    base[i * 3 + 2] = (t - 0.5) * 3.0 + Math.sin(angle * 2) * 0.3;

    const gx = (i % gridN) - gridN / 2;
    const gy = Math.floor(i / gridN) - gridN / 2;
    grid[i * 3] = gx * spacing;
    grid[i * 3 + 1] = gy * spacing;
    grid[i * 3 + 2] = 0;

    const beamRow = Math.floor(t * 12);
    const beamCol = (i % 8) / 8;
    timber[i * 3] = (beamCol - 0.5) * 4.0 + Math.sin(beamRow * 0.5) * 0.1;
    timber[i * 3 + 1] = (beamRow - 6) * 0.35;
    timber[i * 3 + 2] = (Math.sin(i * 0.3) * 0.4) * (1 + (i % 3) * 0.5);

    const scaffoldCol = i % 6;
    const scaffoldRow = Math.floor(i / 6) % 14;
    const scaffoldLayer = Math.floor(i / (6 * 14)) % 3;
    scaffold[i * 3] = (scaffoldCol - 2.5) * 0.65;
    scaffold[i * 3 + 1] = (scaffoldRow - 7) * 0.4;
    scaffold[i * 3 + 2] = (scaffoldLayer - 1) * 1.2;

    const brandAngle = t * Math.PI * 2;
    const brandRadius = 2.5 + Math.sin(t * Math.PI * 8) * 0.3;
    brand[i * 3] = Math.cos(brandAngle) * brandRadius;
    brand[i * 3 + 1] = Math.sin(brandAngle) * brandRadius * 0.5;
    brand[i * 3 + 2] = Math.cos(t * Math.PI * 16) * 0.6;

    seeds[i] = (i * 0.6180339887) % 1;
  }

  return { base, grid, timber, scaffold, brand, seeds };
}

function ParticleSystem({ count, progressRef }: { count: number; progressRef: React.RefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { base, grid, timber, scaffold, brand, seeds } = useMemo(() => generatePositions(count), [count]);

  useFrame(({ clock }) => {
    if (!matRef.current || !pointsRef.current) return;
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    matRef.current.uniforms.uProgress.value = progressRef.current ?? 0;
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={pointsRef} position={[0, 0, 0]} scale={1.1}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[base, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        <bufferAttribute attach="attributes-aGridPos" args={[grid, 3]} />
        <bufferAttribute attach="attributes-aTimberPos" args={[timber, 3]} />
        <bufferAttribute attach="attributes-aScaffoldPos" args={[scaffold, 3]} />
        <bufferAttribute attach="attributes-aBrandPos" args={[brand, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uProgress: { value: 0 },
        }}
      />
    </points>
  );
}

export function MaterialsInMotion() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    setIsMobile(window.innerWidth < 700);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const start = vh * 0.85;
        const end = -rect.height * 0.3;
        const total = start - end;
        const current = rect.top;
        const progress = Math.max(0, Math.min(1, (start - current) / total));
        progressRef.current = progress;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [reducedMotion]);

  const count = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;

  const phaseLabels = [
    { label: 'Particle Field', range: '0%' },
    { label: 'Structural Grid', range: '25%' },
    { label: 'Timber Structure', range: '50%' },
    { label: 'Scaffolding Form', range: '75%' },
    { label: 'Edengrein', range: '100%' },
  ];

  return (
    <section ref={sectionRef} className="mim-section">
      <div className="mim-canvas-wrap">
        {reducedMotion ? (
          <div className="mim-static-bg" />
        ) : (
          <Canvas dpr={[1, 1.3]} camera={{ position: [0, 0, 7], fov: 50 }} gl={{ antialias: false, alpha: true }}>
            <ParticleSystem count={count} progressRef={progressRef} />
          </Canvas>
        )}
      </div>
      <div className="mim-overlay">
        <div className="container mim-content">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="eyebrow eyebrow-light">WebGL Storytelling</span>
            <h2>Materials in Motion</h2>
            <p className="mim-text">From timber and structural materials to scaffolding solutions, Edengrein supports the systems that keep construction moving.</p>
          </motion.div>

          <div className="mim-phases">
            {phaseLabels.map((phase, i) => (
              <div key={phase.label} className="mim-phase-item">
                <span className="mim-phase-num">0{i + 1}</span>
                <span className="mim-phase-label">{phase.label}</span>
              </div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
            <Link className="button button-outline mim-cta" to="/products">Explore Products <ArrowRight size={16} /></Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
