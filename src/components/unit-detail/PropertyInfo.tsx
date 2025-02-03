'use client';

import {
  BuildingIcon,
  ClockIcon,
  HomeIcon,
  MapPinIcon,
  UsersIcon,
} from 'lucide-react';
import Script from 'next/script';
import { useEffect } from 'react';

interface PropertyInfoProps {
  unitInfo: {
    area: string;             // ex) "21.39m² (6.5평)"
    residents: string[];      // ex) ["대학생", "청년", ...]
    period: number;           // ex) 2
    supply: number | string;  // ex) 18
    type: string;             // ex) "행복주택"
  };
}

interface InfoItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

const InfoItem = ({ icon: Icon, label, value }: InfoItemProps) => (
  <div className="flex items-start gap-3 py-3 border-b last:border-none">
    <div className="p-1.5 rounded-lg bg-gray-50">
      <Icon className="w-4 h-4 text-gray-900" />
    </div>
    <div className="min-w-0">
      <p className="text-base md:text-base font-medium text-gray-500 mb-0.5">{label}</p>
      <p className="text-lg md:text-lg text-gray-900 break-words">{value}</p>
    </div>
  </div>
);

export default function PropertyInfo({ unitInfo }: PropertyInfoProps) {
  // 입주 대상자 처리: '기타'를 '공고 확인 필요'로 대체
  const processedResidents = unitInfo.residents.map((resident) =>
    resident === '기타' ? '공고 확인 필요' : resident
  );
  // 중복 제거 (예: '기타'가 여러 번 포함된 경우)
  const uniqueResidents = Array.from(new Set(processedResidents));

  // 정보 목록
  const infoItems = [
    { icon: HomeIcon, label: '전용면적', value: unitInfo.area },
    {
      icon: UsersIcon,
      label: '입주 대상자',
      value: Array.isArray(unitInfo.residents)
        ? uniqueResidents.join(', ')
        : '미정',
    },
    { icon: ClockIcon, label: '최대 거주 기간', value: `${unitInfo.period}년` },
    { icon: MapPinIcon, label: '공급 세대수', value: `${unitInfo.supply}세대` },
    { icon: BuildingIcon, label: '공급 유형', value: unitInfo.type },
  ];

  // 카카오 SDK 초기화 (클라이언트 사이드에서 한 번만 실행)
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Kakao) {
      const Kakao = (window as any).Kakao;
      if (!Kakao.isInitialized()) {
        // NEXT_PUBLIC_KAKAO_KEY 환경변수에 앱 키를 넣어두세요.
        Kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY);
      }
    }
  }, []);

  // 카카오톡 플러스친구 추가 버튼 클릭 핸들러
  const handleKakaoPlusFriend = () => {
    if (typeof window !== 'undefined' && (window as any).Kakao) {
      const Kakao = (window as any).Kakao;
      // 위 useEffect에서 초기화했으므로 바로 채널 추가 메서드를 호출합니다.
      Kakao.Channel.addChannel({
        // 채널의 public id (예: '_HKFKn')를 넣어주세요.
        channelPublicId: '_HKFKn',
      });
    } else {
      console.error('Kakao SDK가 로드되지 않았습니다.');
    }
  };

  return (
    <section className="space-y-4">
      {/* Kakao SDK 스크립트 로드 (클라이언트 사이드에서만 로드됨) */}
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.min.js"
        strategy="afterInteractive"
      />

      {/* 1) 상단 헤더 부분 */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-blue-50">
          <BuildingIcon className="w-4 h-4 text-blue-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          주택 정보
        </h2>
      </div>

      {/* 2) 정보 박스 및 카카오톡 플러스친구 추가 버튼 */}
      <div className="rounded-lg border bg-white p-4">
        <div className="font-semibold">
          {infoItems.map((item) => (
            <InfoItem key={item.label} {...item} />
          ))}
        </div>
        <div className="mt-4">
          <button
            onClick={handleKakaoPlusFriend}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-md bg-[#FEE500] text-black font-semibold text-base"
          >
            {/* 카카오톡 아이콘 (예시 SVG) */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 0C4.02944 0 0 3.67224 0 8.19886C0 11.0551 1.62868 13.5393 4.122 15.172L3.65839 17.5598C3.61583 17.8015 3.898 17.9827 4.09144 17.8055L7.30695 14.9557C7.87117 15.0346 8.43686 15.0748 9 15.0748C13.9706 15.0748 18 11.4026 18 6.87601C18 2.34941 13.9706 0 9 0Z"
                fill="#3B1E1E"
              />
            </svg>
            플러스친구 추가하고 신청 방법 알아보기
          </button>
        </div>
      </div>
    </section>
  );
}
