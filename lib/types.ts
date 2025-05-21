// Types for the Todo application
export interface Todo {
  id: number;
  name: string;
  order?: number; // Order of the todo in the list
  description?: string;
  isComplete: boolean;
  dueDate?: string | Date;
  tags?: TodoTag[]; // IDs of associated tags
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface TodoTag {
  id: number;
  name: string;
  icon?: string;
}

// Props for the TodoList component
export interface TodoListProps {
  todos: Todo[];
  tags: TodoTag[];
  header: string;
  onSelectTodo: (todo: Todo) => void;
  onToggleComplete: (id: number, completed: boolean) => void;
  onDeleteTodo: (id: number) => void;
}

// Props for the TodoSidebar component
export interface TodoSidebarProps {
  selectedTodo: Todo | null;
  allTags: TodoTag[];
  onClose: () => void;
  onMarkComplete: (id: number, completed: boolean) => void;
  onDeleteTodo: (id: number) => void;
}

export interface TodoDashboardProps {
  initialTodos: Todo[];
  header: string;
  tags: TodoTag[];
}
