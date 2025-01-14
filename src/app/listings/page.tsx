// 파일: src/app/listings/page.tsx
import FilterSection from '@/components/listingpage/FilterSection'
import PaginationBar from '@/components/listingpage/PaginationBar'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { fetchListings } from '@/service/api/fetchListings'
import {
    formatKoreanMoney,
    formatSizeKR
} from '@/utils/formatUtils'
import { ArrowUpDown, MapPin, Package2, Search } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '청약 모집공고 - SSR 단일 조회 예시',
  description: '서버 사이드 페이지네이션 & 한 번에 조회하기 버튼'
}

// 주택유형 별 색상
const houseTypeColors: Record<string, string> = {
  '행복주택': 'bg-rose-500',
  '국민임대': 'bg-violet-500',
  '공공임대': 'bg-emerald-500',
  '전세임대': 'bg-amber-500'
}

type ListingsPageProps = {
  searchParams: {
    page?: string
    region?: string | string[]
    deposit?: string
    monthly?: string
    houseTypes?: string | string[]
    sizes?: string | string[]
  }
}

export default async function ListingsPage(props: ListingsPageProps) {
  // ❶ 꼭 await 를 통해 가져오기
  const searchParams = await props.searchParams

  // ❷ 이후부턴 기존 코드 동일
  const pageParam = searchParams.page ? parseInt(searchParams.page, 10) : 1
  const depositSort = searchParams.deposit || ''
  const monthlySort = searchParams.monthly || ''

  let selectedRegions: string[] = []
  if (searchParams.region) {
    selectedRegions = Array.isArray(searchParams.region)
      ? searchParams.region
      : [searchParams.region]
  }

  let selectedHouseTypes: string[] = []
  if (searchParams.houseTypes) {
    selectedHouseTypes = Array.isArray(searchParams.houseTypes)
      ? searchParams.houseTypes
      : [searchParams.houseTypes]
  }

  let selectedSizes: string[] = []
  if (searchParams.sizes) {
    selectedSizes = Array.isArray(searchParams.sizes)
      ? searchParams.sizes
      : [searchParams.sizes]
  }

  // 2) 서버 사이드에서 호출
  const data = await fetchListings({
    page: pageParam,
    itemsPerPage: 8,
    depositSort,
    monthlySort,
    regions: selectedRegions,
    houseTypes: selectedHouseTypes,
    sizes: selectedSizes
  })
  const { listings, totalCount } = data

  // 3) SSR로 렌더링
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">🔥청약 모집공고🔥</h1>
          <p className="text-gray-600 font-medium">전국의 청약 모집 공고를 확인해보세요 🤫</p>
        </div>

        {/* 필터 박스 (Card) + (CardContent) => 박스 형태 유지 */}
        <Card className="mb-8 border border-gray-200">
          <CardContent className="p-6">
            <FilterSection />
          </CardContent>
        </Card>

        {/* 결과 컨트롤 섹션 */}
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

        {/* 공고 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {listings.map((listing) => {
            const typeColor = houseTypeColors[listing.type] || 'bg-blue-500'
            return (
              <Card
                key={listing.id}
                className="group hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200"
              >
                <Link href={`/listings/${listing.id}`}>
                  <CardContent className="p-0">
                    <div className="relative">
                      {listing.thumbnail ? (
                        <img
                          src={listing.thumbnail}
                          alt={listing.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          이미지 없음
                        </div>
                      )}
                      <span className={`absolute top-4 right-4 px-3 py-1 text-white text-sm rounded-lg shadow-lg ${typeColor}`}>
                        {listing.type}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">
                        {listing.title}
                      </h3>
                      <div className="space-y-2">
                        <p className="text-gray-600 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {listing.location}
                        </p>
                        <p className="text-gray-600 flex items-center gap-2">
                          <Package2 className="w-4 h-4 text-gray-400" />
                          {formatKoreanMoney(listing.deposit)}
                        </p>
                        <p className="text-gray-600 flex items-center gap-2">
                          <ArrowUpDown className="w-4 h-4 text-gray-400" />
                          {formatKoreanMoney(listing.rent)}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
                          <span className="px-2 py-1 bg-gray-50 rounded-lg border border-gray-200">
                          {formatSizeKR(listing.size)}
                          </span>
                          <span className="px-2 py-1 bg-gray-50 rounded-lg border border-gray-200">
                            {listing.period}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>

        {/* 페이지네이션 */}
        <PaginationBar
          currentPage={pageParam}
          totalCount={totalCount}
          itemsPerPage={8}
        />
      </div>
    </div>
  )
}
