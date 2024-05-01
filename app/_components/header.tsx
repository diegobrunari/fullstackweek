import Image from "next/image";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex items-center justify-between px-5 pt-6">
      <div className="relative h-[30px] w-[100px]">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="FSW Foods"
            fill
            className="object-contain"
          />
        </Link>
      </div>

      <Button variant="ghost" size="icon" className="rounded-full">
        <MenuIcon />
      </Button>
    </div>
  );
};

export default Header;
