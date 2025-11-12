import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

interface PasswordInputProps<T extends FieldValues> {
  field: ControllerRenderProps<T>;
  placeholder?: string;
}

export const PasswordInput = <T extends FieldValues>({
  field,
  placeholder = "Enter password",
}: PasswordInputProps<T>) => {
  const [isShow, setIsShow] = useState(false);

  return (
    <div className="relative">
      <Input
        {...field}
        type={isShow ? "text" : "password"}
        placeholder={placeholder}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setIsShow((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {isShow ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
      </button>
    </div>
  );
};
