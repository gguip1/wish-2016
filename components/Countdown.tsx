'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// 개별 숫자 컴포넌트 - 단순하고 안정적인 슬라이드 애니메이션
function Digit({ value, prevValue }: { value: string; prevValue: string }) {
  const hasChanged = value !== prevValue;

  return (
    <div className="relative w-[32px] md:w-[48px] h-[48px] md:h-[72px] bg-gradient-to-b from-[#2a2a4a] to-[#1a1a3a] rounded-lg overflow-hidden shadow-lg">
      {/* 중간 라인 (장식) */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/20 z-10" />

      {/* 숫자 애니메이션 */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={value}
          initial={{ y: hasChanged ? 30 : 0, opacity: hasChanged ? 0 : 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 35,
            mass: 1,
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-3xl md:text-5xl font-bold text-yellow-400 font-mono drop-shadow-lg">
            {value}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Glow 효과 */}
      {hasChanged && (
        <motion.div
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{ boxShadow: "inset 0 0 20px rgba(255, 215, 0, 0.3)" }}
        />
      )}
    </div>
  );
}

// 두 자리 숫자 블록
function TimeBlock({ value, prevValue, label }: { value: number; prevValue: number; label: string }) {
  const current = String(value).padStart(2, '0');
  const prev = String(prevValue).padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-1">
        <Digit value={current[0]} prevValue={prev[0]} />
        <Digit value={current[1]} prevValue={prev[1]} />
      </div>
      <span className="text-xs md:text-sm text-gray-400 mt-2 font-medium tracking-wide">{label}</span>
    </div>
  );
}

// 콜론 구분자
function Separator() {
  return (
    <div className="flex flex-col justify-center items-center gap-2 px-1 md:px-2 h-[48px] md:h-[72px]">
      <motion.div
        animate={{
          opacity: [1, 0.3, 1],
          scale: [1, 0.9, 1]
        }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/30"
      />
      <motion.div
        animate={{
          opacity: [1, 0.3, 1],
          scale: [1, 0.9, 1]
        }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/30"
      />
    </div>
  );
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [prevTimeLeft, setPrevTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isNewYear, setIsNewYear] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const initialized = useRef(false);
  const prevTimeRef = useRef<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const fireConfetti = useCallback(() => {
    const duration = 5000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffd700', '#ff6b6b', '#fff', '#87ceeb'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffd700', '#ff6b6b', '#fff', '#87ceeb'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  useEffect(() => {
    const targetDate = new Date('2026-01-01T00:00:00');

    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setIsNewYear(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      if (difference <= 10000) {
        setIsUrgent(true);
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // 초기화
    const initialTime = calculateTimeLeft();
    setTimeLeft(initialTime);
    setPrevTimeLeft(initialTime);
    prevTimeRef.current = initialTime;

    const timer = setInterval(() => {
      const current = prevTimeRef.current;
      const updated = calculateTimeLeft();
      setPrevTimeLeft(current);
      prevTimeRef.current = updated;
      setTimeLeft(updated);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 새해가 되면 폭죽 발사 (별도 effect)
  useEffect(() => {
    if (isNewYear && !initialized.current) {
      initialized.current = true;
      fireConfetti();
    }
  }, [isNewYear, fireConfetti]);

  if (isNewYear) {
    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-8"
      >
        <motion.h2
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-3xl md:text-5xl font-bold text-yellow-400 drop-shadow-lg"
          style={{ textShadow: "0 0 30px rgba(255, 215, 0, 0.5)" }}
        >
          🎆 2026 새해 복 많이 받으세요! 🎆
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 mt-4"
        >
          새해 첫 소원을 남겨보세요!
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="text-center py-6"
      animate={isUrgent ? { scale: [1, 1.02, 1] } : {}}
      transition={isUrgent ? { repeat: Infinity, duration: 0.5 } : {}}
    >
      <motion.h2
        className="text-lg md:text-xl text-gray-300 mb-6 font-medium"
        animate={isUrgent ? { color: ["#d1d5db", "#ef4444", "#d1d5db"] } : {}}
        transition={isUrgent ? { repeat: Infinity, duration: 0.5 } : {}}
      >
        {isUrgent ? "🔥 곧 새해입니다! 🔥" : "2026년까지"}
      </motion.h2>

      <div className="flex justify-center items-start gap-1 md:gap-2">
        <TimeBlock value={timeLeft.days} prevValue={prevTimeLeft.days} label="일" />
        <Separator />
        <TimeBlock value={timeLeft.hours} prevValue={prevTimeLeft.hours} label="시간" />
        <Separator />
        <TimeBlock value={timeLeft.minutes} prevValue={prevTimeLeft.minutes} label="분" />
        <Separator />
        <TimeBlock value={timeLeft.seconds} prevValue={prevTimeLeft.seconds} label="초" />
      </div>

      {/* 프로그레스 바 */}
      <motion.div
        className="mt-8 mx-auto max-w-sm h-1.5 bg-gray-800/50 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
          style={{ width: `${((60 - timeLeft.seconds) / 60) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}
