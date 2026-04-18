"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

interface BottleProps {
  scrollProgress: number; // 0..1
}

function Bottle({ scrollProgress }: BottleProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Auto rotate + scroll-based rotation
    groupRef.current.rotation.y += delta * 0.3;
    groupRef.current.rotation.y += scrollProgress * 0.05;
    // Slight tilt based on scroll
    groupRef.current.rotation.x = scrollProgress * 0.3;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Bottle body - glass cylinder */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.9, 0.9, 2, 64]} />
          <meshPhysicalMaterial
            color="#ffc8d8"
            transmission={0.9}
            thickness={0.8}
            roughness={0.05}
            metalness={0}
            ior={1.5}
            transparent
            opacity={0.85}
            clearcoat={1}
            clearcoatRoughness={0}
          />
        </mesh>

        {/* Bottle shoulder - tapered */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.9, 0.3, 64]} />
          <meshPhysicalMaterial
            color="#ffc8d8"
            transmission={0.9}
            thickness={0.5}
            roughness={0.05}
            ior={1.5}
            transparent
            opacity={0.85}
            clearcoat={1}
          />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 1.15, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.3, 0.2, 32]} />
          <meshPhysicalMaterial
            color="#ffd0e0"
            transmission={0.7}
            thickness={0.3}
            roughness={0.1}
            ior={1.5}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Metallic cap - gold */}
        <mesh position={[0, 1.45, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.4, 32]} />
          <meshStandardMaterial
            color="#d4a574"
            metalness={1}
            roughness={0.15}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Cap top decoration */}
        <mesh position={[0, 1.68, 0]} castShadow>
          <cylinderGeometry args={[0.34, 0.32, 0.08, 32]} />
          <meshStandardMaterial
            color="#e8c088"
            metalness={1}
            roughness={0.1}
          />
        </mesh>

        {/* Liquid inside (pink/rose) */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.82, 0.82, 1.6, 64]} />
          <meshPhysicalMaterial
            color="#ff6b9d"
            transmission={0.5}
            thickness={1.5}
            roughness={0.1}
            ior={1.4}
            transparent
            opacity={0.75}
          />
        </mesh>

        {/* Label - subtle front plate */}
        <mesh position={[0, -0.2, 0.91]}>
          <planeGeometry args={[1.0, 0.8]} />
          <meshStandardMaterial
            color="#fff5f8"
            metalness={0.2}
            roughness={0.5}
            transparent
            opacity={0.4}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function PerfumeBottle3D({ scrollProgress }: BottleProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 40 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        castShadow
      />
      <directionalLight
        position={[-3, 2, -5]}
        intensity={0.8}
        color="#ffaad4"
      />
      <pointLight position={[0, -3, 3]} intensity={0.5} color="#ff6b9d" />

      <Suspense fallback={null}>
        <Bottle scrollProgress={scrollProgress} />
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  );
}
