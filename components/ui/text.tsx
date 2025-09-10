import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const textVariants = cva("", {
  variants: {
    variant: {
      Base: "text-xs/[14px] sm:text-base/5",
      Lg: "text-base sm:text-lg",
      Xl: "text-lg sm:text-xl",
      "2Xl": "text-xl sm:text-2xl",
      "3Xl": "text-xl sm:text-3xl",
      "4Xl": "text-[48px] sm:text-[48px]",
    },
  },
});

type TextProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof VariantProps<typeof textVariants>
> &
  VariantProps<typeof textVariants> & {
    children: React.ReactNode;
  };

const Text = React.forwardRef<HTMLDivElement, TextProps>(
  ({ variant, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={textVariants({ variant, className })}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Text.displayName = "Text";

export { Text, textVariants };
export type { TextProps };
