# Yata - Yet Another Todo App

Yata is a modern, full-stack todo application designed to help you manage your tasks efficiently. It features a clean user interface and a robust set of functionalities to keep you organized.

## ✨ Features

*   **📝 Full CRUD Operations:** Create, Read, Update, and Delete your todos with ease.
*   **🏷️ Tagging System:** Organize your todos with customizable tags, including icons.
*   **🗓️ Due Dates & Filtering:** Assign due dates to your tasks and filter them by:
    *   Inbox (no due date)
    *   Today
    *   This Week (upcoming 7 days)
    *   Overdue tasks
*   **🔍 Tag-Based Filtering:** View all tasks associated with a specific tag.
*   **📱 Responsive Design:** Works seamlessly on desktop and mobile devices.
*   **🎨 Theming:** Supports light and dark modes.
*   **🚀 Built with Modern Tech:** Leverages a powerful stack for a smooth user experience.

## 🛠️ Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (with Turbopack)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Database ORM:** [Prisma](https://www.prisma.io/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Radix UI](https://www.radix-ui.com/) & Custom Components
*   **State Management/Server Actions:** Next.js Server Actions
*   **Package Manager:** [Bun](https://bun.sh/)

## 🚀 Getting Started

Follow these instructions to set up the project locally for development.

### Prerequisites

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [Bun](https://bun.sh/) (version 1.0 or higher)
*   A PostgreSQL, MySQL, or SQLite database. The project uses Prisma, which can be configured to work with various databases. The default configuration in `prisma/schema.prisma` might specify a particular database (e.g., PostgreSQL).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd yata
    ```
    *(Replace `<repository-url>` with the actual URL of this repository)*

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up your database:**
    *   Ensure your database server is running.
    *   Configure your database connection string in a `.env` file at the root of the project. Create one if it doesn't exist, and add your `DATABASE_URL`:
        ```env
        DATABASE_URL="your_database_connection_string_here"
        ```
        *(Example for PostgreSQL: `DATABASE_URL="postgresql://user:password@host:port/database_name"`)*
    *   Apply database migrations:
        ```bash
        npx prisma migrate dev
        ```
    *   Generate Prisma Client:
        ```bash
        npx prisma generate
        ```

4.  **Run the development server:**
    ```bash
    bun run dev
    ```
    The application should now be running at [http://localhost:3000](http://localhost:3000).

### Other Useful Commands

*   **Run linters:**
    ```bash
    bun run lint
    ```

*   **Build for production:**
    ```bash
    bun run build
    ```

*   **Start production server:**
    ```bash
    bun run start
    ```
