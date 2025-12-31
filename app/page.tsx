'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import StarBackground from '@/components/StarBackground';
import Countdown from '@/components/Countdown';
import WishForm from '@/components/WishForm';
import WishList from '@/components/WishList';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleWishCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen relative">
      <StarBackground />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        {/* 헤더 */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 glow-text">
            2026 첫 소원 보드
          </h1>
          <p className="text-gray-400 mt-2">새해 소원을 남기고 함께 나눠요</p>
        </motion.header>

        {/* 카운트다운 */}
        <section className="mb-8">
          <Countdown />
        </section>

        {/* 소원 입력 폼 */}
        <section className="mb-10">
          <WishForm onWishCreated={handleWishCreated} />
        </section>

        {/* 구분선 */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5 }}
          className="h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent mb-8"
        />

        {/* 소원 목록 */}
        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl font-bold text-center text-gray-300 mb-6"
          >
            ✨ 모두의 소원
          </motion.h2>
          <WishList refreshTrigger={refreshTrigger} />
        </section>

        {/* 푸터 */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-gray-600 text-sm mt-12 pb-8"
        >
          <p>2026년, 모두의 소원이 이루어지길 🌟</p>
        </motion.footer>
      </div>
    </main>
  );
}
