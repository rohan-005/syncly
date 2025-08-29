import React, { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeaderProps {
  children?: ReactNode;
  className?: string;
}

const Header = ({ children, className }: HeaderProps) => {
  return (
    <div
      className={cn(
        "min-h-[85px] min-w-full flex-nowrap bg-dark-100 flex w-full items-center justify-between gap-2 px-10",
        className
      )}
    >
      <Link href="/" className="flex items-center">
        <Image
          src="/assets/icons/logo-icon.svg"
          alt="Logo"
          width={40}
          height={40}
          className="hidden md:block"
        />

        {/* Mobile Icon */}
        <Image
          src="/assets/icons/logo-icon.svg"
          alt="Logo"
          width={32}
          height={32}
          className="mr-2 md:hidden"
        />

        {/* Brand Name */}
        <span className="ml-2 text-xl font-bold tracking-wide text-white-900">
          Syncly
        </span>
      </Link>
      {children}
    </div>
  );
};

export default Header;
