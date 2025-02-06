// 파일: global.d.ts
// (Next.js 프로젝트에서는 tsconfig.json "include"에 추가되어 있어야 함)

export interface KakaoType {
    isInitialized(): boolean;
    init(key: string): void;
    Channel: {
      addChannel(options: { channelPublicId: string }): void;
    };
    Share: {
      sendDefault(options: {
        objectType: string;
        content: {
          title: string;
          description: string;
          imageUrl?: string;
          link: {
            mobileWebUrl: string;
            webUrl: string;
          };
        };
        buttons?: {
          title: string;
          link: {
            mobileWebUrl: string;
            webUrl: string;
          };
        }[];
      }): void;
      // 필요한 메서드 추가 가능
    };
  }
  
  declare global {
    interface Window {
      Kakao?: KakaoType;
    }
  }
  
  // 아무 export도 없어야 "global" 확장이 정상 동작하므로
  export { };
  