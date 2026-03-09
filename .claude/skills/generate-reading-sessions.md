# Sub-Skill: Generate Reading Sessions

สร้าง Session Detail type `reading` สำหรับแอปเรียนภาษาอังกฤษ
เน้นให้ผู้เรียนอ่านเรื่องสั้น บทสนทนา สังเกตรูปประโยค และเห็นคำศัพท์เยอะๆ

## Input ที่รับจาก Workflow

- `sessionGroupName` — ชื่อ session group
- `objectives` — วัตถุประสงค์ของ session group
- `cefrLevel` — ระดับ CEFR
- `concept` — concept ที่ workflow คิดมาแล้ว (คำศัพท์, ประโยคตัวอย่าง, สถานการณ์)

## Action Types ที่ใช้

| Action | หน้าที่ใน Reading |
|--------|-------------------|
| `explain` | หัวข้อ คำแนะนำ สรุป |
| `reading` | เนื้อเรื่องหลัก บทอ่าน |
| `chat` | บทสนทนาระหว่างตัวละคร |
| `image` | ภาพประกอบ |
| `column` | layout คู่ (ภาพ + text) |

## Screen Template

### Pattern A: บทอ่าน + บทสนทนา (3 screens)

เหมาะกับ: หัวข้อที่มีทั้งเนื้อหาอ่านและบทสนทนา

```
Screen 1: "Introduction"
  [explain] — แนะนำหัวข้อ + คำแนะนำการอ่าน
  [image] — ภาพประกอบหัวข้อ

Screen 2: "Reading Passage"
  [reading] — เนื้อเรื่องหลัก (5-10 ประโยค)
  [explain] — สรุปคำศัพท์สำคัญที่เจอในบทอ่าน

Screen 3: "Conversation"
  [chat] — ตัวละคร A พูด (position: left)
  [chat] — ตัวละคร B ตอบ (position: right)
  [chat] — ตัวละคร A พูดต่อ (position: left)
  [chat] — ตัวละคร B ตอบ (position: right)
```

### Pattern B: บทอ่านยาว (2 screens)

เหมาะกับ: หัวข้อที่เน้นเนื้อหาอ่านเป็นหลัก ไม่ต้องมีบทสนทนา

```
Screen 1: "Introduction"
  [explain] — แนะนำหัวข้อ
  [column] — [image: ภาพประกอบ] + [reading: เกริ่นนำสั้นๆ]

Screen 2: "Reading Passage"
  [reading] — เนื้อเรื่องหลัก (8-15 ประโยค, คำศัพท์สำคัญมี highlight)
  [explain] — สรุปคำศัพท์ + ความหมาย
```

### Pattern C: บทสนทนาล้วน (2 screens)

เหมาะกับ: หัวข้อที่เน้นสถานการณ์การพูดคุย

```
Screen 1: "Setting"
  [explain] — อธิบายสถานการณ์
  [image] — ภาพสถานที่/สถานการณ์

Screen 2: "Conversation"
  [chat] — คนที่ 1 พูด (4-6 chat bubbles สลับกัน)
  [chat] — คนที่ 2 ตอบ
  ...
```

## JSON Template ตัวอย่าง (Pattern A)

```json
{
  "name": "Reading - ความหมายของคำคุณศัพท์",
  "type": "reading",
  "cefrLevel": "A1",
  "sequence": 0,
  "isActive": true,
  "screens": [
    {
      "id": "uuid-1",
      "sequence": 0,
      "actions": [
        {
          "id": "uuid-1-1",
          "type": "explain",
          "sequence": 0,
          "marginTop": 10,
          "marginBottom": 0,
          "text": [
            { "text": "What", "translation": ["อะไร"], "isBlank": false },
            { "text": "is", "translation": ["คือ"], "isBlank": false },
            { "text": "an", "translation": [], "isBlank": false },
            { "text": "Adjective?", "translation": ["คำคุณศัพท์"], "isBlank": false }
          ],
          "alignment": "center",
          "size": 24
        },
        {
          "id": "uuid-1-2",
          "type": "explain",
          "sequence": 1,
          "marginTop": 10,
          "marginBottom": 0,
          "text": [
            { "text": "An", "translation": [], "isBlank": false },
            { "text": "adjective", "translation": ["คำคุณศัพท์"], "isBlank": false, "bold": true, "highlight": true },
            { "text": "is", "translation": ["คือ"], "isBlank": false },
            { "text": "a", "translation": [], "isBlank": false },
            { "text": "word", "translation": ["คำ"], "isBlank": false },
            { "text": "that", "translation": ["ที่"], "isBlank": false },
            { "text": "describes", "translation": ["อธิบาย", "บรรยาย"], "isBlank": false },
            { "text": "a", "translation": [], "isBlank": false },
            { "text": "noun.", "translation": ["คำนาม"], "isBlank": false }
          ],
          "alignment": "left",
          "size": 16
        }
      ]
    },
    {
      "id": "uuid-2",
      "sequence": 1,
      "actions": [
        {
          "id": "uuid-2-1",
          "type": "reading",
          "sequence": 0,
          "marginTop": 10,
          "marginBottom": 0,
          "text": [
            { "text": "Tom", "translation": [], "isBlank": false },
            { "text": "has", "translation": ["มี"], "isBlank": false },
            { "text": "a", "translation": [], "isBlank": false },
            { "text": "big", "translation": ["ใหญ่"], "isBlank": false, "bold": true, "highlight": true },
            { "text": "house.", "translation": ["บ้าน"], "isBlank": false },
            { "text": "The", "translation": [], "isBlank": false },
            { "text": "house", "translation": ["บ้าน"], "isBlank": false },
            { "text": "is", "translation": ["เป็น/อยู่/คือ"], "isBlank": false },
            { "text": "beautiful.", "translation": ["สวยงาม"], "isBlank": false, "bold": true, "highlight": true },
            { "text": "It", "translation": ["มัน"], "isBlank": false },
            { "text": "has", "translation": ["มี"], "isBlank": false },
            { "text": "a", "translation": [], "isBlank": false },
            { "text": "small", "translation": ["เล็ก"], "isBlank": false, "bold": true, "highlight": true },
            { "text": "garden", "translation": ["สวน"], "isBlank": false },
            { "text": "with", "translation": ["กับ", "พร้อมกับ"], "isBlank": false },
            { "text": "colorful", "translation": ["สีสันสดใส"], "isBlank": false, "bold": true, "highlight": true },
            { "text": "flowers.", "translation": ["ดอกไม้"], "isBlank": false }
          ],
          "audioUrl": null,
          "isHide": false,
          "isReadable": true
        },
        {
          "id": "uuid-2-2",
          "type": "explain",
          "sequence": 1,
          "marginTop": 10,
          "marginBottom": 0,
          "text": [
            { "text": "คำคุณศัพท์ที่พบ:", "translation": [], "isBlank": false, "bold": true },
            { "text": "big", "translation": ["ใหญ่"], "isBlank": false, "highlight": true },
            { "text": "=", "translation": [], "isBlank": false },
            { "text": "ใหญ่,", "translation": [], "isBlank": false },
            { "text": "beautiful", "translation": ["สวยงาม"], "isBlank": false, "highlight": true },
            { "text": "=", "translation": [], "isBlank": false },
            { "text": "สวยงาม,", "translation": [], "isBlank": false },
            { "text": "small", "translation": ["เล็ก"], "isBlank": false, "highlight": true },
            { "text": "=", "translation": [], "isBlank": false },
            { "text": "เล็ก,", "translation": [], "isBlank": false },
            { "text": "colorful", "translation": ["สีสันสดใส"], "isBlank": false, "highlight": true },
            { "text": "=", "translation": [], "isBlank": false },
            { "text": "สีสันสดใส", "translation": [], "isBlank": false }
          ],
          "alignment": "left",
          "size": 14
        }
      ]
    },
    {
      "id": "uuid-3",
      "sequence": 2,
      "actions": [
        {
          "id": "uuid-3-1",
          "type": "chat",
          "sequence": 0,
          "marginTop": 10,
          "marginBottom": 0,
          "sender": { "name": "Anna", "imageUrl": "" },
          "position": "left",
          "text": [
            { "text": "Look", "translation": ["ดู"], "isBlank": false },
            { "text": "at", "translation": ["ที่"], "isBlank": false },
            { "text": "that", "translation": ["นั่น"], "isBlank": false },
            { "text": "tall", "translation": ["สูง"], "isBlank": false, "bold": true, "highlight": true },
            { "text": "building!", "translation": ["อาคาร", "ตึก"], "isBlank": false }
          ],
          "audioUrl": null,
          "isDisplay": true,
          "isReadable": true
        },
        {
          "id": "uuid-3-2",
          "type": "chat",
          "sequence": 1,
          "marginTop": 10,
          "marginBottom": 0,
          "sender": { "name": "Ben", "imageUrl": "" },
          "position": "right",
          "text": [
            { "text": "Yes,", "translation": ["ใช่"], "isBlank": false },
            { "text": "it's", "translation": ["มันเป็น"], "isBlank": false },
            { "text": "very", "translation": ["มาก"], "isBlank": false },
            { "text": "beautiful.", "translation": ["สวยงาม"], "isBlank": false, "bold": true, "highlight": true }
          ],
          "audioUrl": null,
          "isDisplay": true,
          "isReadable": true
        },
        {
          "id": "uuid-3-3",
          "type": "chat",
          "sequence": 2,
          "marginTop": 10,
          "marginBottom": 0,
          "sender": { "name": "Anna", "imageUrl": "" },
          "position": "left",
          "text": [
            { "text": "I", "translation": ["ฉัน"], "isBlank": false },
            { "text": "like", "translation": ["ชอบ"], "isBlank": false },
            { "text": "the", "translation": [], "isBlank": false },
            { "text": "old", "translation": ["เก่า"], "isBlank": false, "bold": true, "highlight": true },
            { "text": "temple", "translation": ["วัด"], "isBlank": false },
            { "text": "too.", "translation": ["ด้วย"], "isBlank": false }
          ],
          "audioUrl": null,
          "isDisplay": true,
          "isReadable": true
        },
        {
          "id": "uuid-3-4",
          "type": "chat",
          "sequence": 3,
          "marginTop": 10,
          "marginBottom": 0,
          "sender": { "name": "Ben", "imageUrl": "" },
          "position": "right",
          "text": [
            { "text": "The", "translation": [], "isBlank": false },
            { "text": "small", "translation": ["เล็ก"], "isBlank": false, "bold": true, "highlight": true },
            { "text": "garden", "translation": ["สวน"], "isBlank": false },
            { "text": "is", "translation": ["เป็น/อยู่/คือ"], "isBlank": false },
            { "text": "nice.", "translation": ["ดี", "สวย"], "isBlank": false, "bold": true, "highlight": true }
          ],
          "audioUrl": null,
          "isDisplay": true,
          "isReadable": true
        }
      ]
    }
  ]
}
```

## Guidelines เฉพาะ Reading

1. **คำศัพท์สำคัญต้อง highlight** — ใช้ `bold: true` + `highlight: true` สำหรับคำที่เป็น focus ของบทเรียน
2. **ทุกคำต้องมี translation** — ยกเว้น articles (a, an, the) และ conjunctions ง่ายๆ
3. **บทอ่านต้องมีบริบทชัดเจน** — ไม่ใช่ประโยคลอยๆ ต้องเป็นเรื่องราวที่ต่อเนื่อง
4. **Chat ต้องเป็นธรรมชาติ** — ใช้ชื่อคนจริง (Anna, Ben, Tom, Lisa) มีสถานการณ์ที่เข้าใจง่าย
5. **ปริมาณคำศัพท์ตาม CEFR**:
   - A1: 4-6 คำต่อบทอ่าน, ประโยคสั้น 3-5 คำ
   - A2: 6-8 คำ, ประโยค 5-8 คำ
   - B1: 8-12 คำ, ประโยค 8-12 คำ
   - B2+: 12+ คำ, ประโยคซับซ้อน
6. **ถ้าเนื้อหาเยอะ ให้แบ่งเป็นหลาย Reading sessions** — เช่น "Reading 1 - บทอ่าน", "Reading 2 - บทสนทนา"
