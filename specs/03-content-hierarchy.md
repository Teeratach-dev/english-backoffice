# Feature: Content Hierarchy Management

## Overview

ระบบจัดการเนื้อหาแบบ hierarchical 5 ระดับ: Course > Unit > Topic > Session Group > Session
แต่ละระดับรองรับ CRUD, drag-and-drop reordering, search/filter และ pagination

## Hierarchy Structure

```
Course (คอร์สเรียน)
  └── Unit (บท)
        └── Topic (หัวข้อ)
              └── Session Group (กลุ่มบทเรียน)
                    └── Session / SessionDetail (บทเรียน)
```

---

## 1. Courses (คอร์สเรียน)

### Pages

| Page          | URL                          | Description                    |
| ------------- | ---------------------------- | ------------------------------ |
| Courses List  | `/courses`                   | แสดง/จัดการ courses ทั้งหมด     |
| Course Detail | `/courses/[courseId]/units`   | แก้ไข course + จัดการ units ภายใน |

### Fields

| Field         | Type     | Required | Description                  |
| ------------- | -------- | -------- | ---------------------------- |
| name          | string   | Yes      | ชื่อ course                   |
| description   | string   | No       | รายละเอียด                    |
| price         | number   | No       | ราคา                          |
| isActive      | boolean  | No       | สถานะเปิด/ปิด                |
| purchaseable  | boolean  | No       | สามารถซื้อได้หรือไม่           |

### Features
- CRUD operations ผ่าน dialog form
- Search & filter (ชื่อ, active status, purchaseable)
- Pagination
- แสดงจำนวน units ของแต่ละ course
- Navigate เข้าไปจัดการ units ภายใน

---

## 2. Units (บท)

### Pages

| Page        | URL                                        | Description                      |
| ----------- | ------------------------------------------ | -------------------------------- |
| Units List  | `/units`                                   | แสดง units ทั้งหมด (standalone)   |
| Units in Course | `/courses/[courseId]/units`             | แสดง units ภายใน course           |
| Unit Detail | `/courses/[courseId]/units/[unitId]/topics` | แก้ไข unit + จัดการ topics ภายใน  |

### Fields

| Field     | Type     | Required | Description        |
| --------- | -------- | -------- | ------------------ |
| courseId   | ObjectId | Yes      | Course ที่สังกัด    |
| name      | string   | Yes      | ชื่อ unit           |
| description| string  | No       | รายละเอียด          |
| sequence  | number   | Auto     | ลำดับ (drag-drop)  |
| isActive  | boolean  | No       | สถานะเปิด/ปิด      |

### Features
- CRUD operations
- Drag-and-drop reordering (บันทึกลำดับผ่าน `/api/units/reorder`)
- เลือก parent course ได้
- Sticky footer (Save/Cancel/Delete)

---

## 3. Topics (หัวข้อ)

### Pages

| Page         | URL                                                       | Description                          |
| ------------ | --------------------------------------------------------- | ------------------------------------ |
| Topics List  | `/topics`                                                 | แสดง topics ทั้งหมด (standalone)      |
| Topics in Unit | `/courses/[courseId]/units/[unitId]/topics`              | แสดง topics ภายใน unit                |
| Topic Detail | `/courses/[courseId]/units/[unitId]/topics/[topicId]/groups` | แก้ไข topic + จัดการ session groups |

### Fields

| Field    | Type     | Required | Description        |
| -------- | -------- | -------- | ------------------ |
| unitId   | ObjectId | Yes      | Unit ที่สังกัด      |
| name     | string   | Yes      | ชื่อ topic          |
| description | string | No      | รายละเอียด          |
| sequence | number   | Auto     | ลำดับ (drag-drop)  |
| isActive | boolean  | No       | สถานะเปิด/ปิด      |

### Features
- CRUD operations
- Drag-and-drop reordering
- Sticky footer (Save/Cancel/Delete)

---

## 4. Session Groups (กลุ่มบทเรียน)

### Pages

| Page               | URL                                                                    | Description                              |
| ------------------ | ---------------------------------------------------------------------- | ---------------------------------------- |
| Session Groups List| `/session-groups`                                                      | แสดง session groups ทั้งหมด (standalone)  |
| Groups in Topic    | `/courses/.../topics/[topicId]/groups`                                 | แสดง groups ภายใน topic                   |
| Group Detail       | `/courses/.../topics/[topicId]/groups/[groupId]/sessions`              | แก้ไข group + จัดการ sessions ภายใน       |

### Fields

| Field    | Type     | Required | Description           |
| -------- | -------- | -------- | --------------------- |
| topicId  | ObjectId | Yes      | Topic ที่สังกัด        |
| name     | string   | Yes      | ชื่อ session group     |
| description | string | No      | รายละเอียด             |
| sequence | number   | Auto     | ลำดับ (drag-drop)     |
| isActive | boolean  | No       | สถานะเปิด/ปิด         |

### Features
- CRUD operations
- Drag-and-drop reordering
- Sticky footer (Save/Cancel/Delete)

---

## 5. Sessions / SessionDetail (บทเรียน)

### Pages

| Page            | URL                                                                   | Description                        |
| --------------- | --------------------------------------------------------------------- | ---------------------------------- |
| Sessions List   | `/sessions`                                                           | แสดง sessions ทั้งหมด (standalone)  |
| Sessions in Group | `/courses/.../groups/[groupId]/sessions`                            | แสดง sessions ภายใน group           |
| Session Builder | `/courses/.../groups/[groupId]/sessions/[sessionId]/builder`          | Session Builder (ดู spec แยก)      |

### Fields

| Field          | Type     | Required | Description                                         |
| -------------- | -------- | -------- | --------------------------------------------------- |
| sessionGroupId | ObjectId | Yes      | Session Group ที่สังกัด                               |
| name           | string   | Yes      | ชื่อ session                                         |
| type           | enum     | Yes      | reading, vocab, listening, grammar, example, test    |
| cefrLevel      | enum     | No       | A1, A2, B1, B2, C1, C2                              |
| screens        | array    | No       | เนื้อหาบทเรียน (จัดการใน Session Builder)             |
| sequence       | number   | Auto     | ลำดับ (drag-drop)                                    |
| isActive       | boolean  | No       | สถานะเปิด/ปิด                                        |

### Session Types

| Type       | Description              |
| ---------- | ------------------------ |
| reading    | บทเรียนการอ่าน           |
| vocab      | บทเรียนคำศัพท์           |
| listening  | บทเรียนการฟัง            |
| grammar    | บทเรียนไวยากรณ์          |
| example    | ตัวอย่างประกอบ            |
| test       | แบบทดสอบ                 |

### CEFR Levels

| Level | Description               |
| ----- | ------------------------- |
| A1    | Beginner                  |
| A2    | Elementary                |
| B1    | Intermediate              |
| B2    | Upper Intermediate        |
| C1    | Advanced                  |
| C2    | Proficiency               |

---

## Common Features (ทุกระดับ)

### CRUD Operations
- **Create**: เพิ่มข้อมูลใหม่ผ่าน Dialog Form
- **Read**: แสดงข้อมูลในตาราง (DataTable) พร้อม pagination
- **Update**: แก้ไขผ่าน Dialog Form หรือ Detail Page
- **Delete**: ลบพร้อม confirmation dialog

### Drag-and-Drop Reordering
- ใช้ `@dnd-kit` สำหรับลากจัดลำดับ
- บันทึกลำดับใหม่ผ่าน `/api/[resource]/reorder`
- รองรับทุกระดับตั้งแต่ Units ถึง Sessions

### Navigation
- **Breadcrumb**: แสดง path ของ hierarchy ปัจจุบัน
- **Sidebar**: Navigation menu ที่แสดง active state
- **Sticky Footer**: ปุ่ม Save/Cancel/Delete ติดด้านล่างหน้าจอ

### Data Tracking
- ทุก record เก็บ `createdBy`, `updatedBy` (ref: User)
- ทุก record มี `timestamps` (createdAt, updatedAt)

## Key Files

- `src/app/(dashboard)/courses/` - Course pages
- `src/app/(dashboard)/units/` - Unit pages (standalone)
- `src/app/(dashboard)/topics/` - Topic pages (standalone)
- `src/app/(dashboard)/session-groups/` - Session group pages (standalone)
- `src/app/(dashboard)/sessions/` - Session pages (standalone)
- `src/components/features/courses/` - Course components
- `src/components/features/units/` - Unit components
- `src/components/features/topics/` - Topic components
- `src/components/features/session-groups/` - Session group components
- `src/components/features/sessions/` - Session components
- `src/components/common/data-table.tsx` - Reusable table
- `src/components/common/sticky-footer.tsx` - Sticky action footer
