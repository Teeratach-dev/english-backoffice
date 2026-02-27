# Feature: Session Builder

## Overview

Session Builder เป็น feature หลักของระบบ เป็น visual editor สำหรับสร้างบทเรียนแบบ interactive
ประกอบด้วย Screens ที่มี Actions หลากหลายประเภท รองรับ drag-and-drop, preview mode และ template system

## Page

- **URL**: `/sessions/[sessionId]/builder`
- **Route**: `src/app/(dashboard)/sessions/[sessionId]/builder/page.tsx`
- Page รับแค่ `sessionId` จาก URL แล้ว fetch parent IDs + breadcrumbs จาก API (`GET /api/sessions/${sessionId}?include=breadcrumbs`)
- Breadcrumb และ back navigation สร้างจาก API response (courseId → unitId → topicId → sessionGroupId)

## Structure

```
Session
├── Properties (name, type, cefrLevel, isActive)
└── Screens[] (ลำดับจัดเรียงได้)
    └── Actions[] (ลำดับจัดเรียงได้)
        └── Content (ตามประเภท action)
```

---

## Screen Management

| Feature              | Description                                    |
| -------------------- | ---------------------------------------------- |
| Add Screen           | เพิ่ม screen ใหม่                               |
| Delete Screen        | ลบ screen (พร้อม confirmation)                  |
| Reorder Screens      | ลากจัดลำดับ screen (drag-and-drop / up-down)    |
| Collapse/Expand      | ย่อ/ขยาย screen แต่ละอัน                        |
| Collapse/Expand All  | ย่อ/ขยาย screen ทั้งหมดพร้อมกัน                 |

---

## Action Types (13 ประเภท)

### 1. Explain (อธิบาย)
- แสดงข้อความอธิบายพร้อมการจัดรูปแบบ
- **Fields**: words[], alignment (left/center/right), fontSize (small/medium/large)
- **Word properties**: text, translations[], bold, italic, underline, highlight

### 2. Reading (อ่าน)
- ข้อความสำหรับอ่านพร้อมเสียง
- **Fields**: words[], audioUrl, isHideable, isReadable
- **Word properties**: text, translations[], bold, italic, underline, highlight, isBlank, audioUrl

### 3. Audio (เสียง)
- เล่นไฟล์เสียง
- **Fields**: audioUrl

### 4. Chat (แชท)
- แสดงข้อความในรูปแบบ chat bubble
- **Fields**: words[], sender, position (left/right), audioUrl, isDisplay, isReadable
- **Word properties**: text, translations[], bold, italic, underline, highlight, isBlank, audioUrl

### 5. Image (รูปภาพ)
- แสดงรูปภาพ
- **Fields**: imageUrl

### 6. Column (คอลัมน์)
- จัด layout หลายคอลัมน์ โดยแต่ละคอลัมน์มี action ย่อยได้
- **Fields**: columns[] (แต่ละ column มี action type: image/audio/reading)

### 7. Choice (ตัวเลือก)
- คำถามแบบ multiple choice
- **Fields**: choices[] (text, isCorrect)

### 8. Reorder (จัดลำดับ)
- แบบฝึกหัดจัดลำดับคำ/ประโยค
- **Fields**: items[] (ลำดับที่ถูกต้อง)

### 9. Match Card (จับคู่)
- แบบฝึกหัดจับคู่ข้อความ/เสียง
- **Fields**: pairs[] (left, right - text/audio)

### 10. Fill Sentence by Typing (เติมคำโดยพิมพ์)
- แบบฝึกหัดเติมคำในช่องว่างโดยพิมพ์คำตอบ
- **Fields**: words[] (text, isBlank, translations[])

### 11. Fill Sentence with Choice (เติมคำจากตัวเลือก)
- แบบฝึกหัดเติมคำในช่องว่างจาก dropdown
- **Fields**: words[] (text, isBlank, choices[])

### 12. Write Sentence (เขียนประโยค)
- แบบฝึกหัดเขียนประโยคอิสระ
- **Fields**: correctSentence, hint

### 13. Write Sentence in Chat (เขียนประโยคในแชท)
- แบบฝึกหัดเขียนประโยคในรูปแบบ chat
- **Fields**: correctSentence, hint, sender, position

---

## Word Editor System

ระบบแก้ไขคำศัพท์ในระดับ word สำหรับ action types ที่มีข้อความ

### Word Properties

| Property     | Type     | Description                |
| ------------ | -------- | -------------------------- |
| text         | string   | ตัวอักษร/คำ                 |
| translations | string[] | คำแปล                      |
| audioUrl     | string   | URL ไฟล์เสียงของคำ          |
| bold         | boolean  | ตัวหนา                     |
| italic       | boolean  | ตัวเอียง                    |
| underline    | boolean  | ขีดเส้นใต้                  |
| highlight    | boolean  | เน้นสี                      |
| isBlank      | boolean  | เป็นช่องว่าง (สำหรับ fill-in)|

---

## Template Integration

| Feature             | Description                                      |
| ------------------- | ------------------------------------------------ |
| Save as Template    | บันทึก session ปัจจุบันเป็น template              |
| Load Template       | โหลด template มาใช้กับ session                    |
| Duplicate Check     | ตรวจสอบว่ามี template คล้ายกันอยู่แล้วหรือไม่      |

---

## Preview Mode

- แสดง session ในมุมมอง mobile phone (PhonePreview component)
- Preview แต่ละ action type ตาม design ของ mobile app
- สลับระหว่าง editor mode และ preview mode ได้

---

## Change Tracking

- ตรวจจับว่ามีการแก้ไขที่ยังไม่ได้บันทึก
- แจ้งเตือนเมื่อ user พยายาม navigate ออกโดยไม่บันทึก
- Discard confirmation dialog

---

## Key Components

| Component             | File Location                                                 | Description                    |
| --------------------- | ------------------------------------------------------------- | ------------------------------ |
| SessionBuilder        | `src/components/features/sessions/builder/session-builder.tsx`| Main builder component         |
| SortableScreenCard    | `src/components/features/sessions/builder/sortable-screen-card.tsx` | Screen card with DnD      |
| SortableActionItem    | `src/components/features/sessions/builder/sortable-action-item.tsx` | Action item with DnD      |
| ActionTypeSelector    | `src/components/features/sessions/builder/action-type-selector.tsx` | Action type dropdown      |
| ActionContentEditor   | `src/components/features/sessions/builder/action-content-editor.tsx` | Dynamic action form      |
| PhonePreview          | `src/components/features/sessions/builder/phone-preview.tsx`  | Mobile preview                 |
| WordEditor            | `src/components/features/sessions/builder/word-editor.tsx`    | Word-level editing             |
| SaveTemplateDialog    | `src/components/features/sessions/builder/save-template-dialog.tsx` | Save as template dialog  |
| LoadTemplateDialog    | `src/components/features/sessions/builder/load-template-dialog.tsx` | Load template dialog     |

### Action Form Components

| Action Type              | Form Component                       |
| ------------------------ | ------------------------------------ |
| Explain                  | `ExplainActionForm`                  |
| Reading                  | `ReadingActionForm`                  |
| Audio                    | `AudioActionForm`                    |
| Chat                     | `ChatActionForm`                     |
| Image                    | `ImageActionForm`                    |
| Column                   | `ColumnActionForm`                   |
| Choice                   | `ChoiceActionForm`                   |
| Reorder                  | `ReorderActionForm`                  |
| Match Card               | `MatchCardActionForm`                |
| Fill Sentence by Typing  | `FillSentenceByTypingActionForm`     |
| Fill Sentence with Choice| `FillSentenceByChoiceActionForm`     |
| Write Sentence           | `WriteSentenceActionForm`            |
| Write Sentence in Chat   | `WriteSentenceInChatActionForm`      |
