import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border px-3 py-2 text-sm outline-none transition-all",
        "bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        "placeholder:text-muted-foreground hover:bg-background/70",
        "shadow-[var(--shadow-sm)] focus:shadow-[var(--shadow-md)]",
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