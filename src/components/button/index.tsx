import React from "react";

type Props = {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export const Button = (props: Props) => {
  const { children, onClick, disabled } = props;

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="bg-[#B5927F] hover:bg-[#CEAA9A] disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed transition rounded py-4 px-6 text-white text-base font-bold"
    >
      {children}
    </button>
  );
};
