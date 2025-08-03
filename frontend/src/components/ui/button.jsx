import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        outline: "border border-input bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 hover:bg-accent/30 hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        ghost: "hover:bg-accent/40 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "gradient-primary text-white shadow-[var(--shadow-md)] hover:brightness-110 hover:translate-y-[-1px] focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2",
        glass: "glass glass-hover text-foreground hover:translate-y-[-1px] shadow-[var(--shadow-sm)] focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2",
        subtle: "bg-muted text-foreground hover:bg-muted/80 shadow-[var(--shadow-sm)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        hero: "bg-[radial-gradient(120%_120%_at_0%_0%,rgba(124,58,237,0.9),rgba(37,99,235,0.9))] text-white shadow-[var(--shadow-lg)] hover:brightness-110 hover:translate-y-[-1px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      round: {
        false: "",
        true: "rounded-full",
      },
      elevation: {
        none: "",
        sm: "shadow-[var(--shadow-sm)]",
        md: "shadow-[var(--shadow-md)]",
        lg: "shadow-[var(--shadow-lg)]",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      round: false,
      elevation: "none",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, round = false, elevation = "none", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, round, elevation, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }