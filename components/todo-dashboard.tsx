"use client";
import React, { useState } from "react";
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
import { getAllTodos } from "@/lib/database";

export default function TodoDashboard({
  initialTodos,
  header,
  tags,
}: TodoDashboardProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);

  // Handler for toggling todo completion
  const handleToggleComplete = async (id: number, completed: boolean) => {
    console.log("Toggling todo completion:", id, completed);
    try {
      // Use server action to update todo
      const updatedTodo = await updateTodoStatus(id, completed);

      refreshTodos();
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

  const refreshTodos = async () => {
    const todos: Todo[] = await getAllTodos();
    setTodos(todos);
  }

  return (
    <SidebarProvider open={rightOpen} onOpenChange={setRightOpen}>
      <SidebarProvider open={leftOpen} onOpenChange={setLeftOpen}>
        <AppSidebar todos={todos} tags={tags} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div>
              Today is{" "}
              <strong>{format(new Date(), "eeee dd MMMM yyyy")}</strong>
            </div>
          </header>
          <TodoList
            todos={todos}
            tags={tags}
            header={header}
            onSelectTodo={handleSelectTodo}
            onToggleComplete={handleToggleComplete}
            onDeleteTodo={handleDeleteTodo}
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
