import Image from "next/image";

import spinner from "../../assets/spinner.svg";

export const Loading = () => {
  return (
    <div className="z-10 absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-40 flex justify-center items-center">
      <Image src={spinner} alt="spinner" />
    </div>
  );
};
