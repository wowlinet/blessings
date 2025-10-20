'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import BlessingDetail from './BlessingDetail';

interface BlessingModalProps {
  id: string;
}

export default function BlessingModal({ id }: BlessingModalProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  // 关闭模态框
  const closeModal = () => {
    router.back();
  };

  // ESC键关闭
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // 防止背景滚动
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // 背景点击关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      closeModal();
    }
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* 关闭按钮 */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* 内容区域 */}
        <div className="overflow-y-auto max-h-[90vh]">
          <BlessingDetail id={id} isModal={true} />
        </div>
      </div>
    </div>
  );
}