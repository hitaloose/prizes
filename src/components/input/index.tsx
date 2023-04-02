"use client";

import {
  ChangeEvent,
  HTMLInputTypeAttribute,
  useCallback,
  useId,
  useMemo,
  useState,
} from "react";
import Image from "next/image";

import eye from "./assets/eye.svg";
import eyeoff from "./assets/eye-off.svg";

type Props = {
  label: string;
  labelRigth?: React.ReactNode;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  type?: HTMLInputTypeAttribute;
  value?: string;
  onChange?: (newValue: string) => void;
};

export const Input = (props: Props) => {
  const {
    type,
    label,
    labelRigth,
    placeholder,
    error,
    disabled,
    value,
    onChange,
  } = props;

  // hooks
  const id = useId();

  // states
  const [showPassword, setShowPassword] = useState(false);

  // memos
  const password = useMemo(() => type === "password", [type]);

  const border = useMemo(() => {
    const defaultBorderProps =
      "outline-none border border-gray-200 rounded border";

    if (disabled) {
      return `${defaultBorderProps} border-gray-200`;
    }

    if (error) {
      return `${defaultBorderProps} border-red-500`;
    }

    return `${defaultBorderProps} hover:border-[#B5927F] focus:border-[#CEAA9A]`;
  }, [error, disabled]);

  const textColor = useMemo(() => {
    if (disabled) {
      return "text-gray-200";
    }

    return "text-gray-800";
  }, [disabled]);

  const pr = useMemo(() => (password ? "pr-10" : ""), [password]);

  // fns
  const handleEyeClick = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    },
    [onChange]
  );

  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-2">
        <label htmlFor={id} className={`text-gray-800 text-sm font-semibold`}>
          {label}
        </label>

        {labelRigth}
      </div>
      <div className="relative flex items-center">
        <input
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          type={showPassword ? "text" : type}
          className={`bg-white placeholder-gray-400 py-4 px-3 w-full ${pr} ${border} ${textColor}`}
          value={value}
          onChange={handleChange}
        />

        {password && (
          <div onClick={handleEyeClick} className="absolute right-3">
            <Image src={showPassword ? eyeoff : eye} alt="show password" />
          </div>
        )}
      </div>

      {!!error && (
        <span className="text-red-500 text-sm font-normal mt-1">{error}</span>
      )}
    </div>
  );
};
