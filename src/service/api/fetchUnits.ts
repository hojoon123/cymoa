// 파일: src/service/api/fetchUnits.ts

export interface UnitsParams {
  page?: number
  itemsPerPage?: number

  regions?: string[]       // 예: ["서울","경기"]
  houseTypes?: string[]    // 예: ["행복주택","국민임대"]
  sizes?: string[]         // 예: ["0.0,10.0","10.0,15.0"]

  deposit_min?: string     // "0"   (원 단위)
  deposit_max?: string     // "100000000" (1억?)
  rent_min?: string        // "0"
  rent_max?: string        // "1000000"

  // 👇 새로 추가
  status?: string          // "planned" | "ongoing" | "closed" | ""
  residents?: string[]     // ["고령자","가군(주거약자용)"]
}

export interface UnitItem {
  id: number
  images: string
  complex_name: string
  unit_type: string
  region: string
  house_types: string
  eligible_residents: string[]
  exclusive_area_m2: string
  exclusive_area_pyeong: string
  deposit_min: number
  deposit_max: number
  rent_min: number
  rent_max: number
  general_supply_date_start: string | null
  general_supply_date_end: string | null
}

export interface FetchUnitsResult {
  listings: UnitItem[]
  totalCount: number
}

export async function fetchUnits(params: UnitsParams): Promise<FetchUnitsResult> {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'
  const url = new URL('/api/units/', baseURL)

  // 1) 페이지네이션
  if (params.page) {
    url.searchParams.set('page', String(params.page))
  }
  if (params.itemsPerPage) {
    url.searchParams.set('page_size', String(params.itemsPerPage))
  }

  // 2) 지역
  if (params.regions && params.regions.length > 0) {
    // 여러 개면 &region=... 중복 or CSV
    // 여기서는 append → FilterSet에서 or로 받아들일 수도
    // 또는 set으로 CSV
    // (사용자 상황에 맞게 결정)
    params.regions.forEach((r) => {
      url.searchParams.append('region', r)
    })
  }

  // 3) 주택유형
  if (params.houseTypes && params.houseTypes.length > 0) {
    url.searchParams.set('house_types', params.houseTypes.join(','))
  }

  // 4) 평수
  if (params.sizes && params.sizes.length > 0) {
    url.searchParams.set('size', params.sizes.join(','))
  }

  // 5) 보증금/월세
  if (params.deposit_min) {
    url.searchParams.set('deposit_min', params.deposit_min)
  }
  if (params.deposit_max) {
    url.searchParams.set('deposit_max', params.deposit_max)
  }
  if (params.rent_min) {
    url.searchParams.set('rent_min', params.rent_min)
  }
  if (params.rent_max) {
    url.searchParams.set('rent_max', params.rent_max)
  }

  // 6) 👇 **공고상태**(status)
  if (params.status) {
    url.searchParams.set('status', params.status)
  }

  // 7) 👇 **입주대상자**(residents)
  if (params.residents && params.residents.length > 0) {
    // ["고령자","가군(주거약자용)"] → "고령자,가군(주거약자용)"
    url.searchParams.set('residents', params.residents.join(','))
  }

  // fetch
  const res = await fetch(url.toString(), {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch units: ${res.status}`)
  }

  // pagination data
  const drfData = await res.json()
  const results = drfData.results || drfData

  // mapping
  const listings: UnitItem[] = results.map((item: any) => ({
    id: item.id,
    images: item.images || '',
    complex_name: item.complex_name,
    unit_type: item.unit_type,
    region: item.region,
    house_types: item.house_types,
    eligible_residents: item.eligible_residents,
    exclusive_area_m2: item.exclusive_area_m2,
    exclusive_area_pyeong: item.exclusive_area_pyeong,
    deposit_min: item.deposit_min,
    deposit_max: item.deposit_max,
    rent_min: item.rent_min,
    rent_max: item.rent_max,
    general_supply_date_start: item.general_supply_date_start,
    general_supply_date_end: item.general_supply_date_end
  }))

  return {
    listings,
    totalCount: drfData.count ?? listings.length
  }
}
