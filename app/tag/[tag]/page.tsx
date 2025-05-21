// app/page.tsx - Server Component
import { getAllTags, getFilteredTodo } from "@/lib/database";
import TodoDashboard from "@/components/todo-dashboard";
import { Todo, TodoTag } from "@/lib/types";

interface PageProps {
  params: { tag: string };
}

export default async function Home({ params }: PageProps) {
  // Fetch data on the server using the dynamic tag param
  const todos: Todo[] = await getFilteredTodo(params.tag);
  const tags: TodoTag[] = await getAllTags();

  return <TodoDashboard header={params.tag} initialTodos={todos} tags={tags} />;
}
