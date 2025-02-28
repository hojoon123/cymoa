'use client';

import { useKakaoLoader as useKakaoLoaderOrigin } from 'react-kakao-maps-sdk';

export default function useKakaoLoader() {
    // 원본 훅이 배열로 반환한다고 가정
    const [loading, error] = useKakaoLoaderOrigin({
        appkey: '64bd844c1faf478249116e7d9dafba98',
        libraries: ['clusterer', 'drawing', 'services'],
    });

    // 객체로 리턴
    return {
        loading,
        error,
    };
}
