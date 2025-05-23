import { getAllTags, getAllTodos } from "@/lib/database";
import { Todo, TodoTag } from "@/lib/types";
import TagPageClient from "./tag-page-client"; // Import the new client component

export default async function Tags() {
  const todos: Todo[] = await getAllTodos();
  const tags: TodoTag[] = await getAllTags();

  return <TagPageClient todos={todos} initialTags={tags} />;
}
