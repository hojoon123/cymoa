'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Map, MapMarker, Roadview } from 'react-kakao-maps-sdk';
import useKakaoLoader from './useKakaoLoader';


interface RoadviewWithMiniMapProps {
    info: string; // 부모 컴포넌트에서 받을 주소 prop
}

export default function RoadviewWithMiniMap({ info }: RoadviewWithMiniMapProps) {
    const { loading, error } = useKakaoLoader();

    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [mapSize, setMapSize] = useState({ width: 300, height: 200 });
    const [isResizing, setIsResizing] = useState(false);

    // 지도 인스턴스를 저장하기 위한 ref
    const mapRef = useRef<kakao.maps.Map | null>(null);

    const startPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const startSizeRef = useRef<{ width: number; height: number }>({
        width: 300,
        height: 200,
    });

    useEffect(() => {
        if (loading || error) return;
        if (!info) return; // 주소가 없을 경우 처리
        console.log('주소 변경:', info);

        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(info, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                const newLocation = result[0];
                setLocation({
                    lat: parseFloat(newLocation.y),
                    lng: parseFloat(newLocation.x),
                });
            } else {
                console.log('주소를 찾을 수 없습니다.');
            }
        });
    }, [loading, error, info]); // address가 변경될 때마다 실행

    const handleRoadviewPositionChanged = useCallback((roadview: kakao.maps.Roadview) => {
        const latLng = roadview.getPosition();
        setLocation({ lat: latLng.getLat(), lng: latLng.getLng() });
    }, []);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsResizing(true);

            startPositionRef.current = {
                x: e.clientX,
                y: e.clientY,
            };
            startSizeRef.current = { ...mapSize };
        },
        [mapSize]
    );

    useEffect(() => {
        function onMouseMove(e: MouseEvent) {
            if (!isResizing) return;

            const dx = e.clientX - startPositionRef.current.x;
            const dy = e.clientY - startPositionRef.current.y;

            // 고정된 좌측 하단 기준: width는 dx만큼 증가, height는 -dy만큼 증가
            const newWidth = startSizeRef.current.width + dx;
            const newHeight = startSizeRef.current.height - dy;

            const minWidth = 200;
            const minHeight = 100;
            const maxWidth = 500;
            const maxHeight = 350;

            setMapSize({
                width: Math.max(minWidth, Math.min(newWidth, maxWidth)),
                height: Math.max(minHeight, Math.min(newHeight, maxHeight)),
            });
        }

        function onMouseUp() {
            setIsResizing(false);
        }

        if (isResizing) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [isResizing]);

    // 리사이즈가 끝난 후 지도에 relayout() 호출해서 크기 변경 반영
    useEffect(() => {
        if (!isResizing && mapRef.current) {
            mapRef.current.relayout();
        }
    }, [mapSize, isResizing]);

    if (loading) {
        return <div>카카오맵 로딩 중...</div>;
    }
    if (error) {
        return <div>카카오맵 로드 에러: {error.message}</div>;
    }
    if (!location) {
        return <div>지오코딩 중...</div>;
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: '500px' }}>
            {/* 로드뷰 */}
            <Roadview
                style={{ width: '100%', height: '100%' }}
                position={{
                    lat: location.lat,
                    lng: location.lng,
                    radius: 50,
                }}
                onPositionChanged={handleRoadviewPositionChanged}
            />

            {/* 미니맵 및 리사이즈 핸들(내부에 배치) */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 10,
                    width: mapSize.width,
                    height: mapSize.height,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    background: '#fff',
                    overflow: 'hidden',
                    transition: isResizing ? 'none' : 'width 0.2s, height 0.2s',
                }}
            >
                <Map
                    center={{ lat: location.lat, lng: location.lng }}
                    style={{ width: '100%', height: '100%' }}
                    level={3}
                    onCreate={(map) => {
                        mapRef.current = map;
                    }}
                >
                    <MapMarker position={{ lat: location.lat, lng: location.lng }} />
                </Map>
                {/* 리사이즈 핸들: 미니맵 내부 우측 상단 - 이미지로 대체 */}
                <img
                    src="/resize.png"
                    alt="Resize handle"
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 20,
                        height: 20,
                        cursor: 'nesw-resize',
                        zIndex: 9999,
                    }}
                    onMouseDown={handleMouseDown}
                />
            </div>
        </div>
    );
}
