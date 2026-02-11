import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const makeRng = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

function FloatingParticles({ count = 90 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const rng = makeRng(42);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rng() - 0.5) * 50;
      arr[i * 3 + 1] = rng() * 10 + 2;
      arr[i * 3 + 2] = (rng() - 0.5) * 36;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.16} color="#E3B048" opacity={0.55} transparent />
    </points>
  );
}

function Worker({
  position,
  speed,
  phase,
  shirt,
}: {
  position: [number, number, number];
  speed: number;
  phase: number;
  shirt: string;
}) {
  const group = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useFrame((state) => {
    if (!group.current || reducedMotion) return;
    const t = state.clock.getElapsedTime();
    const walk = Math.sin(t * speed + phase);
    const sway = Math.cos(t * speed * 0.6 + phase) * 0.4;

    group.current.position.x = position[0] + sway;
    group.current.position.z = position[2] + Math.sin(t * speed * 0.4 + phase) * 0.3;
    group.current.rotation.y = Math.sin(t * speed * 0.3 + phase) * 0.2;

    if (leftArm.current) leftArm.current.rotation.x = walk * 0.8;
    if (rightArm.current) rightArm.current.rotation.x = -walk * 0.8;
    if (leftLeg.current) leftLeg.current.rotation.x = -walk * 0.6;
    if (rightLeg.current) rightLeg.current.rotation.x = walk * 0.6;
  });

  return (
    <group ref={group} position={position}>
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[0.5, 0.8, 0.35]} />
        <meshStandardMaterial color={shirt} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#f1d3b8" />
      </mesh>
      <mesh position={[0, 1.78, 0]}>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color="#E3B048" />
      </mesh>

      <group ref={leftArm} position={[-0.35, 1.25, 0]}>
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.12, 0.6, 0.12]} />
          <meshStandardMaterial color="#f1d3b8" />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.35, 1.25, 0]}>
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.12, 0.6, 0.12]} />
          <meshStandardMaterial color="#f1d3b8" />
        </mesh>
      </group>

      <group ref={leftLeg} position={[-0.15, 0.35, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.16, 0.7, 0.18]} />
          <meshStandardMaterial color="#384652" />
        </mesh>
      </group>
      <group ref={rightLeg} position={[0.15, 0.35, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.16, 0.7, 0.18]} />
          <meshStandardMaterial color="#384652" />
        </mesh>
      </group>

      <mesh position={[0.45, 0.95, 0]}>
        <boxGeometry args={[0.2, 0.12, 0.35]} />
        <meshStandardMaterial color="#59C7D7" />
      </mesh>
    </group>
  );
}

function Crane() {
  const arm = useRef<THREE.Group>(null);
  const hook = useRef<THREE.Mesh>(null);
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.getElapsedTime();
    if (arm.current) arm.current.rotation.y = Math.sin(t * 0.2) * 0.3;
    if (hook.current) hook.current.position.y = 1.2 + Math.sin(t * 0.8) * 0.4;
  });

  return (
    <group position={[7, 0, -6]}>
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[0.5, 6, 0.5]} />
        <meshStandardMaterial color="#A8B4BF" roughness={0.6} />
      </mesh>
      <group ref={arm} position={[0, 6, 0]}>
        <mesh position={[4.5, 0, 0]}>
          <boxGeometry args={[9, 0.2, 0.25]} />
          <meshStandardMaterial color="#E3B048" roughness={0.4} />
        </mesh>
        <mesh position={[-1.6, 0, 0]}>
          <boxGeometry args={[3.2, 0.2, 0.25]} />
          <meshStandardMaterial color="#E3B048" roughness={0.4} />
        </mesh>
        <mesh position={[7.8, -1.2, 0]}>
          <boxGeometry args={[0.08, 2.4, 0.08]} />
          <meshStandardMaterial color="#F5F5F5" />
        </mesh>
        <mesh ref={hook} position={[7.8, -2.2, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#59C7D7" />
        </mesh>
      </group>
    </group>
  );
}

function ConstructionFrame() {
  const floors = useMemo(() => [0, 1.6, 3.2, 4.8, 6.4], []);
  const columns = useMemo(() => {
    const points: [number, number, number][] = [];
    const coords = [
      [-3.6, 0, -2.6],
      [3.6, 0, -2.6],
      [-3.6, 0, 2.6],
      [3.6, 0, 2.6],
    ];
    floors.slice(0, -1).forEach((floor) => {
      coords.forEach(([x, _, z]) => {
        points.push([x, floor + 0.8, z]);
      });
    });
    return points;
  }, [floors]);

  return (
    <group position={[0, 0, -2]}>
      {floors.map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[8, 0.15, 6]} />
          <meshStandardMaterial color="#8FA3B0" roughness={0.8} />
        </mesh>
      ))}
      {columns.map((p, idx) => (
        <mesh key={idx} position={p}>
          <boxGeometry args={[0.18, 1.6, 0.18]} />
          <meshStandardMaterial color="#6C7F8B" roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0.1, 3.2]}>
        <boxGeometry args={[8.2, 0.2, 0.4]} />
        <meshStandardMaterial color="#59C7D7" emissive="#59C7D7" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[-3.2, 0.5, 0]}>
        <boxGeometry args={[0.5, 1, 6]} />
        <meshStandardMaterial color="#E3B048" roughness={0.5} />
      </mesh>
    </group>
  );
}

function MaterialStacks() {
  const stacks = useMemo(() => [
    { pos: [-6, 0.2, 3], size: [1.2, 0.4, 2] },
    { pos: [-5.2, 0.2, 1], size: [1.4, 0.4, 1.8] },
    { pos: [5.8, 0.2, 3.2], size: [1.6, 0.5, 1.2] },
  ], []);

  return (
    <group>
      {stacks.map((s, idx) => (
        <mesh key={idx} position={s.pos as [number, number, number]}>
          <boxGeometry args={s.size as [number, number, number]} />
          <meshStandardMaterial color="#384652" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function SceneLights() {
  const light = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (!light.current) return;
    const t = state.clock.getElapsedTime();
    light.current.position.x = Math.sin(t * 0.3) * 10;
    light.current.position.z = Math.cos(t * 0.3) * 10;
  });

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[10, 12, 6]} intensity={0.9} color="#f5f1e8" />
      <pointLight ref={light} position={[0, 10, 10]} intensity={0.6} color="#E3B048" />
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 6.5, 18], fov: 45 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#0b1620"]} />
      <fog attach="fog" args={["#0b1620", 10, 40]} />
      <SceneLights />
      <ConstructionFrame />
      <Crane />
      <MaterialStacks />
      <Worker position={[-4.2, 0, 2.4]} speed={1.8} phase={0.2} shirt="#59C7D7" />
      <Worker position={[-1.8, 0, 3.2]} speed={1.5} phase={1.5} shirt="#E3B048" />
      <Worker position={[2.4, 0, 2.6]} speed={1.6} phase={2.6} shirt="#F5F5F5" />
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <planeGeometry args={[80, 50]} />
        <meshStandardMaterial color="#0b1620" roughness={1} />
      </mesh>
      <FloatingParticles />
    </Canvas>
  );
}
