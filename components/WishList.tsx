'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WishCard from './WishCard';

interface Wish {
  id: number;
  content: string;
  likes: number;
  created_at: string;
}

interface WishListProps {
  refreshTrigger: number;
}

export default function WishList({ refreshTrigger }: WishListProps) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishes = useCallback(async () => {
    try {
      const res = await fetch('/api/wishes');
      const data = await res.json();
      setWishes(data.wishes || []);
    } catch (error) {
      console.error('Failed to fetch wishes:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 초기 로드 및 refreshTrigger 변경 시 갱신
  useEffect(() => {
    fetchWishes();
  }, [fetchWishes, refreshTrigger]);

  // 5초마다 자동 갱신
  useEffect(() => {
    const interval = setInterval(fetchWishes, 5000);
    return () => clearInterval(interval);
  }, [fetchWishes]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (wishes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-gray-400 text-lg">아직 소원이 없어요</p>
        <p className="text-gray-500 text-sm mt-2">첫 번째 소원을 남겨보세요! ✨</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {wishes.map((wish, index) => (
          <WishCard key={wish.id} wish={wish} index={index} />
        ))}
      </AnimatePresence>
    </div>
  );
}
