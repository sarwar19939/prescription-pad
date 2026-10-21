import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 min-h-[44px] w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-base md:text-sm text-slate-900 shadow-2xs transition-all outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
