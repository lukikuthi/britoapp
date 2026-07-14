import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-all duration-300 active:scale-[0.96] active:brightness-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-primary/95 to-primary text-primary-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),_0_2px_6px_rgba(0,0,0,0.15)] hover:from-primary hover:to-primary/90",
        destructive: "bg-gradient-to-b from-destructive/95 to-destructive text-destructive-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),_0_2px_6px_rgba(0,0,0,0.15)] hover:from-destructive hover:to-destructive/90",
        outline:
          "border border-input bg-background/60 backdrop-blur-md shadow-[0_2px_4px_rgba(0,0,0,0.04)] hover:bg-accent/80 hover:text-accent-foreground",
        secondary: "bg-gradient-to-b from-secondary/90 to-secondary text-secondary-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_2px_4px_rgba(0,0,0,0.05)] hover:from-secondary hover:to-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        type={asChild ? undefined : (type ?? "button")}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
