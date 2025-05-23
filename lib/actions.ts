"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import { stackServerApp } from "@/stack";

const prisma = new PrismaClient();

export async function setUserName(name: string): Promise<void> {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      throw new Error("User not found");
    }
    await user.update({
      displayName: name,
    });
  } catch (error) {
    console.error("Error setting user name:", error);
    throw new Error("Failed to set user name");
  }
}

// Server action to update a todo's status
export async function updateTodoStatus(
  id: number,
  isComplete: boolean,
): Promise<any> {
  try {
    const user = await stackServerApp.getUser();
    const updatedTodo = prisma.todo.update({
      where: { id: id },
      data: { isComplete },
    });

    // Revalidate the homepage to refresh server data
    revalidatePath("/");

    return updatedTodo;
  } catch (error) {
    console.error("Error updating todo status:", error);
    throw new Error("Failed to update todo status");
  }
}

// Server action to delete a todo
export async function deleteTodo(id: number): Promise<{ success: boolean }> {
  try {
    // Here you would implement your database delete logic
    // Example with a hypothetical database function:
    // await db.todos.delete({ where: { id } });

    // Revalidate the homepage to refresh server data
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw new Error("Failed to delete todo");
  }
}

// Server action to update a todo's details
export async function updateTodo(id: number, todoData: any): Promise<any> {
  try {
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: todoData,
    });

    // Revalidate the homepage to refresh server data
    revalidatePath("/");

    return updatedTodo;
  } catch (error) {
    console.error("Error updating todo:", error);
    throw new Error("Failed to update todo");
  }
}

export async function getCount(): Promise<any> {
  try {
    const inbox = await prisma.todo.count({
      where: {
        dueDate: null,
        isComplete: false,
      },
    });
    const dueToday = await prisma.todo.count({
      where: {
        dueDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
        isComplete: false,
      },
    });
    const dueThisWeek = await prisma.todo.count({
      where: {
        dueDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setDate(new Date().getDate() + 7)),
        },
        isComplete: false,
      },
    });
    const overdue = await prisma.todo.count({
      where: {
        dueDate: {
          lt: new Date(new Date().setHours(0, 0, 0, 0)),
        },
        isComplete: false,
      },
    });
    // Return the counts as an object
    revalidatePath("/");
    return {
      inbox: inbox,
      dueToday: dueToday,
      dueThisWeek: dueThisWeek,
      overdue: overdue,
    };
  } catch (error) {
    console.error("Error fetching count:", error);
    throw new Error("Failed to fetch count");
  }
}
