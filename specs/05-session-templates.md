# Feature: Session Templates

## Overview

ระบบ Template สำหรับบันทึกโครงสร้าง session ที่ใช้ซ้ำได้
Template เก็บเฉพาะโครงสร้าง (action types ของแต่ละ screen) ไม่รวมเนื้อหาจริง

## Pages

### 1. Templates List (`/session-templates`)

- **Route**: `src/app/(dashboard)/session-templates/page.tsx`
- แสดง templates ทั้งหมดในตาราง
- Filter ตาม type และ active status
- แสดงโครงสร้าง action types ของแต่ละ template
- CRUD operations (Create/Edit/Delete)

### 2. Template Detail (`/session-templates/[templateId]`)

- **Route**: `src/app/(dashboard)/session-templates/[templateId]/page.tsx`
- Visual builder สำหรับสร้าง/แก้ไข template
- กำหนด screens และ action types ในแต่ละ screen
- บันทึก template พร้อม name, type, screens

## Template Structure

```typescript
{
  name: string           // ชื่อ template
  type: SessionType      // reading | vocab | listening | grammar | example | test
  screens: [
    {
      sequence: number
      actionTypes: ActionType[]  // เฉพาะ type ไม่มีเนื้อหา
    }
  ]
  isActive: boolean
  createdBy: User
  updatedBy: User
}
```

## Features

### Save Session as Template
- จากหน้า Session Builder สามารถบันทึก session ปัจจุบันเป็น template
- `SaveTemplateDialog` component
- ตรวจสอบ duplicate ก่อนบันทึก (`/api/templates/check`)

### Load Template to Session
- จากหน้า Session Builder สามารถโหลด template มาใช้
- `LoadTemplateDialog` component
- สร้าง screens ตามโครงสร้างของ template (เนื้อหาว่าง)

### Duplicate Detection
- ก่อนบันทึก template ใหม่ ระบบจะตรวจสอบว่ามี template ที่มีโครงสร้างเหมือนกันหรือไม่
- API: `GET /api/templates/check`

## API Endpoints

| Method | Endpoint               | Description                      |
| ------ | ---------------------- | -------------------------------- |
| GET    | `/api/templates`       | รายการ templates (filter: type, isActive) |
| POST   | `/api/templates`       | สร้าง template ใหม่              |
| GET    | `/api/templates/[id]`  | ดึง template ตาม ID              |
| PUT    | `/api/templates/[id]`  | แก้ไข template                   |
| DELETE | `/api/templates/[id]`  | ลบ template                      |
| GET    | `/api/templates/check` | ตรวจสอบ template ซ้ำ             |

## Key Files

- `src/app/(dashboard)/session-templates/page.tsx` - Templates list page
- `src/app/(dashboard)/session-templates/[templateId]/page.tsx` - Template detail page
- `src/components/features/templates/` - Template components
- `src/components/features/sessions/builder/save-template-dialog.tsx`
- `src/components/features/sessions/builder/load-template-dialog.tsx`
- `src/models/SessionTemplate.ts` - Mongoose model
- `src/schemas/session-template.schema.ts` - Zod validation
