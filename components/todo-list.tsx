"use client";
import { useState, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop, DragSourceMonitor, DropTargetMonitor } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Check, Clock, Ellipsis, EllipsisVertical, Tag, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AddTodo } from "./add-todo";
import type { Todo, TodoTag, TodoListProps } from "@/lib/types";

const ITEM_TYPE = "TODO_ITEM";

export function TodoList({
  todos,
  tags,
  header,
  onSelectTodo,
  onToggleComplete,
  onDeleteTodo,
}: TodoListProps) {
  const [showCompleted, setShowCompleted] = useState(true);
  const [orderedTodos, setOrderedTodos] = useState(todos);

  // Update orderedTodos if todos prop changes
  useEffect(() => {
    setOrderedTodos(todos);
  }, [todos]);

  // Filter todos based on completion status
  const filteredTodos = showCompleted
    ? orderedTodos
    : orderedTodos.filter((todo) => !todo.isComplete);

  // Move item in the list
  const moveTodo = (dragIndex: number, hoverIndex: number) => {
    const updated = [...orderedTodos];
    const [removed] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, removed);
    setOrderedTodos(updated);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex items-center justify-between p-4">
        <h2 className="text-2xl font-bold">{header}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show completed</span>
          <Switch checked={showCompleted} onCheckedChange={setShowCompleted} />
        </div>
      </div>

      <Separator />
      <div className="p-4">
        <AddTodo tags={tags} />
      </div>
      <Separator className="p-0 m-0" />
      {filteredTodos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tasks found.</p>
        </div>
      ) : (
        <div>
          {filteredTodos.map((todo, index) => (
            <DraggableTodoItem
              key={todo.id}
              index={index}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onDeleteTodo={onDeleteTodo}
              selectTodo={onSelectTodo}
              moveTodo={moveTodo}
            />
          ))}
        </div>
      )}
    </DndProvider>
  );
}

function DraggableTodoItem({
  todo,
  index,
  onToggleComplete,
  onDeleteTodo,
  selectTodo,
  moveTodo,
}: {
  todo: Todo;
  index: number;
  onToggleComplete: (id: number, completed: boolean) => void;
  onDeleteTodo: (id: number) => void;
  selectTodo: (todo: Todo) => void;
  moveTodo: (dragIndex: number, hoverIndex: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover(item: unknown, monitor: DropTargetMonitor) {
      const dragItem = item as { index: number };
      if (!ref.current) return;
      const dragIndex = dragItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveTodo(dragIndex, hoverIndex);
      dragItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}>
      <TodoItem
        todo={todo}
        onToggleComplete={onToggleComplete}
        onDeleteTodo={onDeleteTodo}
        selectTodo={selectTodo}
      />
    </div>
  );
}

function TodoItem({
  todo,
  onToggleComplete,
  onDeleteTodo,
  selectTodo,
}: {
  todo: Todo;
  onToggleComplete: (id: number, completed: boolean) => void;
  onDeleteTodo: (id: number) => void;
  selectTodo: (todo: Todo) => void;
}) {
  const isPastDue =
    todo.dueDate && new Date() > todo.dueDate && !todo.isComplete;

  return (
    <>
      <div
        onClick={() => selectTodo(todo)}
        className={cn(
          "transition-all duration-200",
          todo.isComplete && "opacity-70",
        )}
      >
        <div className="p-2">
          <div className="flex flex-row items-center gap-3">
            <Checkbox
              checked={todo.isComplete}
              onCheckedChange={(checked) => {
                onToggleComplete(todo.id, checked as boolean);
              }}
              className="z-50"
            />

            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <h3
                  className={cn(
                    "font-medium text-md",
                    todo.isComplete && "line-through text-muted-foreground",
                  )}
                >
                  {todo.name}
                </h3>
                <div className="flex items-center gap-2">
                  {todo.dueDate && (
                    <div
                      className={cn(
                        "flex items-center text-xs",
                        isPastDue ? "text-red-500" : "text-muted-foreground",
                      )}
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      <span>{format(todo.dueDate, "MMM d, yyyy 'at' h:mm a")}</span>
                    </div>
                  )}
                  {todo.tags && todo.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {todo.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="flex items-center gap-1 text-xs"
                        >
                          <Tag className="h-3 w-3" />
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {/* Ellipsis menu LAST on the right */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={e => e.stopPropagation()}
                            >
                              <span className="sr-only">Actions</span>
                              <EllipsisVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onDeleteTodo(todo.id)}
                              className="text-red-500 focus:text-red-500"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Actions</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator />
    </>
  );
}
