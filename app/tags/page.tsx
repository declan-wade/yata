// Removed unused React import
// Removed AppSidebar, date-fns, Separator, Sidebar components, and TagManagement imports
// as they are now handled by TagPageClient
import { getAllTags, getAllTodos } from "@/lib/database";
import { Todo, TodoTag } from "@/lib/types";
import TagPageClient from "./tag-page-client"; // Import the new client component



export default async function Home() {
  const todos: Todo[] = await getAllTodos();
  const tags: TodoTag[] = await getAllTags();

  // This Server Component now fetches data and passes it to the Client Component
  return <TagPageClient todos={todos} initialTags={tags} />;
}
