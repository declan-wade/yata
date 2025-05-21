"use client";
import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TagManagement } from "@/components/tag-management";
import { getAllTags, getAllTodos } from "@/lib/database";
import { Todo, TodoTag } from "@/lib/types";

const todos: Todo[] = await getAllTodos();
const tags: TodoTag[] = await getAllTags();

export default function Home() {
  const [tagList, setTagList] = React.useState(tags);

  const handleCreateTag = (tag: TodoTag) => {
  setTagList((prev) => [...prev, tag]);
};

  // You may want to implement handleUpdateTag and handleDeleteTag similarly

  return (
    <SidebarProvider>
      <AppSidebar todos={todos} tags={tagList} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div>
            Today is{" "}
            <strong>{format(new Date(), "eeee dd MMMM yyyy")}</strong>
          </div>
        </header>

        <TagManagement
          tags={tagList}
          onCreateTag={handleCreateTag}
          onUpdateTag={() => {}}
          onDeleteTag={() => {}}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
