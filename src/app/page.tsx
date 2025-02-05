// src/app/page.tsx (Server Component)

import InputBar from '@/components/mainpage/InputBar';
import Image from 'next/image';

export const metadata = {
  title: '청약에대한모든것 - 메인',
  description: '청약에대한모든것 메인 페이지. 원하는 지역의 청약에 관한 공고를 쉽게 찾아보세요.'
  // etc... SSR SEO 메타 설정
}

export default function HomePage() {
  // 이 파일은 서버 컴포넌트이므로, DB에서 데이터를 가져오거나 SEO 최적화 작업 가능.
  // 클라이언트 측과 상호작용이 필요한 부분은 "use client" 컴포넌트에서 처리

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="h-screen flex flex-col items-center justify-center -mt-32">
          {/* 로고 섹션 (SSR로 렌더링) */}
          <div className="flex items-center gap-3 mb-2">
          <Image
            src="/cymoa/assets/Logo11.png"
            alt="청약 로고"
            width={240}
            height={240}
            className="object-contain max-w-[240px] w-auto h-auto sm:max-w-[200px] md:max-w-[240px] -translate-x-1 -translate-y-8"
          />
          </div>

          {/* 검색 컴포넌트 (CSR) */}
          <InputBar />
        </div>
      </div>
    </div>
  )
}
