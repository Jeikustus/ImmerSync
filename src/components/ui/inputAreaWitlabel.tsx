import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Textarea } from "./textarea";

export interface InputAreaWithLabelProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const InputAreaWithLabel = React.forwardRef<
  HTMLTextAreaElement,
  InputAreaWithLabelProps
>(({ className, label, ...props }, ref) => {
  return (
    <div className={`grid w-full max-w-5xl items-center gap-1.5 ${className}`}>
      <Label htmlFor={props.id} className="pl-1">
        {label}
      </Label>
      <Textarea {...props} ref={ref} />
    </div>
  );
});
InputAreaWithLabel.displayName = "InputAreaWithLabel";

export { InputAreaWithLabel };
