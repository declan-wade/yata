// app/page.tsx - Server Component
import { getAllTodos, getAllTags, getInboxTodos, getTodayTodos } from "@/lib/database";
import TodoDashboard from "@/components/todo-dashboard";
import { Todo, TodoTag } from "@/lib/types";

export default async function Home() {
  // Fetch data on the server
  const todos: Todo[] = await getTodayTodos();
  const tags: TodoTag[] = await getAllTags();

  return <TodoDashboard header="Due Today" initialTodos={todos} tags={tags} />;
}
