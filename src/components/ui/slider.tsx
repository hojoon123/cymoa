import { cn } from "@/lib/utils"
import * as SliderPrimitive from "@radix-ui/react-slider"
import * as React from "react"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    {/* 베이스 트랙 */}
    <SliderPrimitive.Track 
      className="relative h-3 w-full grow overflow-hidden rounded-full bg-gray-200"
    >
      {/* 선택된 범위 */}
      <SliderPrimitive.Range className="absolute h-full bg-blue-500" />
    </SliderPrimitive.Track>

    {/* 슬라이더 핸들러 (Thumb) */}
    {props.defaultValue?.map((_, index) => (
      <SliderPrimitive.Thumb
        key={index}
        className="block h-5 w-5 rounded-full border-2 border-blue-500 bg-white 
          ring-offset-background transition-colors hover:scale-110
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 
          focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
          shadow-md hover:border-blue-600 hover:bg-blue-50"
      />
    ))}
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

