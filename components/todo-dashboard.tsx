"use client";
import React, { useState, useEffect } from "react";
import { format, set } from "date-fns";
import { AppSidebar } from "@/components/app-sidebar";
import { TodoList } from "@/components/todo-list";
import { TodoSidebar } from "@/components/todo-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { updateTodoStatus, deleteTodo } from "@/lib/actions";
import type { Todo, TodoDashboardProps } from "@/lib/types";
import { useUser } from "@stackframe/stack";
import { SetName } from "./set-name";
import { AccountDropdown } from "./account-dropdown";

export default function TodoDashboard({
  initialTodos,
  header,
  tags,
}: TodoDashboardProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);
  const user = useUser();

  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  // Handler for toggling todo completion
  const handleToggleComplete = async (id: number, completed: boolean) => {
    console.log("Toggling todo completion:", id, completed);
    try {
      // Use server action to update todo
      await updateTodoStatus(id, completed);
      // The useEffect above will handle updating the 'todos' state when 'initialTodos' prop changes
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  // Handler for deleting a todo
  const handleDeleteTodo = async (id: number) => {
    try {
      // Use server action to delete todo
      await deleteTodo(id);

      // Remove todo from state
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

      // Clear selected todo if it's the one being deleted
      if (selectedTodo && selectedTodo.id === id) {
        setSelectedTodo(null);
      }
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  // Handle selecting a todo
  const handleSelectTodo = (todo: Todo) => {
    if (selectedTodo && selectedTodo.id === todo.id) {
      setSelectedTodo(null);
      setRightOpen(false);
    } else {
      setSelectedTodo(todo);
      setRightOpen(true);
    }
  };

  // Handle closing the todo sidebar
  const handleCloseTodoSidebar = () => {
    setSelectedTodo(null);
    setRightOpen(false);
  };

  return (
    <SidebarProvider open={rightOpen} onOpenChange={setRightOpen}>
      <SidebarProvider open={leftOpen} onOpenChange={setLeftOpen}>
        <AppSidebar todos={todos} tags={tags} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
            <div className="flex h-16 shrink-0 items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div>
              Today is{" "}
              <strong>{format(new Date(), "eeee dd MMMM yyyy")}</strong>
            </div>
            </div>
            <div className="flex items-center gap-4">
              <AccountDropdown />
                <span className="">{user && user.displayName ? `Hello, ${user.displayName}` : <SetName />}</span>
            </div>
          </header>
          <TodoList
            todos={todos}
            tags={tags}
            header={header}
            onSelectTodo={handleSelectTodo}
            onToggleComplete={handleToggleComplete}
            onDeleteTodo={handleDeleteTodo}
           // onTodoAdded={() => { /* Server revalidation will handle list update */ }}
          />
        </SidebarInset>
      </SidebarProvider>
      {selectedTodo && (
        <TodoSidebar
          selectedTodo={selectedTodo}
          onClose={handleCloseTodoSidebar}
          onMarkComplete={handleToggleComplete}
          onDeleteTodo={handleDeleteTodo}
          allTags={tags}
        />
      )}
    </SidebarProvider>
  );
}
