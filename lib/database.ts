"use server";
import { PrismaClient } from "@prisma/client";
import { Todo, TodoTag } from "@/lib/types";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createTodo(
  name: string,
  date: Date | undefined,
  tag: number | undefined,
) {
  if (tag) {
    const response = await prisma.todo.create({
      data: {
        name: name,
        dueDate: date,
        tags: {
          connect: {
            id: tag,  // Connect the tag by its ID    
          },
      },
    }
    });
    // Revalidate the homepage to refresh server data
    revalidatePath("/");
    return response;
  } else {
    const response = await prisma.todo.create({
      data: {
        name: name,
        dueDate: date,
      },
    });
    // Revalidate the homepage to refresh server data
    revalidatePath("/");
    return response;
  }
}

export async function getAllTodos() {
  const response = await prisma.todo.findMany({
    include: {
      tags: true,
    },
  });
  console.log(response);
  return response as any;
}

export async function getInboxTodos() {
  const response = await prisma.todo.findMany({
   where: {
        dueDate: null,
      },
    include: {
      tags: true,
    },
  });
  console.log(response);
  return response as any;
}

export async function getTodayTodos() {
  const response = await prisma.todo.findMany({
  where: {
        dueDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    include: {
      tags: true,
    },
  });
  console.log(response);
  return response as any;
}

export async function getAllTags() {
  const response = await prisma.tag.findMany({});
  return response as any;
}

export async function createTag(name: string, icon: string | undefined) {
  const response = await prisma.tag.create({
    data: {
      name: name,
      icon: icon,
    },
  });
  return response;
}


export async function getFilteredTodo(tag: string) {
  const response = await prisma.todo.findMany({
    where: {
      tags: {
        some: {
          name: tag,
        },
      },
    },
    include: {
      tags: true,
    },
  });
  return response as any;
}