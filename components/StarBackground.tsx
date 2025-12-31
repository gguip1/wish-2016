'use client';

import { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function StarBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < 100; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          delay: Math.random() * 3,
          duration: Math.random() * 2 + 1,
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#1a1a3a]" />

      {/* 별들 */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}

      {/* 빛나는 큰 별 몇 개 */}
      <div
        className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-pulse"
        style={{ left: '20%', top: '15%', boxShadow: '0 0 10px 2px rgba(255, 215, 0, 0.5)' }}
      />
      <div
        className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-pulse"
        style={{ left: '80%', top: '25%', boxShadow: '0 0 10px 2px rgba(255, 215, 0, 0.5)', animationDelay: '0.5s' }}
      />
      <div
        className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-pulse"
        style={{ left: '60%', top: '10%', boxShadow: '0 0 10px 2px rgba(255, 215, 0, 0.5)', animationDelay: '1s' }}
      />
    </div>
  );
}
