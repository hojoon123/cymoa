"use client"

import { Button } from '@/components/ui/button'
import {
  ArrowUpDown,
  Building2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Package2,
  Search
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function FilterSection() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [showAllRegions, setShowAllRegions] = useState(false)

  // ================== 지역 ==================
  const mainRegions = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산']
  const additionalRegions = ['세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']
  
  // region=서울,경기 => searchParams.get('region') = "서울,경기"
  const regionParam = searchParams.get('region') || ''
  const regionsInURL = regionParam ? regionParam.split(',') : []
  const [selectedRegions, setSelectedRegions] = useState<string[]>(regionsInURL)

  // ================== 보증금 정렬 ==================
  const [depositSort, setDepositSort] = useState(searchParams.get('deposit') || '')

  // ================== 월세 정렬 ==================
  const [monthlySort, setMonthlySort] = useState(searchParams.get('monthly') || '')

  // ================== 주택유형 ==================
  const houseTypes = ['행복주택', '국민임대', '공공임대', '전세임대']
  const houseTypesParam = searchParams.get('houseTypes') || ''
  const houseTypesInURL = houseTypesParam ? houseTypesParam.split(',') : []
  const [selectedHouseTypes, setSelectedHouseTypes] = useState<string[]>(houseTypesInURL)

  // ================== 평수 필터 (OR) ==================
  const sizeLabelToRange: Record<string, string> = {
    '10평 이하': '0.0,10.0',
    '10평~15평': '10.0,15.0',
    '15평~20평': '15.0,20.0',
    '20평~25평': '20.0,25.0',
    '25평 이상': '25.0,'
  }
  const sizes = Object.keys(sizeLabelToRange) // ["10평 이하","10평~15평", ...]

  // ?sizes=0.0,10.0|15.0,20.0 => split('|')
  const sizesParam = searchParams.get('sizes') || ''
  const sizesInURL = sizesParam ? sizesParam.split('|') : []
  // e.g. ["0.0,10.0","15.0,20.0"]

  const [selectedSizes, setSelectedSizes] = useState<string[]>(sizesInURL)

  // ============== 토글 함수들 ==============
  const toggleRegion = (region: string) => {
    setSelectedRegions(prev =>
      prev.includes(region)
        ? prev.filter(r => r !== region)
        : [...prev, region]
    )
  }

  const toggleDepositSort = (order: string) => {
    setDepositSort(prev => (prev === order ? '' : order))
  }

  const toggleMonthlySort = (order: string) => {
    setMonthlySort(prev => (prev === order ? '' : order))
  }

  const toggleHouseType = (type: string) => {
    setSelectedHouseTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  /**
   * 평수 다중 선택 (OR)
   * "10평 이하","15평~20평" => ["0.0,10.0","15.0,20.0"]
   */
  const toggleSize = (label: string) => {
    const rangeStr = sizeLabelToRange[label]
    if (!rangeStr) return

    setSelectedSizes(prev => {
      // 이미 있으면 => 제거, 없으면 => 추가
      if (prev.includes(rangeStr)) {
        return prev.filter(r => r !== rangeStr)
      } else {
        return [...prev, rangeStr]
      }
    })
  }

  // ============== 조회하기 버튼 ==============
  const handleSearch = () => {
    const params = new URLSearchParams()

    // region (["서울","경기"] => "서울,경기")
    if (selectedRegions.length > 0) {
      params.set('region', selectedRegions.join(','))
    }

    // deposit
    if (depositSort) {
      params.set('deposit', depositSort)
    }

    // monthly
    if (monthlySort) {
      params.set('monthly', monthlySort)
    }

    // houseTypes => "행복주택,공공임대"
    if (selectedHouseTypes.length > 0) {
      params.set('houseTypes', selectedHouseTypes.join(','))
    }

    // sizes => "0.0,10.0|15.0,20.0|25.0,"
    if (selectedSizes.length > 0) {
      params.set('sizes', selectedSizes.join('|'))
    }

    // page=1
    params.set('page', '1')

    router.push(`/listings?${params.toString()}`)
  }

  // 지역 버튼 펼침/접기
  const currentRegions = showAllRegions
    ? [...mainRegions, ...additionalRegions]
    : mainRegions

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      {/* 지역 선택 섹션 */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" /> 지역
        </h3>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {currentRegions.map((region) => (
              <button
                key={region}
                onClick={() => toggleRegion(region)}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  selectedRegions.includes(region)
                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-200 font-semibold'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 font-medium'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAllRegions(!showAllRegions)}
            className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            {showAllRegions ? (
              <>
                지역 접기
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                더 많은 지역 보기
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* 보증금, 월세, 주택유형, 평수 필터 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* 보증금 필터 */}
        <div>
          <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2">
            <Package2 className="w-4 h-4 text-blue-500" /> 보증금
          </h3>
          <div className="flex gap-2 mt-2">
            {['낮은순', '높은순'].map((option) => (
              <button
                key={option}
                onClick={() => toggleDepositSort(option)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                  depositSort === option
                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-200 font-semibold'
                    : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* 월세 필터 */}
        <div>
          <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-blue-500" /> 월세
          </h3>
          <div className="flex gap-2 mt-2">
            {['낮은순', '높은순'].map((option) => (
              <button
                key={option}
                onClick={() => toggleMonthlySort(option)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                  monthlySort === option
                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-200 font-semibold'
                    : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* 주택유형 필터 */}
        <div>
          <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-500" /> 주택유형
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {houseTypes.map((type) => (
              <button
                key={type}
                onClick={() => toggleHouseType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                  selectedHouseTypes.includes(type)
                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-200 font-semibold'
                    : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 평수 필터 (다중 선택 OR) */}
        <div>
          <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" /> 평수
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {sizes.map((label) => {
              const rangeStr = sizeLabelToRange[label]
              return (
                <button
                  key={label}
                  onClick={() => toggleSize(label)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                    selectedSizes.includes(rangeStr)
                      ? 'bg-blue-100 text-blue-600 border-2 border-blue-200 font-semibold'
                      : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 조회하기 버튼 */}
      <div className="mt-6 flex justify-center">
        <Button
          onClick={handleSearch}
          variant="outline"
          className="px-6 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 font-semibold
            bg-white hover:bg-blue-100 hover:text-blue-600 hover:border-blue-200 text-gray-700 border border-gray-200"
        >
          <Search className="w-4 h-4" />
          조회하기
        </Button>
      </div>
    </div>
  )
}
