// 파일: src/app/listings/page.tsx
import FilterSection from '@/components/listingpage/FilterSection';
import PaginationBar from '@/components/listingpage/PaginationBar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { fetchUnits } from '@/service/api/fetchUnits';
import {
  formatKoreanMoney,
  formatSizeKR
} from '@/utils/formatUtils';
import { Coins, DollarSign, MapPin, Ruler, Search } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '청약 모집공고 - SSR 단일 조회 예시',
  description: '서버 사이드 페이지네이션 & 한 번에 조회하기 버튼'
}

type CustomSearchParams = {
  page?: string;
  region?: string | string[];
  deposit_min?: string;
  deposit_max?: string;
  rent_min?: string;
  rent_max?: string;
  houseTypes?: string | string[];
  sizes?: string | string[];
  status?: string;
  residents?: string | string[];
};

// Next.js 내부 타입 검사와 맞추기 위해 searchParams를 Promise 타입으로 지정
type ListingsPageProps = {
  searchParams: Promise<CustomSearchParams>;
};

export default async function ListingsPage(props: ListingsPageProps) {
  const searchParams = await props.searchParams;

  // 페이지 파라미터
  const pageParam = searchParams.page ? parseInt(searchParams.page, 10) : 1;

  // 지역
  let selectedRegions: string[] = [];
  if (searchParams.region) {
    selectedRegions = Array.isArray(searchParams.region)
      ? searchParams.region
      : [searchParams.region];
  }

  // 주택유형
  let selectedHouseTypes: string[] = [];
  if (searchParams.houseTypes) {
    selectedHouseTypes = Array.isArray(searchParams.houseTypes)
      ? searchParams.houseTypes
      : [searchParams.houseTypes];
  }

  // 평수
  let selectedSizes: string[] = [];
  if (searchParams.sizes) {
    selectedSizes = Array.isArray(searchParams.sizes)
      ? searchParams.sizes
      : [searchParams.sizes];
  }

  // 보증금/월세
  const deposit_min = searchParams.deposit_min || '';
  const deposit_max = searchParams.deposit_max || '';
  const rent_min = searchParams.rent_min || '';
  const rent_max = searchParams.rent_max || '';

  // ✨ (추가) 공고상태(status)
  const status = searchParams.status || '';

  // ✨ (추가) 입주대상자(residents)
  let selectedResidents: string[] = [];
  if (searchParams.residents) {
    if (Array.isArray(searchParams.residents)) {
      selectedResidents = searchParams.residents;
    } else {
      selectedResidents = searchParams.residents.split(',');
    }
  }

  // -------------------------------------------
  // fetchUnits 호출 시 함께 넘김
  // -------------------------------------------
  const data = await fetchUnits({
    page: pageParam,
    itemsPerPage: 8,
    regions: selectedRegions,
    houseTypes: selectedHouseTypes,
    sizes: selectedSizes,
    deposit_min,
    deposit_max,
    rent_min,
    rent_max,
    status,
    residents: selectedResidents
  });

  const { listings, totalCount } = data;

  const houseTypeColors: Record<string, string> = {
    '행복주택': 'bg-rose-500',
    '국민임대': 'bg-violet-500',
    '공공임대': 'bg-emerald-500',
    '전세임대': 'bg-amber-500'
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">🔥청약 모집공고🔥</h1>
          <p className="text-gray-600 font-medium">전국의 청약 모집 공고를 확인해보세요 🤫</p>
        </div>

        <Card className="mb-8 border-0 md:border md:border-gray-200">
          <CardContent className="p-6 bg-gray-50 md:bg-transparent">
            <FilterSection />
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-6">
          <p className="text-sm font-semibold text-gray-600">
            총 {totalCount}건의 공고
          </p>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="아파트명으로 검색"
                className="pl-10 pr-4 py-2 w-64 font-medium"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {listings.map((listing) => {
            const typeColor = houseTypeColors[listing.house_types] || 'bg-blue-500';
            const displayTitle = `${listing.complex_name} ${listing.unit_type}`;
            return (
              <Card
                key={listing.id}
                className="group hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200"
              >
                <Link href={`/listings/${listing.id}`}>
                  <CardContent className="p-0">
                    <div className="relative">
                        {listing.images ? (
                        <Image
                          src={`/${listing.images}`}
                          alt={listing.complex_name}
                          width={600}
                          height={400}
                          priority
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          이미지 없음
                        </div>
                        )}
                      <span className={`absolute top-4 right-4 px-3 py-1 text-white text-sm rounded-lg shadow-lg ${typeColor}`}>
                        {listing.house_types}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">
                        {displayTitle}
                      </h3>
                      <div className="space-y-2">
                        <p className="text-gray-600 flex items-center gap-2">
                          <Ruler className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-sm">넓이:</span>
                          {formatSizeKR(listing.exclusive_area_pyeong)} ({listing.exclusive_area_m2}m²)
                        </p>
                        <p className="text-gray-600 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-sm">보증금:</span>
                          {formatKoreanMoney(listing.deposit_min)} ~ {formatKoreanMoney(listing.deposit_max)}
                        </p>
                        <p className="text-gray-600 flex items-center gap-2">
                          <Coins className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-sm">월세:</span>
                          {formatKoreanMoney(listing.rent_min)} ~ {formatKoreanMoney(listing.rent_max)}
                        </p>
                        <p className="text-gray-600 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-sm">지역:</span>
                          {listing.region}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
                          <span className="px-2 py-1 bg-white-500 rounded-lg border border-gray-200">
                            📅 신청 기간
                          </span>
                          {listing.general_supply_date_start && listing.general_supply_date_end && (
                            <span className="px-1 py-1 bg-gray-50 rounded-lg border border-gray-200">
                              {listing.general_supply_date_start} ~ {listing.general_supply_date_end}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>

        <PaginationBar
          currentPage={pageParam}
          totalCount={totalCount}
          itemsPerPage={8}
        />
      </div>
    </div>
  )
}
