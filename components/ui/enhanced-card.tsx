import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva("rounded-lg border bg-card text-card-foreground shadow-sm", {
  variants: {
    variant: {
      default: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
      elevated: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg",
      outlined: "bg-transparent border-2 border-gray-300 dark:border-gray-600",
      filled: "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
  },
})

export interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  icon?: React.ReactNode
  title?: string
  description?: string
  actions?: React.ReactNode
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant, padding, icon, title, description, actions, children, ...props }, ref) => {
    const hasHeader = icon || title || description || actions

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding: hasHeader ? "none" : padding }), className)}
        {...props}
      >
        {hasHeader && (
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex items-start gap-3">
              {icon && <div className="flex-shrink-0 mt-1">{icon}</div>}
              <div className="flex-1">
                {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>}
                {description && <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>}
              </div>
            </div>
            {actions && <div className="flex-shrink-0">{actions}</div>}
          </div>
        )}

        {children && (
          <div className={cn(hasHeader ? "px-6 pb-6" : "", padding === "none" ? "p-0" : "")}>{children}</div>
        )}
      </div>
    )
  },
)
EnhancedCard.displayName = "EnhancedCard"

export { EnhancedCard, cardVariants }
