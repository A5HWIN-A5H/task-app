# Task App

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

Task App is a full-stack task management application built with React, Node.js, and MongoDB. The project uses TypeScript across the stack to maintain type safety and focuses on a clear separation of concerns between client state and server state.

---

## Features

### Authentication & Access Control
* **JWT Authentication:** Stateless authentication managed via Axios interceptors.
* **Domain Restriction:** Registration is restricted to `@gmail.com` addresses. This is validated on the client side (Zod) and enforced on the server.
* **Role-Based Access Control (RBAC):** Users are assigned `USER` or `ADMIN` roles. Standard users manage their own tasks, while Admins have access to a separate dashboard to manage the platform.

### Task Management
* **Server-Side Operations:** Search, filtering, and pagination are handled by the MongoDB database via URL parameters to keep the client lightweight.
* **State Synchronization:** TanStack Query handles cache invalidation to update the UI when tasks are created, edited, or deleted without full page reloads.

### Admin Dashboard
* **System Stats:** Uses MongoDB aggregation pipelines to calculate total tasks, completion ratios, and active users.
* **User Management:** Admins can view all registered users and toggle account suspension. Suspended accounts are blocked at the middleware level.

### UI & Validation
* **Dark Mode:** Custom React Context and Tailwind v4 configure a class-based dark mode that saves user preference in `localStorage`.
* **Form Validation:** Zod schemas are used on both the frontend and backend to validate data before processing.

---

## Tech Stack

**Frontend (`/client`)**
* **React & Vite:** UI library and build tool.
* **TanStack Query:** Handles server state, caching, and data fetching.
* **Tailwind CSS v4:** Utility-first CSS framework.
* **React Hook Form + Zod:** Form state management and schema validation.

**Backend (`/server`)**
* **Node.js & Express:** API server and routing.
* **TypeScript:** Configured with strict compiler settings.
* **MongoDB & Mongoose:** Database and ODM.
* **SWC & Jest:** Test runner and compiler, using `mongodb-memory-server` for isolated integration tests.

---



## Local Development

### Prerequisites
* Node.js (v18+)
* MongoDB (Local instance or Atlas URI)

### 1. Installation
```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/task-app.git](https://github.com/YOUR_GITHUB_USERNAME/task-app.git)
cd task-app

# Install Backend Dependencies
cd server
npm install

# Install Frontend Dependencies
cd ../client
npm install
