import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const generateRandomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

const ParticleBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const particleCount = 100; // Adjust this number to change the density of particles

    const createParticle = () => {
      return {
        size: generateRandomNumber(1, 3),
        duration: generateRandomNumber(5, 15),
        delay: generateRandomNumber(0, 15),
        x: generateRandomNumber(0, 100),
        y: generateRandomNumber(0, 100),
      };
    };

    const particleArray = Array.from({ length: particleCount }, createParticle);
    setParticles(particleArray);

    // Function to update particle positions
    const updateParticles = () => {
      const updatedParticles = particles.map(particle => ({
        ...particle,
        x: (particle.x + generateRandomNumber(-1, 1)) % 100,
        y: (particle.y + generateRandomNumber(-1, 1)) % 100,
      }));
      setParticles(updatedParticles);
    };

    // Update particle positions every 100ms
    const interval = setInterval(updateParticles, 100);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [particles]);

  return (
    <ParticleContainer>
      {particles.map((particle, index) => (
        <Particle key={index} {...particle} />
      ))}
    </ParticleContainer>
  );
};

const ParticleContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
`;

const Particle = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: ${keyframes`
    from {
      transform: translate(0, 0);
    }
    to {
      transform: translate(-100vw, -100vh);
    }
  `} ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
  transform: translate(${props => props.x}vw, ${props => props.y}vh);
`;

export default ParticleBackground;
