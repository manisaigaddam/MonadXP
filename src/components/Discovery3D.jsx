import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
  position: relative;
`;

// Particle component representing an app
function AppParticle({ app, position, onClick, isRecommended }) {
  const meshRef = useRef();
  const [hovered, setHovered] = React.useState(false);
  
  // Animate particle
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      
      // Float animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      
      // Scale on hover
      const scale = hovered ? 1.5 : (isRecommended ? 1.2 : 1);
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });
  
  const color = isRecommended 
    ? new THREE.Color(0x836ef9) // Monad purple
    : hovered 
      ? new THREE.Color(0x00ff00) // Green on hover
      : new THREE.Color(0x888888); // Gray default
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick(app);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
      {hovered && (
        <Html distanceFactor={10} position={[0, 0.5, 0]}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}>
            {app.name}
          </div>
        </Html>
      )}
    </mesh>
  );
}

// Main 3D scene
function Scene({ apps, recommendedIds, onAppClick }) {
  const particles = useMemo(() => {
    const count = apps.length;
    const radius = 5;
    
    return apps.map((app, i) => {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 3;
      
      return {
        app,
        position: [x, y, z],
        isRecommended: recommendedIds.includes(app.id)
      };
    });
  }, [apps, recommendedIds]);
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#836ef9" />
      
      {particles.map((particle, i) => (
        <AppParticle
          key={particle.app.id}
          app={particle.app}
          position={particle.position}
          onClick={onAppClick}
          isRecommended={particle.isRecommended}
        />
      ))}
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
      />
    </>
  );
}

export const Discovery3D = ({ apps, recommendedIds, onAppClick }) => {
  return (
    <Container>
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <Scene 
          apps={apps} 
          recommendedIds={recommendedIds}
          onAppClick={onAppClick}
        />
      </Canvas>
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        color: '#fff',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <div>🟣 Purple = Recommended</div>
        <div>🟢 Green = Hover</div>
        <div>Click to explore apps</div>
      </div>
    </Container>
  );
};

