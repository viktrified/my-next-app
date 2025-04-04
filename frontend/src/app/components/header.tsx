"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  return (
    <header className="bg-gray-900 text-white p-[20px] h-[80px]">
      <h1 className="text-lg font-bold container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-[30px] cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            router.refresh();
          }}
        >
          Swapalot
        </Link>
        <ConnectButton />
      </h1>
    </header>
  );
};

export default Header;
