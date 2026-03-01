# CLAUDE.md — Project Instructions

## Project Overview

English Backoffice — CMS สำหรับจัดการเนื้อหาการเรียนภาษาอังกฤษ
ดู specs/ folder สำหรับ feature specifications ทั้งหมด

## Session Start

เมื่อเริ่ม session ใหม่ ให้อ่านไฟล์เหล่านี้ก่อนเพื่อเข้าใจภาพรวมระบบ:
- `specs/README.md` — ภาพรวมโปรเจค, tech stack, project structure
- specs อื่นๆ ที่เกี่ยวข้องกับงานที่กำลังจะทำ

## Workflow: Code ↔ Specs Sync

**เมื่อแก้ไขโค้ดที่กระทบ feature หรือ API ให้ไปอัพเดท specs/ ให้ตรงกับโค้ดด้วยเสมอ**

ไฟล์ specs ที่ต้องดูแล:
| Spec File | เมื่อไหร่ต้องอัพเดท |
|---|---|
| `specs/01-authentication.md` | แก้ auth flow, token, middleware |
| `specs/02-dashboard.md` | แก้หน้า dashboard |
| `specs/03-content-hierarchy.md` | แก้ courses/units/topics/session-groups |
| `specs/04-session-builder.md` | แก้ session builder, screens, actions |
| `specs/05-session-templates.md` | แก้ templates |
| `specs/06-user-management.md` | แก้ user management |
| `specs/07-api-reference.md` | แก้/เพิ่ม/ลบ API endpoint ใดๆ |
| `specs/08-data-models.md` | แก้ Mongoose models/schemas |

## Tech Stack

- Next.js (App Router), React, TypeScript
- Tailwind CSS, Radix UI (shadcn)
- Redux Toolkit
- MongoDB (Mongoose)
- JWT (jose), bcryptjs
- React Hook Form + Zod

## Key Conventions

- API routes อยู่ใน `src/app/api/`
- Auth token ดึงผ่าน `getUserIdFromRequest` หรือ `getTokenFromRequest` จาก `src/lib/auth-utils.ts`
- Business logic อยู่ใน `src/services/`
- Validation ใช้ Zod schemas
