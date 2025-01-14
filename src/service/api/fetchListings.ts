export interface ListingsParams {
    page?: number
    itemsPerPage?: number
    regions?: string[]
    depositSort?: string   // '낮은순' | '높은순' | ''
    monthlySort?: string   // '낮은순' | '높은순' | ''
    houseTypes?: string[]
    sizes?: string[]
  }
  
  export interface ListingItem {
    id: number
    thumbnail: string
    title: string
    location: string
    deposit: number
    rent: number
    period: string
    type: string
    size: number
    // regionName?: string  // region 필드의 name만 뽑고 싶다면 옵션으로 추가
  }
  
  export interface FetchListingsResult {
    listings: ListingItem[]
    totalCount: number
  }
  
  export async function fetchListings(params: ListingsParams): Promise<FetchListingsResult> {
    // 1) 기본 URL 구성 (env에서 불러오기)
    const baseURL = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'
    const url = new URL('/api/listings/', baseURL)
  
    // 2) DRF에 전달할 쿼리 파라미터 세팅 (page, page_size 등)
    //    - DRF에서 PageNumberPagination를 쓰면 ?page=1, ?page=2 식으로 작동
    if (params.page) {
      url.searchParams.set('page', String(params.page))
    }
    if (params.itemsPerPage) {
      // DRF에서 page_size 파라미터를 받도록 설정했을 수도 있음
      url.searchParams.set('page_size', String(params.itemsPerPage))
    }
  
    // 보증금/월세 정렬(예시):
    // DRF에서 ordering 필터가 제대로 설정되어 있어야 합니다 (ordering_fields = ['deposit', 'rent', ...])
    // 여기서는 임의로 `?ordering=deposit` or `?ordering=-deposit` 식으로 보냅니다.
    if (params.depositSort === '낮은순') {
      // 예: 오름차순 (deposit ASC)
      url.searchParams.set('ordering', 'deposit')
    } else if (params.depositSort === '높은순') {
      // 예: 내림차순 (deposit DESC)
      url.searchParams.set('ordering', '-deposit')
    }
  
    if (params.monthlySort === '낮은순') {
      url.searchParams.set('ordering', 'rent')
    } else if (params.monthlySort === '높은순') {
      url.searchParams.set('ordering', '-rent')
    }
  
    // 만약 regions, houseTypes, sizes 등을 필터링하려면
    // DRF에 SearchFilter나 DjangoFilterBackend 등을 설정해야 하며,
    // Back-end에서 어떻게 받을지 결정해야 합니다.
    // 아래는 예시로 region__name, type, size 등에 대한 in-filter를 구현했다고 가정.
    // (실제로는 Custom FilterSet 필요)
    if (params.regions && params.regions.length > 0) {
      // 여러 개일 경우 &region=서울&region=부산 식으로 보낼 수도 있고,
      // 혹은 1개만 선택해서 보낼 수도 있습니다.
      params.regions.forEach((r) => {
        url.searchParams.append('region', r)
      })
    }
  
    if (params.houseTypes && params.houseTypes.length > 0) {
        // "행복주택,국민임대" 식으로
        url.searchParams.set('houseTypes', params.houseTypes.join(','))
      }
  
    if (params.sizes && params.sizes.length > 0) {
        // 예: ["10.0","15.0"] -> "10.0,15.0"
        url.searchParams.set('sizes', params.sizes.join(','))
    }
  
    // 3) fetch 호출
    const res = await fetch(url.toString(), {
      // SSG/SWR를 원치 않는다면 `cache: 'no-store'` 설정
      cache: 'no-store',
    })
  
    if (!res.ok) {
      throw new Error(`Failed to fetch listings: ${res.status}`)
    }
  
    const drfData = await res.json()
  
    // 4) DRF PageNumberPagination 형태라면:
    //    drfData.count      => 전체 데이터 개수
    //    drfData.results    => 실제 목록 Array
    // 만약 pagination 비활성화했다면 drfData가 바로 배열일 수도 있습니다. 
    // (이 부분은 DRF 설정에 따라 달라집니다)
    const results = drfData.results || drfData  // pagination 없는 경우 대비
  
    // 5) ListingItem에 맞게 변환 (region.name 등 처리)
    const listings: ListingItem[] = results.map((item: any) => ({
      id: item.id,
      thumbnail: item.thumbnail || '',
      title: item.title,
      location: item.location,
      deposit: item.deposit,
      rent: item.rent,
      period: item.period,
      type: item.type,
      size: item.size,
      // regionName: item.region?.name ?? '',
    }))
  
    return {
      listings,
      totalCount: drfData.count ?? listings.length
    }
  }
  