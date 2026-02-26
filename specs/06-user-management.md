# Feature: User Management

## Overview

ระบบจัดการผู้ดูแล (administrators) รองรับ CRUD operations และ role-based access control

## Page

### Users List (`/users`)

- **Route**: `src/app/(dashboard)/users/page.tsx`
- **Component**: `UserForm` (dialog-based)
- แสดง users ทั้งหมดในตาราง
- CRUD operations (Create/Read/Update/Delete)
- แสดง role ของแต่ละ user

## User Fields

| Field    | Type   | Required | Description                |
| -------- | ------ | -------- | -------------------------- |
| email    | string | Yes      | อีเมล (unique)             |
| password | string | Yes      | รหัสผ่าน (hashed ด้วย bcryptjs) |
| name     | string | Yes      | ชื่อผู้ใช้                  |
| role     | enum   | Yes      | admin, superadmin           |

## Roles

| Role        | Description                                |
| ----------- | ------------------------------------------ |
| admin       | ผู้ดูแลทั่วไป - จัดการเนื้อหาได้           |
| superadmin  | ผู้ดูแลระบบ - จัดการเนื้อหาและ users ได้   |

## Features

- เพิ่ม user ใหม่พร้อมกำหนด role
- แก้ไขข้อมูล user (ชื่อ, อีเมล, role)
- ลบ user พร้อม confirmation
- Password ถูก hash ก่อนบันทึกลง database
- แสดง role ของ current user จาก Redux store

## API Endpoints

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| GET    | `/api/users`      | รายการ users ทั้งหมด |
| POST   | `/api/users`      | สร้าง user ใหม่     |
| GET    | `/api/users/[id]` | ดึง user ตาม ID     |
| PUT    | `/api/users/[id]` | แก้ไข user          |
| DELETE | `/api/users/[id]` | ลบ user             |

## Key Files

- `src/app/(dashboard)/users/page.tsx` - Users list page
- `src/app/api/users/route.ts` - Users API (list, create)
- `src/app/api/users/[id]/route.ts` - User API (get, update, delete)
- `src/components/features/users/user-form.tsx` - User form component
- `src/models/User.ts` - Mongoose User model
