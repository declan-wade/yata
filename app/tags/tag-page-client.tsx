"use client";
import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { format } from "date-fns"; // Removed unused date-fns imports
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TagManagement } from "@/components/tag-management";
import { Todo, TodoTag } from "@/lib/types";
import { AccountDropdown } from "@/components/account-dropdown";
import { useUser } from "@stackframe/stack";
import { SetName } from "@/components/set-name";

interface TagPageClientProps {
  todos: Todo[];
  initialTags: TodoTag[];
}

export default function TagPageClient({ todos, initialTags }: TagPageClientProps) {
  const [tagList, setTagList] = React.useState<TodoTag[]>(initialTags);
  const user = useUser();

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
         <div className="flex items-center gap-4">
          <AccountDropdown />
          <span className="hidden lg:block">
            {user && user.displayName ? `Hello, ${user.displayName}` : <SetName />}
          </span>
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
