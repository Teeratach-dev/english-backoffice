# API Reference

## Overview

ระบบ REST API สร้างด้วย Next.js App Router (Route Handlers)
ทุก endpoint (ยกเว้น auth/login และ auth/refresh) ต้องมี valid `accessToken` cookie

## Base URL

```
/api
```

## Authentication

ระบบใช้ **dual-token** เก็บใน httpOnly cookie:
- `accessToken` — ใช้ยืนยันตัวตนทุก request (อายุ 1 วัน)
- `refreshToken` — ใช้ขอ accessToken ใหม่เมื่อหมดอายุ (อายุ 7 วัน)
- Middleware (`src/middleware.ts`) ตรวจสอบและ auto-refresh token โดยอัตโนมัติ

---

## Auth Endpoints

### POST `/api/auth/login`
Login เข้าสู่ระบบ — set `accessToken` + `refreshToken` cookie

**Request Body:**
```json
{ "email": "string", "password": "string" }
```

**Response:** `{ message, user: { id, email, name, role }, accessToken, refreshToken }`

### GET `/api/auth/me`
ดึงข้อมูล user ที่ login อยู่ (อ่านจาก `accessToken` cookie)

**Response:** `{ id, email, name, role }`

### POST `/api/auth/logout`
ออกจากระบบ — clear `accessToken` + `refreshToken` cookie

**Response:** `{ message: "Logged out successfully" }`

### POST `/api/auth/refresh`
ขอ `accessToken` ใหม่โดยใช้ `refreshToken` cookie (ไม่ต้องมี accessToken)

**Response:** `{ message: "Token refreshed" }` พร้อม set `accessToken` cookie ใหม่

**Error:** `401` ถ้าไม่มี refreshToken หรือ refreshToken invalid/หมดอายุ

### POST `/api/auth/change-password`
เปลี่ยนรหัสผ่าน

**Request Body:**
```json
{ "currentPassword": "string", "newPassword": "string" }
```

---

## Courses Endpoints

### GET `/api/courses`
ดึงรายการ courses พร้อม pagination

**Query Params:**
| Param         | Type    | Description          |
| ------------- | ------- | -------------------- |
| page          | number  | หน้า (default: 1)    |
| limit         | number  | จำนวนต่อหน้า         |
| search        | string  | ค้นหาตามชื่อ         |
| isActive      | boolean | filter active status |
| purchaseable  | boolean | filter purchaseable  |

**Response:** `{ data: Course[], pagination: { page, limit, total, totalPages } }`

### POST `/api/courses`
สร้าง course ใหม่

**Request Body:**
```json
{ "name": "string", "description": "string", "price": 0, "isActive": true, "purchaseable": false }
```

### GET `/api/courses/[id]`
ดึง course ตาม ID

### PUT `/api/courses/[id]`
แก้ไข course

### DELETE `/api/courses/[id]`
ลบ course

---

## Units Endpoints

### GET `/api/units`
**Query Params:** `courseId`, `page`, `limit`, `search`

### POST `/api/units`
```json
{ "courseId": "string", "name": "string", "description": "string", "isActive": true }
```

### GET `/api/units/[id]`
### PUT `/api/units/[id]`
### DELETE `/api/units/[id]`

### POST `/api/units/reorder`
จัดลำดับ units ใหม่
```json
{ "items": [{ "id": "string", "sequence": 0 }] }
```

---

## Topics Endpoints

### GET `/api/topics`
**Query Params:** `unitId`, `page`, `limit`, `search`

### POST `/api/topics`
```json
{ "unitId": "string", "name": "string", "description": "string", "isActive": true }
```

### GET `/api/topics/[id]`
### PUT `/api/topics/[id]`
### DELETE `/api/topics/[id]`

### POST `/api/topics/reorder`
```json
{ "items": [{ "id": "string", "sequence": 0 }] }
```

---

## Session Groups Endpoints

### GET `/api/session-groups`
**Query Params:** `topicId`, `page`, `limit`, `search`

### POST `/api/session-groups`
```json
{ "topicId": "string", "name": "string", "description": "string", "isActive": true }
```

### GET `/api/session-groups/[id]`
### PUT `/api/session-groups/[id]`
### DELETE `/api/session-groups/[id]`

### POST `/api/session-groups/reorder`
```json
{ "items": [{ "id": "string", "sequence": 0 }] }
```

---

## Sessions Endpoints

### GET `/api/sessions`
**Query Params:**
| Param          | Type    | Description               |
| -------------- | ------- | ------------------------- |
| sessionGroupId | string  | filter by session group   |
| type           | string  | filter by session type    |
| cefrLevel      | string  | filter by CEFR level      |
| isActive       | boolean | filter by active status   |
| page           | number  | pagination                |
| limit          | number  | pagination                |
| search         | string  | search by name            |

### POST `/api/sessions`
```json
{
  "sessionGroupId": "string",
  "name": "string",
  "type": "reading",
  "cefrLevel": "A1",
  "isActive": true
}
```

### GET `/api/sessions/[id]`
ดึง session พร้อม screens และ actions ทั้งหมด

**Query Params:**
| Param   | Type   | Description                                           |
| ------- | ------ | ----------------------------------------------------- |
| include | string | `breadcrumbs` - populate parent chain แล้ว return ancestor IDs + breadcrumbs array |

**Response (with `?include=breadcrumbs`):**
```json
{
  "...session fields",
  "sessionGroupId": "string (resolved ID)",
  "topicId": "string",
  "unitId": "string",
  "courseId": "string",
  "breadcrumbs": [
    { "_id": "string", "name": "string", "type": "course" },
    { "_id": "string", "name": "string", "type": "unit" },
    { "_id": "string", "name": "string", "type": "topic" },
    { "_id": "string", "name": "string", "type": "sessionGroup" },
    { "_id": "string", "name": "string", "type": "session" }
  ]
}
```

### PUT `/api/sessions/[id]`
อัปเดต session รวมถึง screens/actions (ใช้ใน Session Builder)
```json
{
  "name": "string",
  "type": "reading",
  "cefrLevel": "A1",
  "isActive": true,
  "screens": [
    {
      "id": "string",
      "sequence": 0,
      "actions": [{ "type": "explain", "...": "action-specific fields" }]
    }
  ]
}
```

### DELETE `/api/sessions/[id]`

### POST `/api/sessions/reorder`
```json
{ "items": [{ "id": "string", "sequence": 0 }] }
```

---

## Templates Endpoints

### GET `/api/templates`
**Query Params:** `type`, `isActive`, `page`, `limit`

### POST `/api/templates`
```json
{
  "name": "string",
  "type": "reading",
  "screens": [{ "sequence": 0, "actionTypes": ["explain", "reading", "choice"] }],
  "isActive": true
}
```

### GET `/api/templates/[id]`
### PUT `/api/templates/[id]`
### DELETE `/api/templates/[id]`

### GET `/api/templates/check`
ตรวจสอบว่ามี template ที่มีโครงสร้างเหมือนกันหรือไม่

**Query Params:** `screens` (JSON string ของ screen structure)

---

## Users Endpoints

### GET `/api/users`
**Query Params:** `page`, `limit`, `search`

### POST `/api/users`
```json
{ "email": "string", "password": "string", "name": "string", "role": "admin" }
```

### GET `/api/users/[id]`
### PUT `/api/users/[id]`
### DELETE `/api/users/[id]`

---

## Common Response Patterns

### Paginated Response
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

## Validation

- ทุก endpoint ใช้ Zod schema สำหรับ validate request body
- Schema files อยู่ใน `src/schemas/`
