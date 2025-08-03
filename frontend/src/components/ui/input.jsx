import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border bg-background/80 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none transition-all",
        "backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "border-white/20 dark:border-white/10",
        "focus-visible:ring-2 focus-visible:ring-[#7c3aed]/60 focus-visible:ring-offset-2 ring-offset-background",
        "hover:bg-background/70",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }