export async function fetchUnitDetail(unitId: string | number) {
    let baseURL = process.env.NEXT_PUBLIC_API_BASE || '';
    
    // baseURL이 빈 문자열이면, 로컬 호스트로 fallback:
    if (!baseURL) {
      baseURL = 'http://127.0.0.1:8000';
    }
  
    // 혹은, new URL()을 사용해 유효성 체크:
    let finalUrl: string;
    try {
      finalUrl = new URL(`/api/units/${unitId}/`, baseURL).toString();
    } catch (err) {
      // 만약 baseURL이 "http//127.0.0.1:8000" (콜론 누락) 같은 형식이면 여기서 에러
      console.error('Invalid baseURL:', baseURL, err);
      // fallback 처리
      finalUrl = `http://127.0.0.1:8000/api/units/${unitId}/`;
    }
  
    const res = await fetch(finalUrl, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch unit detail: ${res.status}`);
    }
    return await res.json();
  }
  