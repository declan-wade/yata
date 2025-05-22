"use client";
import React from "react";
import dynamic from "next/dynamic";
import { format } from "date-fns"; // Removed unused date-fns imports
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TagManagement } from "@/components/tag-management";
import { Todo, TodoTag } from "@/lib/types";

const AppSidebar = dynamic(() => import('@/components/app-sidebar').then(mod => mod.AppSidebar), { ssr: false });

interface TagPageClientProps {
  todos: Todo[];
  initialTags: TodoTag[];
}

export default function TagPageClient({ todos, initialTags }: TagPageClientProps) {
  const [tagList, setTagList] = React.useState<TodoTag[]>(initialTags);

  const handleCreateTag = (tag: any) => {
    setTagList((prev) => [...prev, tag]);
  };

  // Placeholder functions for update and delete operations
  const handleUpdateTag = (tag: any) => {
    // Logic to update a tag will be implemented later
    console.log("Update tag:", tag);
  };

  const handleDeleteTag = (tagId: any) => {
    // Logic to delete a tag will be implemented later
    console.log("Delete tag:", tagId);
    // setTagList((prev) => prev.filter(tag => tag.id !== tagId)); // Example implementation
  };

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
          onUpdateTag={handleUpdateTag} // Using placeholder
          onDeleteTag={handleDeleteTag} // Using placeholder
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
