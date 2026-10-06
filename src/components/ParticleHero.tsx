import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  uniform vec2 uPointer;
  attribute float aSeed;
  varying float vGlow;
  void main() {
    vec3 p = position;
    float radius = length(p.xy);
    float wave = sin(radius * 3.8 - uTime * 1.25 + aSeed * 6.2831) * 0.12;
    float interference = sin(p.x * 2.7 + uTime * 0.45) * cos(p.y * 2.2 - uTime * 0.35) * 0.1;
    float breath = 1.0 + sin(uTime * 0.82) * 0.045;
    float twist = uTime * 0.07 + p.z * 0.22 + uPointer.x * 0.16;
    float c = cos(twist), s = sin(twist);
    p.xy = mat2(c, -s, s, c) * p.xy;
    p += normalize(vec3(p.xy, 0.25)) * (wave + interference);
    p.z += sin(p.x * 2.4 + uTime) * 0.16 + cos(p.y * 3.1 - uTime * 0.7) * 0.13;
    p *= breath;
    p.x += uPointer.x * 0.14;
    p.y += uPointer.y * 0.1;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (2.2 + sin(aSeed * 20.0 + uTime) * 0.7) * (34.0 / -mvPosition.z);
    vGlow = 0.5 + 0.5 * sin(aSeed * 16.0 + uTime * 0.6);
  }
`;

const fragmentShader = `
  varying float vGlow;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float glow = smoothstep(0.5, 0.05, length(uv));
    vec3 deep = vec3(0.08, 0.42, 0.18);
    vec3 bright = vec3(0.52, 1.0, 0.36);
    gl_FragColor = vec4(mix(deep, bright, vGlow) * glow, glow * 0.78);
  }
`;

function ParticleField({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const { positions, seeds } = useMemo(() => {
    const position = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      const t = i / count;
      const angle = t * Math.PI * 46;
      const shell = 0.55 + 1.5 * Math.pow(Math.sin(t * Math.PI), 0.35);
      const rib = 1 + 0.23 * Math.sin(angle * 4.0) + 0.1 * Math.cos(angle * 11.0);
      position[i * 3] = Math.cos(angle) * shell * rib;
      position[i * 3 + 1] = Math.sin(angle) * shell * 0.7 * rib;
      position[i * 3 + 2] = (t - 0.5) * 2.3 + Math.sin(angle * 1.7) * 0.26;
      seed[i] = (i * 0.6180339887) % 1;
    }
    return { positions: position, seeds: seed };
  }, [count]);
  useFrame(({ clock, pointer }) => {
    if (!material.current || !points.current) return;
    material.current.uniforms.uTime.value = clock.getElapsedTime();
    material.current.uniforms.uPointer.value.lerp(new THREE.Vector2(pointer.x, pointer.y), 0.04);
    points.current.rotation.y = clock.getElapsedTime() * 0.035;
    points.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.16) * 0.08;
  });
  return <points ref={points} position={[1.65, 0.05, -0.6]} scale={1.35}>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /><bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} /></bufferGeometry>
    <shaderMaterial ref={material} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent depthWrite={false} blending={THREE.AdditiveBlending} uniforms={{ uTime: { value: 0 }, uPointer: { value: new THREE.Vector2() } }} />
  </points>;
}

export function ParticleHero() {
  return <div className="particle-canvas" aria-hidden="true"><div className="particle-halo" /><Canvas dpr={[1, 1.35]} camera={{ position: [0, 0, 6], fov: 46 }} gl={{ antialias: false, alpha: true }}><ParticleField count={typeof window !== 'undefined' && window.innerWidth < 700 ? 7000 : 28000} /></Canvas></div>;
}
