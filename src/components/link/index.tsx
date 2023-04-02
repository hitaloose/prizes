import NLink from "next/link";

type Props = {
  children: React.ReactNode;
  href: string;
};

export const Link = (props: Props) => {
  const { children, href } = props;

  return (
    <NLink
      className="text-[#B5927F] font-semibold cursor-pointer hover:underline focus:underline"
      href={href}
    >
      {children}
    </NLink>
  );
};
