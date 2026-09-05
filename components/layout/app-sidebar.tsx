"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  ArrowRightLeft,
  BarChart3,
  CircleUserRound,
  Goal,
  LogOut,
  Menu,
  WalletCards,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { useState } from "react";
import { Button } from "../ui/button";

const navs = [
  { title: "Transactions", href: "/", icon: ArrowRightLeft },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Goals", href: "/goals", icon: Goal },
  { title: "My Profile", href: "/profile", icon: CircleUserRound },
];

function SidebarItem({
  title,
  href,
  icon: Icon,
  onNavigate,
}: {
  title: string;
  href: string;
  icon: React.ElementType;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
        "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
        isActive &&
          "bg-slate-900 text-white shadow-sm hover:bg-slate-900 hover:text-white"
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 transition-colors",
          isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"
        )}
      />
      <span>{title}</span>
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <>
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900">
          <WalletCards className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-slate-900">Finance</h1>
          <p className="text-xs text-slate-400">Dashboard</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Overview
        </p>
        {navs.map((nav) => (
          <SidebarItem key={nav.title} title={nav.title} href={nav.href} icon={nav.icon} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3 rounded-xl p-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={currentUser?.image} alt={currentUser?.username ?? "User"} />
            <AvatarFallback className="bg-slate-100 text-xs font-semibold uppercase text-slate-700">
              {currentUser?.username?.[0] ?? "U"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">
              <Link href="/profile" className="hover:text-slate-600" onClick={onNavigate}>
                {currentUser?.username ?? "User"}
              </Link>
            </p>
            <p className="truncate text-xs text-slate-400">Personal Finance</p>
          </div>

          <Tooltip>
            <TooltipTrigger
              type="button"
              onClick={handleLogout}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Logout</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );
}

export default function AppSidebar() {
  const [openDrawer, setDrawer] = useState(false);

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-62 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5 lg:flex">
        <SidebarContent />
      </aside>
      <div className="lg:hidden">
        <Drawer open={openDrawer} onOpenChange={setDrawer} swipeDirection="right">
          <DrawerTrigger
            render={
              <Button variant="ghost" size="icon" className="m-4" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            }
          />

          <DrawerContent>
            <div className="flex h-full flex-col px-4 py-5">
              <SidebarContent onNavigate={() => setDrawer(false)} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}