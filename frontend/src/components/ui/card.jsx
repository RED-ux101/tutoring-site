import * as React from "react"
import { cn } from "../../lib/utils"

/**
 * Card with variants to support plain, glass, and gradient surfaces.
 */
const Card = React.forwardRef(({ className, variant = "glass", ...props }, ref) => {
  const base = "rounded-lg overflow-hidden transition-all"
  const variants = {
    plain: "border bg-card text-card-foreground shadow-sm",
    glass: "glass glass-hover text-card-foreground",
    gradient: "gradient-primary text-white shadow-elevated",
  }
  return (
    <div
      ref={ref}
      className={cn(base, variants[variant] ?? variants.glass, className)}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  >
    {children || 'Card Title'}
  </h3>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }