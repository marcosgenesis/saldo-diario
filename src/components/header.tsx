import { HouseIcon, InboxIcon } from "lucide-react";

import Logo from "@/components/navbar-components/logo";
import UserMenu from "@/components/navbar-components/user-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

// Navigation links array
const navigationLinks = [
  { href: "#", label: "Home", icon: HouseIcon, active: true },
  { href: "#", label: "Histórico completo", icon: InboxIcon },
  // { href: "#", label: "Insights", icon: ZapIcon },
];

export default function Header() {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}

        <NavigationMenu className="max-md:hidden">
          <NavigationMenuList className="gap-2">
            {navigationLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    active={link.active}
                    href={link.href}
                    className="text-foreground hover:text-primary flex-row items-center gap-2 py-1.5 font-medium"
                  >
                    <Icon
                      size={16}
                      className="text-muted-foreground/80"
                      aria-hidden="true"
                    />
                    <span>{link.label}</span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Middle side: Logo */}
        <div className="flex items-center">
          <a href="#" className="text-primary hover:text-primary/90">
            <Logo />
          </a>
        </div>

        {/* Right side: Actions */}
        <div className="flex flex-1 items-center justify-end gap-4">
          {/* User menu */}
          <UserMenu />
          {/* Upgrade button */}
          {/* <Button size="sm" className="text-sm sm:aspect-square">
            <SparklesIcon
              className="opacity-60 sm:-ms-1"
              size={16}
              aria-hidden="true"
            />
            <span className="sm:sr-only">Upgrade</span>
          </Button> */}
        </div>
      </div>
    </header>
  );
}
