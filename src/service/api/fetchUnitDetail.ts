// 파일: src/service/api/fetchUnitDetail.ts

import { BASE_URL } from '@/utils/constants'; // alias나 경로는 프로젝트 설정에 맞게 조정

export async function fetchUnitDetail(unitId: string | number) {
  // BASE_URL을 직접 사용하여 URL 생성
  let finalUrl: string;
  try {
    finalUrl = new URL(`/api/units/${unitId}/`, BASE_URL).toString();
  } catch (err) {
    console.error('Invalid BASE_URL:', BASE_URL, err);
    // 필요 시 fallback URL 처리 (예: 로컬 호스트)
    finalUrl = `http://127.0.0.1:8000/api/units/${unitId}/`;
  }

  const res = await fetch(finalUrl, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch unit detail: ${res.status}`);
  }
  return await res.json();
}
