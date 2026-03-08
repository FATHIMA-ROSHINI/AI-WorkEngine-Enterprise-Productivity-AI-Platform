'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useMeshStore } from '@/store/meshStore';

function PointCloud() {
  const ref = useRef<THREE.Points>(null!);
  const activeAgent = useMeshStore((state) => state.activeAgent);
  
  const sphere = useMemo(() => {
    const points = new Float32Array(500 * 3); // Fewer, larger points for minimalism
    for (let i = 0; i < 500; i++) {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.0 + Math.random() * 0.1;
      points[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      points[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      points[i * 3 + 2] = r * Math.cos(phi);
    }
    return points;
  }, []);

  const color = useMemo(() => {
    switch (activeAgent) {
      case 'Architect': return '#E0E7FF';
      case 'Security': return '#FCE7F3';
      case 'Coder': return '#D1FAE5';
      case 'Reviewer': return '#FEF9C3';
      case 'Quality': return '#FFEDD5';
      case 'Infra': return '#E0F2FE';
      default: return '#6366F1';
    }
  }, [activeAgent]);

  useFrame((state, delta) => {
    ref.current.rotation.x += delta / 20;
    ref.current.rotation.y += delta / 25;
  });

  return (
    <group>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={color}
          size={0.15} // Large playful circles
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.NormalBlending}
          opacity={0.4}
        />
      </Points>
    </group>
  );
}

export default function MeshBrain() {
  return (
    <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
        <ambientLight intensity={1} />
        <PointCloud />
      </Canvas>
    </div>
  );
}
