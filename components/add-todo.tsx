"use client";
import React from "react";
import { toast } from "sonner";
import { DateTimePicker } from "@/components/datetime-picker";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CommandShortcut } from "./ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTodo } from "@/lib/database";
import type { AddTodoProps } from "@/lib/types"; // Import AddTodoProps

export function AddTodo({ tags, onTodoAdded }: AddTodoProps) { // Use AddTodoProps
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [name, setName] = React.useState("");
  const [tag, setTag] = React.useState<number | undefined>(undefined);

  async function handleAdd() {
    if (!name.trim()) {
      toast.error("Todo name cannot be empty.");
      return;
    }

    const promise = () => createTodo(name, date, tag);

    toast.promise(promise, {
      loading: "Creating todo...",
      success: (data) => {
        setName("");
        setDate(undefined);
        setTag(undefined);
        if (onTodoAdded) {
          onTodoAdded();
        }
        return "Todo created successfully!";
      },
      error: (err) => {
        return "Failed to create todo. Please try again.";
      },
    });
  }

  return (
    <div className="flex flex-col gap-2 md:grid md:grid-cols-12 md:gap-3">
      <Input
        placeholder="Enter something descriptive here..."
        className="shadow-none md:col-span-6"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => console.log(e)}
      />
      <div className="md:col-span-3">
        <DateTimePicker value={date} onChange={setDate} />
      </div>
      <div className="md:col-span-2">
        <Select onValueChange={(e: any) => setTag(e)}>
          <SelectTrigger className="w-full shadow-none">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            {tags && tags.length > 0
              ? tags.map((item: any) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}{" "}
                    {item.icon ? <item.icon className="ml-auto" /> : null}
                  </SelectItem>
                ))
              : null}
          </SelectContent>
        </Select>
      </div>
      <Button className="shadow-none md:col-span-1" onClick={handleAdd}>
        Add <CommandShortcut>⏎</CommandShortcut>
      </Button>
    </div>
  );
}
