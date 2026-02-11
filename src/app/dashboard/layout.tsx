'use client';
import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Briefcase,
  GanttChartSquare,
  HardHat,
  Landmark,
  LayoutDashboard,
  ScrollText,
  Settings,
  ShieldCheck,
  Ship,
  ShoppingCart,
  Truck,
  Users,
  Warehouse,
  Wrench,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ApexLogo } from '@/components/icons';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/sales', icon: ShoppingCart, label: 'Sales' },
  { href: '/dashboard/purchase', icon: Truck, label: 'Purchase' },
  { href: '/dashboard/production', icon: GanttChartSquare, label: 'Production' },
  { href: '/dashboard/logistics', icon: Ship, label: 'Logistics' },
  { href: '/dashboard/inventory', icon: Warehouse, label: 'Inventory' },
  { href: '/dashboard/finance', icon: Landmark, label: 'Finance' },
  { href: '/dashboard/hr', icon: Users, label: 'HR' },
  { href: '/dashboard/contractors', icon: HardHat, label: 'Contractors' },
  { href: '/dashboard/quality', icon: ShieldCheck, label: 'Quality' },
  { href: '/dashboard/maintenance', icon: Wrench, label: 'Maintenance' },
  { href: '/dashboard/assets', icon: Briefcase, label: 'Assets' },
  { href: '/dashboard/reports', icon: BarChart3, label: 'Reports' },
  { href: '/dashboard/statutory', icon: ScrollText, label: 'Statutory' },
];

const settingsNav = [
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

function NavContent() {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border">
        <div
          className={cn(
            'flex items-center gap-2 transition-all duration-200',
            'group-data-[collapsible=icon]:-ml-1'
          )}
        >
          <ApexLogo className="size-7 shrink-0" />
          <span className="text-lg font-semibold group-data-[collapsible=icon]:opacity-0">
            ApexERP
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
                onClick={handleLinkClick}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          {settingsNav.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
                onClick={handleLinkClick}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-auto w-full justify-start p-2">
                  <Avatar className="h-8 w-8">
                    {userAvatar && (
                      <AvatarImage
                        src={userAvatar.imageUrl}
                        alt="User Avatar"
                      />
                    )}
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start truncate">
                    <span className="font-medium">John Doe</span>
                    <span className="text-xs text-muted-foreground">Admin</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="start"
                className="w-56"
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLinkClick}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLinkClick}>
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLinkClick}>
                  Team
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLinkClick}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <NavContent />
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
