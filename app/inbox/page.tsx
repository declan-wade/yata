// app/page.tsx - Server Component
import { getAllTodos, getAllTags, getInboxTodos } from "@/lib/database";
import TodoDashboard from "@/components/todo-dashboard";
import { Todo, TodoTag } from "@/lib/types";

export default async function Home() {
  // Fetch data on the server
  const todos: Todo[] = await getInboxTodos();
  const tags: TodoTag[] = await getAllTags();

  return <TodoDashboard header="Inbox" initialTodos={todos} tags={tags} />;
}
