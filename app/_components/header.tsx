import Image from "next/image";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";

const Header = () => {
  return (
    <div className="flex items-center justify-between px-5 pt-6">
      <Image src="/logo.png" alt="FSW Foods" width={100} height={30} />
      <Button variant="ghost" size="icon" className="rounded-full">
        <MenuIcon />
      </Button>
    </div>
  );
};

export default Header;
