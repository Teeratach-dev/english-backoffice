# English Backoffice - Feature Specifications

## Project Overview

English Backoffice เป็นระบบ Content Management System (CMS) สำหรับจัดการเนื้อหาการเรียนภาษาอังกฤษ
ออกแบบมาให้ผู้ดูแลระบบสามารถสร้าง จัดการ และจัดระเบียบ Courses ที่มีโครงสร้างเนื้อหาแบบ hierarchical
พร้อม Session Builder สำหรับสร้างบทเรียนแบบ interactive

## Tech Stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Framework        | Next.js 16.1.6 (App Router)        |
| Frontend         | React 19.2.3, TypeScript            |
| Styling          | Tailwind CSS 4, Radix UI (shadcn)  |
| State Management | Redux Toolkit                       |
| Database         | MongoDB (Mongoose 9.2.1)           |
| Auth             | JWT (jose), bcryptjs                |
| Forms            | React Hook Form + Zod              |
| Drag & Drop      | @dnd-kit                            |
| Notifications    | Sonner                              |

## Content Hierarchy

```
Course
  └── Unit
        └── Topic
              └── Session Group
                    └── Session (SessionDetail)
                          └── Screen
                                └── Action (13 types)
```

## Feature List

| # | Feature                          | Spec File                                                  |
|---|----------------------------------|------------------------------------------------------------|
| 1 | Authentication & Authorization   | [01-authentication.md](./01-authentication.md)             |
| 2 | Dashboard                        | [02-dashboard.md](./02-dashboard.md)                       |
| 3 | Content Hierarchy Management     | [03-content-hierarchy.md](./03-content-hierarchy.md)       |
| 4 | Session Builder                  | [04-session-builder.md](./04-session-builder.md)           |
| 5 | Session Templates                | [05-session-templates.md](./05-session-templates.md)       |
| 6 | User Management                  | [06-user-management.md](./06-user-management.md)           |
| 7 | API Reference                    | [07-api-reference.md](./07-api-reference.md)               |
| 8 | Data Models                      | [08-data-models.md](./08-data-models.md)                   |

## Route Structure (Flat Routing)

แต่ละ detail page รับเฉพาะ ID ของตัวเองจาก URL แล้วใช้ API response สำหรับ breadcrumbs และ back navigation

```
(dashboard)/
├── page.tsx                              # Dashboard
├── courses/page.tsx                      # Courses list
├── courses/[courseId]/page.tsx            # Course detail + units list
├── units/page.tsx                        # Units list (standalone)
├── units/[unitId]/page.tsx               # Unit detail + topics list
├── topics/page.tsx                       # Topics list (standalone)
├── topics/[topicId]/page.tsx             # Topic detail + session groups list
├── session-groups/page.tsx               # Session groups list (standalone)
├── session-groups/[groupId]/page.tsx     # Group detail + sessions list
├── sessions/page.tsx                     # Sessions list (standalone)
├── sessions/[sessionId]/builder/page.tsx # Session builder
├── session-templates/page.tsx            # Templates list
├── session-templates/[templateId]/page.tsx # Template detail
├── users/page.tsx                        # Users list
└── change-password/page.tsx              # Change password
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/              # Login page
│   ├── (dashboard)/               # Protected routes (flat routing)
│   ├── api/                       # REST API endpoints
│   └── layout.tsx                 # Root layout with providers
├── components/
│   ├── common/                    # Reusable components (DataTable, SearchAndFilter, etc.)
│   ├── features/                  # Feature-specific components
│   ├── layouts/                   # Sidebar, Navbar, PageHeader
│   ├── providers/                 # Context/Redux providers
│   └── ui/                        # Radix UI primitives
├── lib/                           # Auth, DB, JWT, Utils
├── models/                        # Mongoose schemas
├── schemas/                       # Zod validation schemas
├── services/                      # Business logic layer
├── store/                         # Redux store (auth slice)
├── types/                         # TypeScript type definitions
└── hooks/                         # Custom React hooks
```
