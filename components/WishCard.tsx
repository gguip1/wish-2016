'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Wish {
  id: number;
  content: string;
  likes: number;
  created_at: string;
}

interface WishCardProps {
  wish: Wish;
  index: number;
}

function getRelativeTime(dateString: string): string {
  // DB에서 로컬 시간으로 저장됨 (타임존 없이 파싱)
  const date = new Date(dateString.replace(' ', 'T'));
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 0) return '방금 전';
  if (diffInSeconds < 10) return '방금 전';
  if (diffInSeconds < 60) return `${diffInSeconds}초 전`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}일 전`;
}

export default function WishCard({ wish, index }: WishCardProps) {
  const [likes, setLikes] = useState(wish.likes || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [justLiked, setJustLiked] = useState(false);

  // props가 변경되면 likes 업데이트 (폴링 반영)
  useEffect(() => {
    setLikes(wish.likes || 0);
  }, [wish.likes]);

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    setJustLiked(true);

    try {
      const res = await fetch(`/api/wishes/${wish.id}/like`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        setLikes(data.wish.likes);
      }
    } catch (error) {
      console.error('Failed to like:', error);
    } finally {
      setIsLiking(false);
      setTimeout(() => setJustLiked(false), 300);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.05,
        duration: 0.3,
        ease: 'easeOut',
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)',
      }}
      className="bg-gradient-to-br from-[#1a1a3a]/90 to-[#2a2a4a]/90 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-4 transition-colors hover:border-yellow-400/40"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">💫</span>
        <div className="flex-1 min-w-0">
          <p className="text-white text-base leading-relaxed break-words">
            {wish.content}
          </p>
          <div className="flex items-center justify-between mt-3">
            <p className="text-gray-500 text-xs">
              {getRelativeTime(wish.created_at)}
            </p>
            <motion.button
              onClick={handleLike}
              disabled={isLiking}
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 active:bg-pink-500/40"
            >
              <motion.span
                animate={justLiked ? { scale: [1, 1.5, 1] } : {}}
                transition={{ duration: 0.3 }}
                className="text-lg"
              >
                ❤️
              </motion.span>
              <span>{likes}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
