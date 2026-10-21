import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-teal-500/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 shadow-xs",
        outline:
          "border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 shadow-2xs",
        secondary:
          "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200/80",
        ghost:
          "hover:bg-slate-100 text-slate-700 hover:text-slate-900",
        destructive:
          "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-semibold",
        link: "text-teal-700 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 min-h-[44px] gap-2 px-4 py-2.5 text-sm font-semibold",
        sm: "h-9 min-h-[36px] gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
        lg: "h-12 min-h-[48px] gap-2.5 rounded-xl px-6 py-3 text-base font-semibold",
        icon: "size-11 rounded-xl",
        "icon-sm": "size-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
