import { getAllTags, getAllTodos } from "@/lib/database";
import { Todo, TodoTag } from "@/lib/types";
import TagPageClient from "./tag-page-client"; // Import the new client component

export default async function Tags() {
  const todos: Todo[] = await getAllTodos();
  const tags: TodoTag[] = await getAllTags();

  // This Server Component now fetches data and passes it to the Client Component
  return <TagPageClient todos={todos} initialTags={tags} />;
}
