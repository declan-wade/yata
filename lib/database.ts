"use server";
import { PrismaClient } from "@prisma/client";
import { Todo, TodoTag } from "@/lib/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { unstable_cache as cache } from 'next/cache';
import { stackServerApp } from "@/stack";

const prisma = new PrismaClient();

export async function createTodo(
  name: string,
  date: Date | undefined,
  tag: number | undefined,
) {
  const user = await stackServerApp.getUser();
  if (!user?.id) {
    throw new Error("User not authenticated");
  }
  if (tag) {
    const response = await prisma.todo.create({
      data: {
        name: name,
        dueDate: date,
        tags: {
          connect: {
            id: tag, // Connect the tag by its ID
          },
        },
        userId: user.id,
      },
    });
    // Revalidate the homepage to refresh server data
    revalidateTag("todos");
    return response;
  } else {
    const response = await prisma.todo.create({
      data: {
        name: name,
        dueDate: date,
        userId: user.id,
      },
    });
    // Revalidate the homepage to refresh server data
    revalidateTag("todos");
    return response;
  }
}

// Create a cached function that accepts userId as a parameter
const getCachedTodos = cache(
  async (userId: string) => {
    const response = await prisma.todo.findMany({
      where: {
         userId: userId,
      },
      include: {
        tags: true,
      },
      orderBy: {
        order: "asc",
      },
    });
    return response as any;
  },
  ['all_todos'], // Cache key prefix
  { tags: ['todos'] } // Cache tag
);

// Wrapper function that handles authentication
export async function getAllTodos() {
  const user = await stackServerApp.getUser();
  if (!user?.id) {
    throw new Error("User not authenticated");
  }
  const response = await prisma.todo.findMany({
    where: {
      userId: user.id,
    },
    include: {
      tags: true,
    },
    orderBy: {
      order: "asc",
    },
  });
  console.log(response);
  return response as any;
}

export async function getInboxTodos() {
  const user = await stackServerApp.getUser();
  if (!user?.id) {
    throw new Error("User not authenticated");
  }
  const response = await prisma.todo.findMany({
    where: {
      dueDate: null,
      userId: user.id,
    },
    include: {
      tags: true,
    },
    orderBy: {
      order: "asc",
    },
  });
  console.log(response);
  return response as any;
}

export async function getTodayTodos() {
  const user = await stackServerApp.getUser();
  if (!user?.id) {
    throw new Error("User not authenticated");
  }
  const response = await prisma.todo.findMany({
    where: {
      dueDate: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
      userId: user.id,
    },
    include: {
      tags: true,
    },
    orderBy: {
      order: "asc",
    },
  });
  // console.log(response);
  return response as any;
}

// Create a cached function that accepts userId as a parameter
const getCachedTags = cache(
  async (userId: string) => {
    const response = await prisma.tag.findMany({
      where: {
        userId: userId,
      },
    });
    return response as any;
  },
  ['all_tags'], // Cache key prefix
  { tags: ['tags'] } // Cache tag
);

// Wrapper function that handles authentication
export async function getAllTags() {
  const user = await stackServerApp.getUser();
  if (!user?.id) {
    throw new Error("User not authenticated");
  }
  return getCachedTags(user.id);
}

export async function createTag(name: string, icon: string | undefined) {
  const user = await stackServerApp.getUser();
  if (!user?.id) {
    throw new Error("User not authenticated");
  }
  const response = await prisma.tag.create({
    data: {
      name: name,
      icon: icon,
      userId: user.id,
    },
  });
  return response;
}

export async function getFilteredTodo(tag: string) {
  const user = await stackServerApp.getUser();
  if (!user?.id) {
    throw new Error("User not authenticated");
  }
  const response = await prisma.todo.findMany({
    where: {
      tags: {
        some: {
          name: tag,
        },
      },
      userId: user.id,
    },
    include: {
      tags: true,
    },
    orderBy: {
      order: "asc",
    },
  });
  return response as any;
}
