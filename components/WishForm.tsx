'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface WishFormProps {
  onWishCreated: () => void;
}

export default function WishForm({ onWishCreated }: WishFormProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const charCount = content.length;
  const isNearLimit = charCount >= 80;
  const isOverLimit = charCount > 100;

  const fireSuccessConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffd700', '#ff6b6b', '#fff', '#87ceeb'],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isOverLimit || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '소원 등록에 실패했습니다');
      }

      setContent('');
      fireSuccessConfetti();
      onWishCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="2026년 새해 소원을 남겨주세요..."
          className="w-full p-4 bg-[#1a1a3a]/80 border border-yellow-400/30 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
          rows={3}
          disabled={isLoading}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span
            className={`text-sm transition-colors ${
              isOverLimit
                ? 'text-red-500'
                : isNearLimit
                ? 'text-yellow-400'
                : 'text-gray-500'
            }`}
          >
            {charCount}/100
          </span>
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-sm mt-2"
        >
          {error}
        </motion.p>
      )}

      <motion.button
        type="submit"
        disabled={!content.trim() || isOverLimit || isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full mt-4 py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
          !content.trim() || isOverLimit || isLoading
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 glow'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            보내는 중...
          </span>
        ) : (
          '✨ 소원 보내기'
        )}
      </motion.button>
    </motion.form>
  );
}
