"use client";

import * as Icons from "lucide-react"; // imports all icons as a dictionary
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: keyof typeof Icons; // string key
    isActive?: boolean;
    count?: number; // <-- Accept count
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      {items.map((item) => {
        const Icon: any = item.icon ? Icons[item.icon] : null;

        return (
          <DropdownMenu key={item.title}>
            <SidebarMenuItem>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center justify-between">
                  <a href={item.url} className="flex items-center gap-2">
                    {item.title}
                    {Icon ? <Icon className="ml-1 h-4" /> : null}
                  </a>
                  {typeof item.count === "number" && item.count > 0 && (
                    <span
                      className="ml-3 inline-flex min-w-[1.5rem] justify-center rounded-full bg-red-400 px-2 py-0.5 text-xs font-semibold text-white animate-fade-in"
                      style={{
                        animation: "fade-in 0.4s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    >
                      {item.count}
                    </span>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </SidebarMenuItem>
          </DropdownMenu>
        );
      })}
    </SidebarMenu>
  );
}
