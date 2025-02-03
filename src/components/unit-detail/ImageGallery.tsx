'use client';

import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface OrderedImage {
  key: string;
  src: string;
  alt: string;
}

interface ImageGalleryProps {
  orderedImages?: OrderedImage[]; // 기본값으로 undefined 가능
}

export default function ImageGallery({ orderedImages = [] }: ImageGalleryProps) {
  // 모든 Hook은 항상 최상위에서 호출합니다.
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  // Hook은 항상 호출한 후, 조건부로 렌더링 결과를 결정합니다.
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // 만약 이미지가 없다면, JSX 내부에서 아무것도 렌더링하지 않도록 처리합니다.
  if (orderedImages.length === 0) {
    return null;
  }

  // 이미지 경로가 "/"로 시작하지 않으면 자동으로 "/" 추가
  const fixSrc = (src: string) => {
    if (!src) return '';
    return src.startsWith('/') ? src : `/${src}`;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    if (distance > 50 && currentIndex < orderedImages.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
    if (distance < -50 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
    document.body.style.overflow = !isFullscreen ? 'hidden' : 'auto';
  };

  const currentImg = orderedImages[currentIndex];
  const currentFixedSrc = fixSrc(currentImg.src);

  const FullscreenGallery = () => {
    const fullFixedSrc = fixSrc(currentImg.src);

    return (
      <div className="fixed inset-0 bg-black z-50 touch-none">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleFullscreenToggle}
            className="p-2 rounded-full bg-white/10 text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div
          className="h-full w-full flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={fullFixedSrc}
            alt={currentImg.alt}
            title={currentImg.alt}
            className={`w-full h-full object-contain transition-transform duration-300 ${
              isSwiping ? 'scale-95' : 'scale-100'
            }`}
            fill
            sizes="100vw"
            priority
          />
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="bg-black/50 rounded-full px-4 py-2 text-white text-sm">
            {currentIndex + 1} / {orderedImages.length}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* 메인 이미지 */}
      <div className="relative aspect-[4/3] md:aspect-[16/10] rounded-lg overflow-hidden bg-gray-50">
        <div
          className="relative w-full h-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={currentFixedSrc}
            alt={currentImg.alt}
            title={currentImg.alt}
            priority
            className={`object-contain transition-transform duration-300 ${
              isSwiping ? 'scale-95' : 'scale-100'
            }`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1728px) 66vw"
          />
        </div>

        <button
          onClick={handleFullscreenToggle}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm transition-all z-10"
        >
          <ZoomIn className="w-4 h-4 text-gray-700" />
        </button>

        {orderedImages.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === 0 ? orderedImages.length - 1 : prev - 1
                )
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm transition-all z-10 md:hidden"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === orderedImages.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm transition-all z-10 md:hidden"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {orderedImages.length > 1 && (
        <div className="flex justify-center md:hidden">
          <div className="flex gap-1.5">
            {orderedImages.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full ${
                  currentIndex === idx ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {orderedImages.length > 1 && (
        <div className="hidden md:flex gap-2 overflow-x-auto pb-1 snap-x scrollbar-hide">
          {orderedImages.map((img, idx) => {
            const thumbSrc = fixSrc(img.src);
            return (
              <button
                key={img.key + idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative aspect-square w-24 flex-shrink-0 snap-start rounded-md overflow-hidden ${
                  currentIndex === idx
                    ? 'ring-2 ring-blue-500 ring-offset-1'
                    : 'opacity-60 hover:opacity-100 transition-opacity'
                }`}
                title={img.alt}
              >
                <Image
                  src={thumbSrc}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            );
          })}
        </div>
      )}

      {isFullscreen && <FullscreenGallery />}
    </div>
  );
}
