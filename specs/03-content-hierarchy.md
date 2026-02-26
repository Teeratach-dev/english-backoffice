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

| Page          | URL                      | Description                    |
| ------------- | ------------------------ | ------------------------------ |
| Courses List  | `/courses`               | แสดง/จัดการ courses ทั้งหมด     |
| Course Detail | `/courses/[courseId]`    | แก้ไข course + จัดการ units ภายใน |

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

| Page        | URL                | Description                      |
| ----------- | ------------------ | -------------------------------- |
| Units List  | `/units`           | แสดง units ทั้งหมด (standalone)   |
| Unit Detail | `/units/[unitId]`  | แก้ไข unit + จัดการ topics ภายใน  |

> **Note:** Unit Detail page ใช้แค่ `unitId` จาก URL แล้ว fetch parent IDs (courseId) จาก API response เพื่อ build breadcrumbs และ back navigation

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

| Page         | URL                    | Description                          |
| ------------ | ---------------------- | ------------------------------------ |
| Topics List  | `/topics`              | แสดง topics ทั้งหมด (standalone)      |
| Topic Detail | `/topics/[topicId]`    | แก้ไข topic + จัดการ session groups   |

> **Note:** Topic Detail page ใช้แค่ `topicId` จาก URL แล้ว fetch parent IDs (unitId, courseId) จาก API response เพื่อ build breadcrumbs และ back navigation

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

| Page               | URL                              | Description                              |
| ------------------ | -------------------------------- | ---------------------------------------- |
| Session Groups List| `/session-groups`                | แสดง session groups ทั้งหมด (standalone)  |
| Group Detail       | `/session-groups/[groupId]`      | แก้ไข group + จัดการ sessions ภายใน       |

> **Note:** Group Detail page ใช้แค่ `groupId` จาก URL แล้ว fetch parent IDs (topicId, unitId, courseId) จาก API response เพื่อ build breadcrumbs และ back navigation

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

| Page            | URL                                    | Description                        |
| --------------- | -------------------------------------- | ---------------------------------- |
| Sessions List   | `/sessions`                            | แสดง sessions ทั้งหมด (standalone)  |
| Session Builder | `/sessions/[sessionId]/builder`        | Session Builder (ดู spec แยก)      |

> **Note:** Session Builder page ใช้แค่ `sessionId` จาก URL แล้ว fetch parent IDs + breadcrumbs จาก API (`?include=breadcrumbs`) เพื่อ build navigation

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

### Navigation (Flat Routing)
- **Flat Route Pattern**: แต่ละ detail page รับแค่ ID ของตัวเอง (เช่น `/units/[unitId]` แทน `/courses/[courseId]/units/[unitId]/topics`)
- **Breadcrumb**: สร้างจาก parent IDs ที่ได้จาก API response (`?include=children` หรือ `?include=breadcrumbs`) → map ไปยัง flat route paths
- **Back Navigation**: ใช้ parent ID จาก API response (เช่น `unit.courseId` → navigate ไป `/courses/${courseId}`)
- **Sidebar**: Navigation menu ที่ detect active state ด้วย `pathname.startsWith()` แบบง่าย
- **Sticky Footer**: ปุ่ม Save/Cancel/Delete ติดด้านล่างหน้าจอ

### Data Tracking
- ทุก record เก็บ `createdBy`, `updatedBy` (ref: User)
- ทุก record มี `timestamps` (createdAt, updatedAt)

## Route Summary

| Route                            | Description                    |
| -------------------------------- | ------------------------------ |
| `/courses`                       | Courses list (table)           |
| `/courses/[courseId]`            | Course detail + units list     |
| `/units`                         | Units list (table)             |
| `/units/[unitId]`               | Unit detail + topics list      |
| `/topics`                        | Topics list (table)            |
| `/topics/[topicId]`             | Topic detail + groups list     |
| `/session-groups`                | Session groups list (table)    |
| `/session-groups/[groupId]`     | Group detail + sessions list   |
| `/sessions`                      | Sessions list (table)          |
| `/sessions/[sessionId]/builder` | Session builder                |

## Key Files

- `src/app/(dashboard)/courses/` - Course list + detail pages
- `src/app/(dashboard)/units/` - Unit list + detail pages
- `src/app/(dashboard)/topics/` - Topic list + detail pages
- `src/app/(dashboard)/session-groups/` - Session group list + detail pages
- `src/app/(dashboard)/sessions/` - Session list + builder pages
- `src/components/features/courses/` - Course components
- `src/components/features/units/` - Unit components
- `src/components/features/topics/` - Topic components
- `src/components/features/session-groups/` - Session group components
- `src/components/features/sessions/` - Session components
- `src/components/common/data-table.tsx` - Reusable table
- `src/components/common/sticky-footer.tsx` - Sticky action footer
