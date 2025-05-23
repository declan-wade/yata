import * as React from "react";
import { Clock, Trash, X } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { TodoSidebarProps } from "@/lib/types";
import { format } from "date-fns";
import { useState } from "react";
import { DateTimePicker } from "./datetime-picker";
import { updateTodo } from "@/lib/actions";

export function TodoSidebar({ selectedTodo, onClose }: TodoSidebarProps) {
  // Track which field is being edited
  const [editingField, setEditingField] = useState<
    null | "name" | "dueDate" | "description"
  >(null);
  const [editValue, setEditValue] = useState<string>("");

  // Helper to start editing a field
  const startEditing = (
    field: "name" | "dueDate" | "description",
    value: string,
  ) => {
    setEditingField(field);
    setEditValue(value);
  };

  // Helper to save (stub, replace with your save logic)
  const saveEdit = async () => {
    if (!selectedTodo || !editingField) {
      return;
    }

    const updateData = {
      [editingField]: editValue,
    };

    try {
      await updateTodo(selectedTodo.id, updateData);
      // onMarkComplete(); // Refresh UI
    } catch (error) {
      console.error("Failed to update todo:", error);
      // Optionally, handle error display to the user
    } finally {
      setEditingField(null);
    }
  };

  return (
    <Sidebar side="right" collapsible="offcanvas" variant="sidebar">
      <SidebarHeader className="bg-background border-b h-16"></SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {/* Name */}
          <SidebarMenuItem>
            <div className="flex flex-col gap-0.5 leading-none p-2">
              {editingField === "name" ? (
                <input
                  className="font-medium text-md"
                  value={editValue}
                  autoFocus
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                />
              ) : (
                <span
                  className="font-medium text-md cursor-pointer"
                  onClick={() => startEditing("name", selectedTodo?.name || "")}
                >
                  {selectedTodo?.name}
                </span>
              )}
            </div>
          </SidebarMenuItem>
          {/* Due Date */}
          <SidebarMenuItem>
            <div className="flex flex-col gap-0.5 leading-none p-2">
              {editingField === "dueDate" ? (
                <DateTimePicker
                  className="text-sm"
                  value={editValue ? new Date(editValue) : undefined}
                  autoFocus
                  onChange={(date) =>
                    setEditValue(date ? date.toISOString().slice(0, 16) : "")
                  }
                />
              ) : (
                <span
                  className="text-sm cursor-pointer flex items-center gap-1"
                  onClick={() =>
                    startEditing(
                      "dueDate",
                      selectedTodo?.dueDate
                        ? new Date(selectedTodo.dueDate)
                            .toISOString()
                            .slice(0, 16)
                        : "",
                    )
                  }
                >
                  <Clock className="h-4" />
                  Due:{" "}
                  {selectedTodo?.dueDate
                    ? format(selectedTodo.dueDate, "HH:mm dd MMMM yyyy")
                    : ""}
                </span>
              )}
            </div>
          </SidebarMenuItem>
          {/* Description */}
          <SidebarMenuItem>
            <div className="flex flex-col gap-0.5 leading-none p-2">
              {editingField === "description" ? (
                <textarea
                  className="text-sm"
                  value={editValue}
                  autoFocus
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                />
              ) : (
                <span
                  className="text-sm cursor-pointer"
                  onClick={() =>
                    startEditing("description", selectedTodo?.description || "")
                  }
                >
                  {selectedTodo?.description}
                </span>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <p className="text-gray-400">
              Modified:{"  "}
              {selectedTodo?.updatedAt
                ? format(selectedTodo.updatedAt, "HH:mm dd MMMM yyyy")
                : " "}
            </p>
            <p className="text-gray-400">
              Modified:{"  "}
              {selectedTodo?.createdAt
                ? format(selectedTodo.createdAt, "HH:mm dd MMMM yyyy")
                : " "}
            </p>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu>
            <DropdownMenu key="1">
              <SidebarMenuItem>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    onClick={onClose}
                    className="data-[state=open]:bg-primary bg-primary data-[state=open]:text-sidebar-accent-foreground hover:invert mb-2"
                  >
                    <div className="text-white dark:text-black">Close</div>
                    <X className="ml-auto text-white dark:text-black" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="data-[state=open]:bg-red-400 bg-red-400 data-[state=open]:text-sidebar-accent-foreground hover:invert">
                    <div className="text-white">Delete</div>
                    <Trash className="text-white ml-auto" />
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
