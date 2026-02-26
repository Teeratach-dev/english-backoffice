# Data Models

## Overview

ระบบใช้ MongoDB เป็น database และ Mongoose เป็น ODM
Validation ฝั่ง API ใช้ Zod schemas

---

## User

**Collection:** `users`
**Model:** `src/models/User.ts`
**Schema:** `src/schemas/user.schema.ts`

| Field      | Type     | Required | Unique | Description                 |
| ---------- | -------- | -------- | ------ | --------------------------- |
| email      | String   | Yes      | Yes    | อีเมล                       |
| password   | String   | Yes      | No     | รหัสผ่าน (hashed bcryptjs)  |
| name       | String   | Yes      | No     | ชื่อ                        |
| role       | String   | Yes      | No     | `admin` หรือ `superadmin`   |
| createdAt  | Date     | Auto     | No     | วันที่สร้าง                  |
| updatedAt  | Date     | Auto     | No     | วันที่แก้ไขล่าสุด            |

---

## Course

**Collection:** `courses`
**Model:** `src/models/Course.ts`
**Schema:** `src/schemas/course.schema.ts`

| Field        | Type     | Required | Description                 |
| ------------ | -------- | -------- | --------------------------- |
| name         | String   | Yes      | ชื่อ course                  |
| description  | String   | No       | รายละเอียด                   |
| price        | Number   | No       | ราคา                         |
| isActive     | Boolean  | No       | สถานะเปิด/ปิด (default: true)|
| purchaseable | Boolean  | No       | สามารถซื้อได้ (default: false)|
| createdBy    | ObjectId | No       | ref: User                    |
| updatedBy    | ObjectId | No       | ref: User                    |
| createdAt    | Date     | Auto     | วันที่สร้าง                   |
| updatedAt    | Date     | Auto     | วันที่แก้ไขล่าสุด             |

---

## Unit

**Collection:** `units`
**Model:** `src/models/Unit.ts`
**Schema:** `src/schemas/unit.schema.ts`

| Field       | Type     | Required | Description                |
| ----------- | -------- | -------- | -------------------------- |
| courseId     | ObjectId | Yes      | ref: Course                |
| name        | String   | Yes      | ชื่อ unit                   |
| description | String   | No       | รายละเอียด                  |
| sequence    | Number   | No       | ลำดับ (สำหรับ drag-drop)   |
| isActive    | Boolean  | No       | สถานะเปิด/ปิด              |
| createdBy   | ObjectId | No       | ref: User                  |
| updatedBy   | ObjectId | No       | ref: User                  |
| createdAt   | Date     | Auto     | วันที่สร้าง                 |
| updatedAt   | Date     | Auto     | วันที่แก้ไขล่าสุด           |

---

## Topic

**Collection:** `topics`
**Model:** `src/models/Topic.ts`
**Schema:** `src/schemas/topic.schema.ts`

| Field       | Type     | Required | Description                |
| ----------- | -------- | -------- | -------------------------- |
| unitId      | ObjectId | Yes      | ref: Unit                  |
| name        | String   | Yes      | ชื่อ topic                  |
| description | String   | No       | รายละเอียด                  |
| sequence    | Number   | No       | ลำดับ                      |
| isActive    | Boolean  | No       | สถานะเปิด/ปิด              |
| createdBy   | ObjectId | No       | ref: User                  |
| updatedBy   | ObjectId | No       | ref: User                  |
| createdAt   | Date     | Auto     | วันที่สร้าง                 |
| updatedAt   | Date     | Auto     | วันที่แก้ไขล่าสุด           |

---

## SessionGroup

**Collection:** `sessiongroups`
**Model:** `src/models/SessionGroup.ts`
**Schema:** `src/schemas/session-group.schema.ts`

| Field       | Type     | Required | Description                |
| ----------- | -------- | -------- | -------------------------- |
| topicId     | ObjectId | Yes      | ref: Topic                 |
| name        | String   | Yes      | ชื่อ session group          |
| description | String   | No       | รายละเอียด                  |
| sequence    | Number   | No       | ลำดับ                      |
| isActive    | Boolean  | No       | สถานะเปิด/ปิด              |
| createdBy   | ObjectId | No       | ref: User                  |
| updatedBy   | ObjectId | No       | ref: User                  |
| createdAt   | Date     | Auto     | วันที่สร้าง                 |
| updatedAt   | Date     | Auto     | วันที่แก้ไขล่าสุด           |

---

## SessionDetail

**Collection:** `sessiondetails`
**Model:** `src/models/SessionDetail.ts`
**Schema:** `src/schemas/session-detail.schema.ts`

| Field          | Type     | Required | Description                                      |
| -------------- | -------- | -------- | ------------------------------------------------ |
| sessionGroupId | ObjectId | Yes      | ref: SessionGroup                                |
| name           | String   | Yes      | ชื่อ session                                      |
| type           | String   | Yes      | `reading\|vocab\|listening\|grammar\|example\|test` |
| cefrLevel      | String   | No       | `A1\|A2\|B1\|B2\|C1\|C2`                         |
| screens        | Array    | No       | เนื้อหาบทเรียน (ดูโครงสร้างด้านล่าง)              |
| sequence       | Number   | No       | ลำดับ                                             |
| isActive       | Boolean  | No       | สถานะเปิด/ปิด                                     |
| createdBy      | ObjectId | No       | ref: User                                         |
| updatedBy      | ObjectId | No       | ref: User                                         |
| createdAt      | Date     | Auto     | วันที่สร้าง                                       |
| updatedAt      | Date     | Auto     | วันที่แก้ไขล่าสุด                                  |

### Screen Structure

```typescript
{
  id: string
  sequence: number
  actions: Action[]
}
```

### Action Structure

```typescript
{
  type: ActionType  // 1 ใน 13 ประเภท
  // fields ที่เหลือขึ้นอยู่กับ type (ดู 04-session-builder.md)
}
```

### ActionType Enum

```
explain | reading | audio | chat | image | column |
choice | reorder | match_card |
fill_sentence_by_typing | fill_sentence_with_choice |
write_sentence | write_sentence_in_chat
```

### Word Structure (ใช้ใน explain, reading, chat, fill actions)

```typescript
{
  text: string
  translations: string[]
  audioUrl?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  highlight?: boolean
  isBlank?: boolean
}
```

---

## SessionTemplate

**Collection:** `sessiontemplates`
**Model:** `src/models/SessionTemplate.ts`
**Schema:** `src/schemas/session-template.schema.ts`

| Field      | Type     | Required | Description                                      |
| ---------- | -------- | -------- | ------------------------------------------------ |
| name       | String   | Yes      | ชื่อ template                                     |
| type       | String   | No       | `reading\|vocab\|listening\|grammar\|example\|test` |
| screens    | Array    | No       | โครงสร้าง screens (เฉพาะ actionTypes)             |
| isActive   | Boolean  | No       | สถานะเปิด/ปิด                                     |
| createdBy  | ObjectId | No       | ref: User                                         |
| updatedBy  | ObjectId | No       | ref: User                                         |
| createdAt  | Date     | Auto     | วันที่สร้าง                                       |
| updatedAt  | Date     | Auto     | วันที่แก้ไขล่าสุด                                  |

### Template Screen Structure

```typescript
{
  sequence: number
  actionTypes: ActionType[]  // เฉพาะชื่อ type ไม่มีเนื้อหา
}
```

---

## Entity Relationships

```
User ─────────────────────────────┐
  │ createdBy / updatedBy         │
  ▼                               │
Course ──1:N──▶ Unit              │
                  │               │
                  ▼               │
                Topic             │
                  │               │
                  ▼               │
              SessionGroup        │
                  │               │
                  ▼               │
              SessionDetail ◀─────┘
                  │
                  ▼
            Screen[] ──▶ Action[]

SessionTemplate (standalone, reusable structure)
```
