"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useScrolled } from "@/lib/hooks/useScroll";
import { useAuthStore } from "@/lib/store/auth";
import { cn } from "@/lib/utils";
import { MenuIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";

const Navbar = () => {
  const { user } = useAuthStore();
  const scrolled = useScrolled();

  const navbarLinks = [
    {
      href: "/",
      text: "Principles",
    },
    {
      href: "/leaderboard",
      text: "Leaderboard",
    },
    {
      href: "/about",
      text: "About",
    },
    {
      text: "Login",
      icon: (
        <div className="!rounded-full border border-white flex items-center justify-center p-0">
          <UserIcon className="size-5 rounded-full" />
        </div>
      ),
      href: "/#signature",
      className: "max-sm:hidden",
    },
  ];

  const renderLink = (href: string, text: string, icon?: React.ReactNode) => (
    <Link
      href={href}
      className="flex items-center gap-3 text-lg text-white hover:text-gray-300 sm:hover:text-gray-400"
    >
      {icon && user ? icon : text}
    </Link>
  );

  return (
    <nav
      className={cn(
        "w-full [&_a]:no-underline font-geist-sans flex justify-end fixed z-10 top-0 backdrop-blur-lg h-16 px-4 sm:px-5 transition ease-linear duration-150",
        scrolled ? "bg-black/30" : "bg-black"
      )}
    >
      {/* Desktop Navbar */}
      <NavigationMenu viewport={false} className="max-sm:hidden">
        <NavigationMenuList className="gap-3 sm:gap-5">
          {navbarLinks.map(({ href, text, icon }) => (
            <NavigationMenuItem key={text} className="min-w-10">
              <NavigationMenuLink
                asChild
                className="bg-transparent text-white text-lg"
              >
                {renderLink(href!, text, icon)}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Drawer Navbar */}
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button className="bg-transparent sm:hidden">
            <MenuIcon className="text-white size-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle className="text-lg font-semibold">Menu</DrawerTitle>
            </DrawerHeader>

            <div className="flex flex-col gap-4 px-6 py-4">
              {navbarLinks.map(({ href, text, icon, className }) => (
                <div key={text} className={className}>
                  {renderLink(href!, text, icon)}
                </div>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </nav>
  );
};

export default Navbar;
