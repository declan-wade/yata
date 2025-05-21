// app/page.tsx - Server Component
import { getAllTodos, getAllTags } from "@/lib/database";
import TodoDashboard from "@/components/todo-dashboard";
import { Todo, TodoTag } from "@/lib/types";

export default async function Home() {
  // Fetch data on the server
  const todos: Todo[] = await getAllTodos();
  const tags: TodoTag[] = await getAllTags();

  return <TodoDashboard header="My Tasks" initialTodos={todos} tags={tags} />;
}
