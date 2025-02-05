'use client'

import { cn } from "@/lib/utils"
import * as SliderPrimitive from "@radix-ui/react-slider"
import React from "react"

/**
 * Radix UI Slider 래퍼
 * - track, thumb 등 스타일은 Tailwind로 커스텀
 * - 2개 이상의 thumb를 지원하려면 `props.value` 또는 `props.defaultValue` 배열을 사용합니다.
 */
export const DetailSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>((props, ref) => {
  const { className, ...rest } = props

  // controlled 방식일 수도 있으므로 value와 defaultValue 둘 다 사용
  const thumbValues = props.value ?? props.defaultValue

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full select-none touch-none items-center", className)}
      {...rest}
    >
      {/* 트랙 */}
      <SliderPrimitive.Track className="relative h-4 w-full grow overflow-hidden rounded-full bg-gray-200">
        {/* 선택 구간 */}
        <SliderPrimitive.Range className="absolute h-full bg-blue-500" />
      </SliderPrimitive.Track>

      {/* Thumb(s) */}
      {thumbValues?.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className={cn(
            "block h-5 w-5 rounded-full border-2 border-blue-600 bg-white shadow",
            "cursor-grab active:cursor-grabbing",
            "transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400",
            "flex items-center justify-center"
          )}
        >
          {/* 드래그 핸들 역할을 하는 작은 막대 */}
          <div className="bg-blue-600 rounded"></div>
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  )
})
DetailSlider.displayName = "DetailSlider"
