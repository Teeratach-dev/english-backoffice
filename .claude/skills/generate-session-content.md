# Workflow: Generate Session Content

คุณคือ Content Designer สำหรับแอปเรียนภาษาอังกฤษ
ทำหน้าที่สร้าง Session Detail content จากเป้าหมายที่ผู้ใช้ระบุ

## Input ที่รับ

ผู้ใช้จะให้ข้อมูล 3 ส่วน:

### 1. Parameters
- `unitId` — ObjectId ของ Unit ที่จะสร้าง Topic ภายใต้
- `cefrLevel` — ระดับ CEFR (A1, A2, B1, B2, C1, C2)

### 2. เป้าหมาย (plain text)

รูปแบบ input:

```
Topic 1 - ชื่อ Topic
    - วัตถุประสงค์
        - วัตถุประสงค์ข้อ 1
        - วัตถุประสงค์ข้อ 2
    - Session Group 1 - ชื่อ Session Group
        - วัตถุประสงค์
            - วัตถุประสงค์ข้อ 1
    - Session Group 2 - ชื่อ Session Group
        - วัตถุประสงค์
            - วัตถุประสงค์ข้อ 1
```

## ขั้นตอนการทำงาน

### STEP 1: Parse Input

แปลง plain text เป็น structured data:

```json
{
  "topic": {
    "name": "ความหมายและประเภทของคำคุณศัพท์ (Adjective)",
    "objectives": [
      "อธิบายได้ว่า คำคุณศัพท์ คืออะไร",
      "รู้จักคำคุณศัพท์ (Adjective) ในภาษาอังกฤษในแต่ล่ะประเภท"
    ]
  },
  "sessionGroups": [
    {
      "name": "ความหมายของคำคุณศัพท์ (Adjective)",
      "objectives": ["ระบุคำคุณศัพท์ในประโยคได้"]
    }
  ]
}
```

กฎการ parse:
- บรรทัด `Topic X - ชื่อ` → topic.name = ชื่อ (ตัด "Topic X - " ออก)
- บรรทัด `วัตถุประสงค์` ที่อยู่ใต้ Topic โดยตรง → topic.objectives[]
- บรรทัด `Session Group X - ชื่อ` → sessionGroups[].name = ชื่อ (ตัด "Session Group X - " ออก)
- บรรทัด `วัตถุประสงค์` ที่อยู่ใต้ Session Group → sessionGroups[].objectives[]

### STEP 2: Generate Plan (Preview)

สำหรับแต่ละ Session Group ให้คิด concept แล้วเรียก sub-skills ทั้ง 6 ตัว

#### 2.1 คิด Concept จากวัตถุประสงค์

จาก objectives ของ session group → คิด:
- **คำศัพท์หลัก** 8-12 คำ ที่เกี่ยวข้องกับหัวข้อ (พร้อมคำแปลไทย)
- **ประโยคตัวอย่าง** 6-10 ประโยค ที่ใช้คำศัพท์เหล่านั้น
- **สถานการณ์/บทสนทนา** 1-2 สถานการณ์ที่เป็นธรรมชาติ
- **กฎไวยากรณ์** ที่เกี่ยวข้องกับหัวข้อ (ถ้ามี)
- **ข้อผิดพลาดที่พบบ่อย** 2-3 ข้อ เพื่อใช้เป็น distractors

#### 2.2 เรียก Sub-Skills

อ่าน sub-skill files แล้ว generate ตาม template:

1. อ่าน `.claude/skills/generate-reading-sessions.md` → สร้าง Reading sessions
2. อ่าน `.claude/skills/generate-vocab-sessions.md` → สร้าง Vocab sessions
3. อ่าน `.claude/skills/generate-listening-sessions.md` → สร้าง Listening sessions
4. อ่าน `.claude/skills/generate-grammar-sessions.md` → สร้าง Grammar sessions
5. อ่าน `.claude/skills/generate-example-sessions.md` → สร้าง Example sessions
6. อ่าน `.claude/skills/generate-test-sessions.md` → สร้าง Test sessions

#### 2.3 สร้าง Plan Preview File

สร้างไฟล์ `.claude/plans/session-content-preview.md` แสดงผลลัพธ์ทั้งหมดในรูปแบบ:

```
========================================
Topic: ชื่อ Topic
CEFR: A1 | Unit ID: xxx
========================================

========================================
Session Group 1: ชื่อ Session Group
วัตถุประสงค์: ...
Concept: คำศัพท์หลัก: word1, word2, ...
========================================

--- Session: Reading - ชื่อ (1/N) ---
CEFR: A1 | Screens: X

  Screen 1: "ชื่อ Screen"
    [action_type] รายละเอียด
    [action_type] รายละเอียด

  Screen 2: "ชื่อ Screen"
    [action_type] รายละเอียด

--- Session: Vocab - ชื่อ (1/N) ---
...

(ทำซ้ำทุก session group)
```

### STEP 3: User Review

แสดง plan preview ให้ผู้ใช้ดู แล้วถาม:
- เนื้อหาตรงกับวัตถุประสงค์ไหม?
- ต้องปรับ action types หรือจำนวน screens ไหม?
- ต้องเพิ่ม/ลด sessions ไหม?

ผู้ใช้สามารถ:
- **Approve** → ไป STEP 4
- **แก้ไข** → กลับ STEP 2 ปรับตาม feedback
- **ยกเลิก**

### STEP 4: Generate Script & Execute

เมื่อผู้ใช้ approve ให้สร้าง TypeScript script ที่ `scripts/seed-session-<topic-slug>.ts`

Script template:

```typescript
import dbConnect from "../src/lib/db";
import Topic from "../src/models/Topic";
import SessionGroup from "../src/models/SessionGroup";
import SessionDetail from "../src/models/SessionDetail";
import User from "../src/models/User";
import mongoose from "mongoose";

const UNIT_ID = "<unitId>";
const CEFR_LEVEL = "<cefrLevel>";

function uuid() {
  return crypto.randomUUID();
}

function w(text: string, translation: string[] = [], options: Record<string, any> = {}): any {
  return { text, translation, isBlank: false, audioUrl: null, ...options };
}

function wBlank(text: string, translation: string[] = []): any {
  return { text, translation, isBlank: true, audioUrl: null };
}

async function main() {
  await dbConnect();

  const admin = await User.findOne({ role: "superadmin" });
  if (!admin) throw new Error("Super Admin not found");
  const userId = admin._id;

  // --- Topic ---
  let topic = await Topic.findOne({ unitId: UNIT_ID, name: "<topic_name>" });
  if (!topic) {
    const lastTopic = await Topic.findOne({ unitId: UNIT_ID }).sort({ sequence: -1 });
    topic = await Topic.create({
      unitId: UNIT_ID,
      name: "<topic_name>",
      description: "<topic_description>",
      sequence: (lastTopic?.sequence ?? -1) + 1,
      isActive: true,
      createdBy: userId,
      updatedBy: userId,
    });
    console.log("Created Topic:", topic.name, topic._id);
  } else {
    console.log("Topic exists:", topic.name, topic._id);
  }

  // --- Session Groups ---
  const sessionGroupsData = [
    { name: "<group_name>", description: "<group_description>" },
    // ...
  ];

  const sessionGroupIds: mongoose.Types.ObjectId[] = [];
  for (let i = 0; i < sessionGroupsData.length; i++) {
    const sg = sessionGroupsData[i];
    let group = await SessionGroup.findOne({ topicId: topic._id, name: sg.name });
    if (!group) {
      group = await SessionGroup.create({
        topicId: topic._id,
        name: sg.name,
        description: sg.description,
        sequence: i,
        isActive: true,
        createdBy: userId,
        updatedBy: userId,
      });
      console.log("Created Session Group:", group.name, group._id);
    } else {
      console.log("Session Group exists:", group.name, group._id);
    }
    sessionGroupIds.push(group._id);
  }

  // --- Session Details ---
  // สำหรับแต่ละ session group → สร้าง sessions ทั้ง 6 types
  // (generated data จาก plan preview จะถูกแทรกตรงนี้)

  console.log("Done!");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

บอกผู้ใช้ว่ารัน: `npx tsx --env-file=.env scripts/seed-session-<topic-slug>.ts`

## Data Structure Reference

### Word Object
```json
{
  "text": "beautiful",
  "translation": ["สวย", "งดงาม"],
  "isBlank": false,
  "audioUrl": null,
  "bold": false,
  "italic": false,
  "underline": false,
  "highlight": false
}
```

### Screen Object
```json
{
  "id": "uuid-string",
  "sequence": 0,
  "actions": [
    {
      "id": "uuid-string",
      "type": "explain",
      "sequence": 0,
      "marginTop": 10,
      "marginBottom": 0,
      "text": [{ "text": "hello", "translation": ["สวัสดี"], "isBlank": false }],
      "alignment": "left",
      "size": 16
    }
  ]
}
```

### Session Detail Object
```json
{
  "sessionGroupId": "ObjectId",
  "name": "Reading - ความหมายของคำคุณศัพท์",
  "type": "reading",
  "cefrLevel": "A1",
  "screens": [],
  "sequence": 0,
  "isActive": true,
  "createdBy": "ObjectId",
  "updatedBy": "ObjectId"
}
```

### Session Types
- `reading` — Reading
- `vocab` — Vocabulary
- `listening` — Listening
- `grammar` — Grammar
- `example` — Example
- `test` — Test

### CEFR Levels
- A1, A2, B1, B2, C1, C2

### Action Types (13 ประเภท)
- `explain` — แสดงข้อความอธิบาย
- `reading` — ข้อความสำหรับอ่าน
- `audio` — เล่นเสียง
- `chat` — บทสนทนา chat bubble
- `image` — แสดงรูปภาพ
- `column` — layout หลายคอลัมน์ (รับ image/reading/audio)
- `choice` — multiple choice (1 correct)
- `reorder` — จัดลำดับ
- `match_card` — จับคู่
- `fill_sentence_by_typing` — เติมคำโดยพิมพ์
- `fill_sentence_with_choice` — เติมคำจากตัวเลือก
- `write_sentence` — เขียนประโยค
- `write_sentence_in_chat` — เขียนตอบในบทสนทนา

## Content Quality Guidelines

1. **เนื้อหาต้องตรง CEFR level** — A1 ใช้คำง่าย ประโยคสั้น / C2 ใช้คำยาก ประโยคซับซ้อน
2. **คำศัพท์ต้องมี translation ภาษาไทย** ทุกคำ
3. **ประโยคตัวอย่างต้องเป็นธรรมชาติ** — ไม่ใช้ประโยคแปลกๆ
4. **Distractors ต้องสมจริง** — ตัวเลือกผิดต้องดูน่าเชื่อ ไม่ใช่คำมั่วๆ
5. **บทสนทนาต้องมีบริบท** — มี sender ชื่อคน มีสถานการณ์ชัดเจน
6. **ไม่อัดเนื้อหามากเกินไปใน 1 session** — ถ้าเยอะให้แบ่งเป็นหลาย sessions
7. **Audio/Image URLs ใส่ "" เป็น placeholder** ไปก่อน
8. **Sequence ต้องเรียงถูกต้อง** — เริ่มจาก 0, 1, 2, ...
9. **ID ใช้ crypto.randomUUID()** สำหรับ screen.id และ action.id
