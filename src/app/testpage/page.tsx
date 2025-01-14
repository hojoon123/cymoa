'use client'

import { Building2, GraduationCap } from 'lucide-react'
import { useEffect, useState } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

export default function TestPage() {
    const [mounted, setMounted] = useState(false)
  
    useEffect(() => {
      setMounted(true)
    }, [])
  
    if (!mounted) return null
  
    return (
      <div className="min-h-screen font-sans">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <img src="/assets/logo-type@2x.png" alt="ViewInter" className="h-8" />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-[#4B7BF5] text-white text-xs rounded-full">
                    NEW
                  </span>
                  <span className="cursor-pointer hover:text-[#4B7BF5] transition-all duration-300">생기부 면접</span>
                </div>
                <span className="cursor-pointer hover:text-[#4B7BF5] transition-all duration-300">일반 면접</span>
              </div>
              
              <div className="h-6 w-px bg-gray-200" />
              
              <button className="px-6 py-2 rounded-full border border-gray-200 hover:border-[#4B7BF5] hover:text-[#4B7BF5] transition-all duration-300">
                회원가입
              </button>
              <button className="px-6 py-2 rounded-full bg-[#4B7BF5] text-white hover:bg-[#3D63D2] transition-all duration-300">
                로그인
              </button>
            </div>
          </div>
        </header>
  
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-[#E8F3FF] to-[#F5F9FF]">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight">
                <span className="text-[#4B7BF5]">대입부터 취업까지</span>
                <br />
                <span className="text-gray-900">대면 면접을 미리 준비하세요!</span>
              </h1>
              <p className="text-gray-600">뷰인터와 함께 맞춤형 면접 연습으로 자신감을 쌓으세요.</p>
              <button className="px-6 py-3 bg-[#4B7BF5] text-white rounded-full hover:bg-[#3D63D2] transition-all duration-300 text-base font-medium">
                바로 시작하기
              </button>
            </div>
            
            <div className="w-[520px]">
              <img 
                src="/assets/img-landing-top.png"
                alt="Landing illustration"
                className="w-full object-contain"
              />
            </div>
          </div>
        </section>
  
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-6">
              면접 준비, 혼자 하려니 막막하지 않나요?
            </h2>
            <p className="text-center text-gray-600 text-lg mb-16">
              면접 준비에서 자기 경험을 효과적으로 표현하는 방법을 몰라 어려움을 겪고 있어요.
            </p>
            
            <div className="grid grid-cols-3 gap-8">
              {[
                {
                  icon: '/assets/difficulty-cases-card-profile1.png',
                  title: '제가 했던 행동이나 참여했던 프로젝트가 기억이 안 나요.',
                  description: '이전에 참여했던 활동의 구체적인 내용이 잘 기억나지 않아 면접 질문에 당황할까 봐 걱정돼요.',
                  bgColor: 'bg-[#E8FFE3]'
                },
                {
                  icon: '/assets/difficulty-cases-card-profile2.png',
                  title: '면접에서 어떤 활동을 물어볼지 감도 안 와요.',
                  description: '어떤 경험과 활동을 면접에서 중요하게 생각할지 알기가 어려워요.',
                  bgColor: 'bg-[#E8F3FF]'
                },
                {
                  icon: '/assets/difficulty-cases-card-profile3.png',
                  title: '면접관 앞에만 서면 긴장해서 말을 잘 못해요.',
                  description: '아무리 연습해도 실제 상황에서는 긴장감으로 실력을 발휘하지 못해요.',
                  bgColor: 'bg-[#FFE8E8]'
                }
              ].map((feature, i) => (
                <div 
                  key={i} 
                  className={`${feature.bgColor} p-8 rounded-3xl transition-all duration-300 hover:shadow-lg`}
                >
                  <img src={feature.icon} alt="" className="w-16 h-16 mb-6" />
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* Interview Preparation Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-12">
            <p className="text-3xl font-bold mb-4">
              <span>면접 연습의 핵심은 </span>
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                실전처럼 연습
              </span>
              <span>하는 게 중요해요.</span>
            </p>
            <p className="text-gray-600 text-lg">이제, 뷰인터와 함께 실전처럼 면접을 연습해 보세요.</p>
          </div>

          <div className="flex justify-center gap-4 mb-16">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:opacity-90 transition-all duration-300 text-lg font-medium shadow-lg shadow-blue-200">
              생기부 면접 준비
            </button>
            <button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-600 rounded-full hover:border-blue-500 hover:text-blue-500 transition-all duration-300 text-lg font-medium">
              일반 면접 준비
            </button>
          </div>

          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={50}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation
            className="max-w-4xl mx-auto"
          >
            {[
              {
                step: 'STEP 1',
                title: '생활기록부 업로드 및 질문 만들기',
                description: 'AI가 생활기록부를 분석하여 대면면접에서 나올 질문을 추천합니다.',
                image: 'assets/step1.png'
              },
              {
                step: 'STEP 2',
                title: '면접 연습 진행',
                description: '각 질문에 맞춰 자신의 경험을 기반으로 답변해 주세요.',
                image: 'assets/step2.png'
              },
              {
                step: 'STEP 3',
                title: '종합 리포트 제공',
                description: 'AI가 녹화된 영상 및 답변을 분석하여 종합 리포트를 제공합니다.',
                image: 'assets/step3.png'
              }
            ].map((step, i) => (
              <SwiperSlide key={i}>
                <div className="flex items-center gap-12 p-12 bg-white rounded-3xl shadow-lg">
                  <div className="flex-1 text-left">
                    <div className="text-blue-500 font-bold mb-4">{step.step}</div>
                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  <div className="flex-1">
                    <img src={step.image} alt="" className="w-full rounded-2xl shadow-md" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-16">
            실제로 많은 사람들이 <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">뷰인터로 연습</span>하고 있어요.
          </h2>
          
          <div className="grid grid-cols-3 gap-8">
            {[
                { 
                // icon 대신 image 경로 사용
                icon: '/assets/landing-viewinter-info-trophy.png',
                value: '1위',
                label: 'AI 면접 연습 서비스',
                bgColor: 'bg-yellow-50'
                },
                {
                icon: '/assets/landing-viewinter-info-chat.png',
                value: '30만건 +',
                label: 'AI 영상 분석',
                bgColor: 'bg-blue-50'
                },
                {
                icon: '/assets/landing-viewinter-info-contract.png',
                value: '15만명 +',
                label: '뷰인터를 이용 중인',
                bgColor: 'bg-gray-50'
                }
            ].map((stat, i) => (
                <div 
                key={i} 
                className={`bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-100 transition-all duration-300`}
                >
                <div className="bg-blue-50 p-3 rounded-xl inline-block mb-4">
                    {/* 아이콘 대신 이미지 사용 */}
                    <img 
                    src={stat.icon} 
                    alt="" 
                    className="w-20 h-20"  // 40px 크기로 설정 (w-10, h-10)
                    />
                </div>
                <div className="text-3xl font-bold mb-4">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
                </div>
            ))}
            </div>
        </div>
      </section>

      {/* Start Interview Preparation Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            이제 뷰인터와 함께 면접 준비를 해볼까요?
          </h2>
          <p className="text-xl mb-12 opacity-90">
            언제 어디서든 반복 연습 가능하니까, 준비가 될 때까지 연습할 수 있어요
          </p>
          <div className="flex justify-center gap-6">
            <button className="px-6 py-3 bg-white text-blue-500 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg font-medium flex items-center gap-2 shadow-lg">
              <GraduationCap />
              생기부 면접 준비
            </button>
            <button className="px-6 py-3 bg-white text-blue-500 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg font-medium flex items-center gap-2 shadow-lg">
              <Building2 />
              일반 면접 준비
            </button>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        
        :root {
          --swiper-theme-color: #4B7BF5;
        }
        
        body {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
        }
        
        .swiper-button-next,
        .swiper-button-prev {
          background-color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 16px;
          color: #4B7BF5;
        }

        .swiper-pagination-bullet-active {
          background: #4B7BF5;
        }
      `}</style>
    </div>
  )
}



