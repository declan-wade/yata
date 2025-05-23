"use client";
import * as React from "react";
import { GalleryVerticalEnd, Settings, Star, Tags } from "lucide-react";
import * as Icons from "lucide-react";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { getCount } from "@/lib/actions";

export function AppSidebar({
  todos,
  tags,
  ...props
}: { todos: any[] } & { tags: any[] } & React.ComponentProps<typeof Sidebar>) {
  const [counts, setCounts] = React.useState<{ [key: string]: number }>({});

  // Define nav items
  const navMain = [
    { title: "Inbox", url: "/inbox", icon: "Inbox" as const, key: "inbox" },
    {
      title: "Due Today",
      url: "/today",
      icon: "Hourglass" as const,
      key: "dueToday",
    },
    {
      title: "Due This Week",
      url: "/week",
      icon: "CalendarDays" as const,
      key: "dueThisWeek",
    },
    {
      title: "Overdue",
      url: "/overdue",
      icon: "AlarmClockCheck" as const,
      key: "overdue",
    },
  ];

  function toPascalCase(input: string): string {
    return input
      .replace(/[_\-\s]+/g, " ") // Replace -, _, and multiple spaces with a single space
      .trim() // Remove leading/trailing spaces
      .split(" ") // Split into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize
      .join("");
  }

  // Fetch counts whenever todos change
  React.useEffect(() => {
    async function fetchCounts() {
      const newCounts = await getCount(); // getCount returns the whole object
      setCounts(newCounts);
    }
    fetchCounts();
  }, [todos]);

  // Pass counts to NavMain
  const navItemsWithCounts = navMain.map(({ key, ...item }) => ({
    ...item,
    count: counts[key] ?? 0,
  }));

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-black">YATA</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>My Tasks</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavMain items={navItemsWithCounts} />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>My Tags</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tags
                ? tags.map((item) => {
                    const Icon =
                      (item.icon && (Icons as any)[toPascalCase(item.icon)]) ||
                      null;
                    return (
                      <DropdownMenu key={item.id}>
                        <SidebarMenuItem>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center justify-between">
                              <a
                                href={`/tag/${item.id}`}
                                className="flex items-center gap-2"
                              >
                                {item.name}
                                {Icon ? <Icon className="ml-1 h-4" /> : null}
                              </a>
                              {typeof item.count === "number" &&
                                item.count > 0 && (
                                  <span
                                    className="ml-3 inline-flex min-w-[1.5rem] justify-center rounded-full bg-red-400 px-2 py-0.5 text-xs font-semibold text-white animate-fade-in"
                                    style={{
                                      animation:
                                        "fade-in 0.4s cubic-bezier(0.4,0,0.2,1)",
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
                  })
                : null}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarMenu>
            <DropdownMenu key="1">
              <SidebarMenuItem>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <a href="/tags">Manage tags</a>
                    <Tags className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <a href="/settings">Settings</a>
                    <Settings className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
              </SidebarMenuItem>
            </DropdownMenu>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
