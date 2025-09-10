import * as React from "react";

import { cn } from "@/lib/utils";
import { Text } from "./text";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  containerClassName?: string;
}
function Input({
  className,
  type,
  error,
  containerClassName,
  ...props
}: InputProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <input
        type={type}
        data-slot="input"
        className={cn(
          "text-black bg-white rounded-xl px-3 py-3 w-full placeholder:text-black/50 focus:outline-0 text-xl",
          className
        )}
        {...props}
      />
      {error && (
        <Text className="text-red-600 absolute -bottom-7">{error}</Text>
      )}
    </div>
  );
}

export { Input };
